import matplotlib
matplotlib.use('Agg')  # Use a non-GUI backend

from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import os
import dotenv
import pandasai as pai
import json 
from flask_cors import CORS
from supabase import create_client, Client
import base64
import shutil
import uuid
import re
import sys
import webbrowser
import subprocess
from pandasai_litellm.litellm import LiteLLM

dotenv.load_dotenv()

# Monkey patch os.system to prevent xdg-open from being called
original_system = os.system
def patched_system(command):
    if 'xdg-open' in command:
        print(f"Blocked command: {command}")
        return 0
    return original_system(command)
os.system = patched_system

# Additional patches to prevent file opening
webbrowser.open = lambda url: print(f"Blocked webbrowser.open({url})")

# If needed, also patch subprocess
original_run = subprocess.run
def patched_run(*args, **kwargs):
    if args and isinstance(args[0], (list, tuple)) and any('xdg-open' in str(arg) for arg in args[0]):
        print(f"Blocked subprocess.run with xdg-open")
        return None
    return original_run(*args, **kwargs)
subprocess.run = patched_run

# Ensure exports/charts directory exists
charts_dir = os.path.join(os.getcwd(), 'exports', 'charts')
os.makedirs(charts_dir, exist_ok=True)

supabaseUrl = os.getenv("REACT_APP_SUPABASE_URL")
supabaseKey = os.getenv("REACT_APP_SUPABASE_KEY")

supabase: Client = create_client(supabaseUrl, supabaseKey)

app = Flask(__name__)
CORS(app) 

# Load job data
supabase_db = pd.DataFrame()

for i in range(0, 5000, 1000):
    try:
        supabase_response = (
            supabase.table("jobs_clean")
            .select("*")
            .gte('ingestion_date', '2025-03-01')
            .range(i, i+999)
            .execute()
        )
        
        # Check if data exists and is not None
        if supabase_response and hasattr(supabase_response, 'data') and supabase_response.data:
            batch_df = pd.DataFrame(supabase_response.data)
            supabase_db = pd.concat([supabase_db, batch_df])
        else:
            print("No data returned for batch starting at index", i)
            break
    except Exception as e:
        print(f"Error processing batch starting at index {i}: {e}")
        break


# supabase_response = (
#     supabase.table("jobs_clean")
#     .select("*")
#     .execute()
# )

df_data = pd.DataFrame(supabase_db)
df_data = df_data[df_data['job_function'] != 'Unknown']
print(df_data.shape)
# df_data = pd.DataFrame(supabase_response.data)
df_data = df_data[['title', 'company', 'location', 'job_function', 'salary_amount', 
                   'skills', 'source', 'job_url', 'posted_date', 'job_id'
                   ]]

# # Set PandasAI API key
# pai.api_key.set(os.getenv("PANDASAI_API_KEY"))


# Initialize LiteLLM with your OpenAI model
llm = LiteLLM(model="gpt-4.1-mini", api_key=os.getenv("OPENAI_API_KEY"))

# Configure PandasAI to use this LLM
pai.config.set({
    "llm": llm
})

# Create PandasAI DataFrame
job_df = pai.DataFrame(df_data)

print(job_df.columns)
print(job_df.dtypes)

# Route to serve chart images - add both paths for compatibility
@app.route('/exports/charts/<filename>')
@app.route('/api/exports/charts/<filename>')
def serve_chart(filename):
    try:
        directory = os.path.join(os.getcwd(), 'exports', 'charts')
        full_path = os.path.join(directory, filename)
        print(f"Attempting to serve chart from: {full_path}")
        
        if not os.path.exists(full_path):
            print(f"File not found: {full_path}")
            return jsonify({'error': 'Chart not found'}), 404
            
        return send_from_directory(directory, filename)
    except Exception as e:
        print(f"Error serving chart: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Route to handle chat requests
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        query = request.json.get('query')
        print(query)
        if not query:
            return jsonify({'error': 'No query provided'}), 400

        response = job_df.chat(query)
        print("Raw response:", response)  # Debug log
        
        response_json_str = response.to_json()
        response_json = json.loads(response_json_str)
        
        # If it's an error response, include more details
        if response_json.get('type') == 'error':
            result = {
                'type': 'error',
                'code': response_json.get('last_code_executed'),
                'value': response_json.get('value'),
                'error_details': {
                    'raw_response': str(response),
                    'executed_code': response_json.get('last_code_executed'),
                    'error_message': response_json.get('value')
                }
            }
            print("Error details:", result)  
            return jsonify({'result': result})

        # Extract the values from response
        if response_json.get('type') == 'dataframe':

            df_data_dict = response_json.get('value')
            df_data = pd.DataFrame(
                data=df_data_dict["data"],
                columns=df_data_dict["columns"],
                index=df_data_dict["index"]
            )
            json_str = df_data.to_json(orient="records")

            result = {'type': response_json.get('type'), 
                     'code': response_json.get('last_code_executed'), 
                     'value': json_str}
            print(result)
        
        elif response_json.get('type') == 'chart':
            # Extract just the filename from the path
            chart_path = response_json.get('value')
            chart_filename = os.path.basename(chart_path)
            
            # Construct the URL path (adjust domain as needed)
            chart_url = f"/api/exports/charts/{chart_filename}"
            
            result = {
                'type': response_json.get('type'), 
                'code': response_json.get('last_code_executed'), 
                'value': chart_url  # Return the URL instead of the file path
            }
            print('chart result')

        elif response_json.get('type') == 'string':
            result = {'type': response_json.get('type'), 
                     'code': response_json.get('last_code_executed'), 
                     'value': response_json.get('value')}
            print(result)

        else:
            result = {'type': response_json.get('type'), 
                     'code': response_json.get('last_code_executed'), 
                     'value': response_json.get('value')}
            print(result)

        return jsonify({'result': result})
    except Exception as e:
        print(f"Exception occurred: {str(e)}")  # Debug log
        return jsonify({
            'error': {
                'message': str(e),
                'type': type(e).__name__
            }
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
    # app.run(host='0.0.0.0', port=5001, debug=True)