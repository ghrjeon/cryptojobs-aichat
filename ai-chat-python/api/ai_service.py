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

dotenv.load_dotenv()

# Ensure exports/charts directory exists
os.makedirs(os.path.join(os.getcwd(), 'exports', 'charts'), exist_ok=True)

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


supabase_response = (
    supabase.table("jobs_clean")
    .select("*")
    .execute()
)
df_data = pd.DataFrame(supabase_db)
print(df_data.shape)
# df_data = pd.DataFrame(supabase_response.data)
df_data = df_data[['title', 'company', 'location', 'job_function', 'salary_amount', 
                   'skills', 'source', 'job_url', 'posted_date', 'job_id'
                   ]]

# Configure PandasAI with custom settings for headless environment
pai_config = pai.config.Config(
    save_charts=True,
    save_charts_path=os.path.join(os.getcwd(), 'exports', 'charts'),
    open_charts=False,  # Don't try to open charts with xdg-open
    enable_cache=True
)

job_df = pai.DataFrame(df_data, config=pai_config)

print(job_df.columns)
print(job_df.dtypes)

pai.api_key.set(os.getenv("PANDASAI_API_KEY"))

# Route to serve chart images
@app.route('/exports/charts/<filename>')
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

# Helper function to handle chart files
def process_chart_file(chart_path):
    try:
        # If the chart path is a temporary file, copy it to our exports directory
        if '/tmp/' in chart_path:
            filename = os.path.basename(chart_path)
            destination = os.path.join(os.getcwd(), 'exports', 'charts', filename)
            shutil.copy2(chart_path, destination)
            return os.path.join('/exports/charts', filename)
        elif chart_path.startswith('/exports/charts/'):
            return chart_path
        else:
            # If it's already a relative path, just return it
            return chart_path
    except Exception as e:
        print(f"Error processing chart file: {str(e)}")
        return chart_path

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
            # Process the chart path to ensure it's accessible
            chart_path = response_json.get('value')
            processed_path = process_chart_file(chart_path)
            
            result = {
                'type': response_json.get('type'), 
                'code': response_json.get('last_code_executed'), 
                'value': processed_path
            }
            print(f'Chart generated at: {processed_path}')

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