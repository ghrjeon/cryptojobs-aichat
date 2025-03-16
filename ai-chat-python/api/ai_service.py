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

dotenv.load_dotenv()

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

job_df = pai.DataFrame(df_data)

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

# Route to handle chat requests
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        query = request.json.get('query')
        print(query)
        if not query:
            return jsonify({'error': 'No query provided'}), 400

        response = job_df.chat(query)
        
        # Handle different response types
        try:
            # Try to convert to JSON string first
            response_json_str = response.to_json()
            response_json = json.loads(response_json_str)
            print(response_json)
            
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
            
            elif response_json.get('type') == 'chart':
                result = {'type': response_json.get('type'), 
                         'code': response_json.get('last_code_executed'), 
                         'value': response_json.get('value')}

            elif response_json.get('type') == 'string':
                result = {'type': response_json.get('type'), 
                         'code': response_json.get('last_code_executed'), 
                         'value': response_json.get('value')}

            else:
                result = {'type': response_json.get('type'), 
                         'code': response_json.get('last_code_executed'), 
                         'value': str(response_json.get('value'))}  # Convert to string as fallback
                
        except (AttributeError, TypeError) as e:
            # If response is not JSON serializable, handle it differently
            print(f"Response serialization error: {str(e)}")
            
            # Determine the type of response
            if isinstance(response, pd.DataFrame):
                json_str = response.to_json(orient="records")
                result = {
                    'type': 'dataframe',
                    'code': 'Direct DataFrame result',
                    'value': json_str
                }
            else:
                # For any other type, convert to string
                result = {
                    'type': 'string',
                    'code': 'Direct result',
                    'value': str(response)
                }

        return jsonify({'result': result})
    except Exception as e:
        import traceback
        traceback.print_exc()
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