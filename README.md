# Crypto Jobs Analytics

Hello! This is Rosalyn's Crypto Jobs Analytics platform powered by AI.

## Content
📌 Chat - Interact with AI to explore crypto jobs database. <br>
📌 Analysis - Gain insights into crypto job market with interactive dashboards. <br>
📌 Table - Browse job listings with advanced filters and search functionality. <br>

## Stacks used
<b>Data Collection</b>: Selenium, BeautifulSoup <br>
<b>Data Warehousing</b>: Supabase <br>
<b>Data Processing</b>: Python, OpenAI, Scikit-learn <br>
<b>LLM Chat Integration</b>: Pandas AI <br>
<b>Data Visualization</b>: Plotly, D3.js <br>
<b>Backend</b>: Python, Flask <br>
<b>Frontend</b>: React, JavaScript <br>

## Pipeline
1. Data Retrieval
   - Fetches data from Supabase (collected from crypto job boards).
   - Web scraping is performed using Selenium and BeautifulSoup (scripts not included in this pipeline).
3. Data Processing 
   - Cleans and processes data using Python.
   - Generates embeddings via OpenAI and applies cosine similarity (Scikit-learn) to remove duplicates.
   - Job functions and locations are inferred using OpenAI.
   - The processed data is stored in Supabase, and API is created for access.
4. AI Chat Integration
   - Loads processed data into PandasAI for chat-based querying.
   - Flask backend manages message processing and responses.
   - React + JavaScript frontend interacts with the backend API.
5. Data Visualization
   - Creates interactive dashboards and insights using Plotly and D3.js.

## Next steps
- Add more data sources (e.g., jobstash.xyz)
- Automate dag using Airflow


# Directory Structure  
.
├── ai-chat-app                   # Frontend React Application 
│   ├── src
│   │   ├── components            # UI components for Analytics Dashboard
│   │   ├── pages
│   │   │   ├── Analysis.js       # Analytics Dashboard 
│   │   │   ├── ChatInterface.js  # Chat Interface 
│   │   │   └── Home.js           # Home Page 
│   │   ├── utils
│   │   │   └── dataService.js    # Handles API requests to the Python backend
│   │   └── index.js
│   └── package.json              # Frontend dependencies 
│
└── ai-chat-python                # Python Backend
    ├── ai_service.py             # Handles AI model queries (PandasAI)
    ├── ingestion
    │   └── infer.py              # Data processing and inference using OpenAI & Scikit-learn
    └── requirements.txt  

# Requirements

 
