# Crypto Jobs Analytics

Hello! Welcome to Rosalyn's Crypto Jobs Analytics, an AI-powered platform designed to provide insights into the crypto job market and optimize job search while showcasing my data science and engineering skills. 

https://rosalyn-cryptojobs-ai.vercel.app/

## Project goals
- Demonstrate my skills in: <br>
   - Advanced Web scraping for comprehensive data collection
   - Leveraging ML and AI for data processing
   - Utilizing cloud warehousing for seamless data accessibility
   - Developing a custom AI chatbot specialized in data analysis
   - Building a full-stack system with a Python backend API and a React/JavaScript frontend
   - Creating interactive dashboards for insightful data visualization
- Streamline my job search by:
   - Aggregating crypto job listings into a structured, searchable database
   - Analyzing job market trends to uncover insights into the crypto job landscape

This project integrates web scraping, ML, NLP, LLM, and full-stack development to enhance analytics and job discovery. Hope you find this project valuable!<br>

## Content
📌 Chat - Interact with AI to explore crypto jobs database. <br>
📌 Analysis - Gain insights into crypto job market with interactive dashboards. <br>
📌 Table - Browse job listings with advanced filters and search functionality. <br>
📌 Methodology - Learn about the data collection and processing pipeline.

## Stacks used
<b>Data Collection</b>: Selenium, BeautifulSoup <br>
<b>Data Lake/Warehousing</b>: Supabase <br>
<b>Data Processing</b>: Python, OpenAI, Scikit-learn <br>
<b>LLM Chat Integration</b>: Pandas AI <br>
<b>Data Visualization</b>: Plotly, D3.js <br>
<b>Backend</b>: Python, Flask <br>
<b>Frontend</b>: React, JavaScript <br>
<b>Orchestration</b>: GitHub Actions <br>

## Pipeline and Methodology
1. Data Collection (ETL repo: <a href="https://github.com/ghrjeon/cryptojobs-pipeline" target="_blank" rel="noopener noreferrer">cryptojobs-pipeline</a>)
   - Define a structured schema for data collection.
   - Perform web scraping using Selenium and BeautifulSoup.
   - Store scraped data in Supabase and create APIs for access. 
3. Data Processing via ML/AI (ETL repo: <a href="https://github.com/ghrjeon/cryptojobs-pipeline" target="_blank" rel="noopener noreferrer">cryptojobs-pipeline</a>)
   - Clean and preprocess fetched data using Python.
   - Generate embeddings via OpenAI and apply cosine similarity (Scikit-learn) to remove duplicates.
   - Infer job functions and locations using OpenAI.
   - Store processed data in Supabase and create an API for access.
4. AI Chat Integration
   - Load processed data into PandasAI for chat-based querying.
   - Flask backend handles message processing and responses.
   - React + JavaScript frontend interacts with the backend API.
5. Data Visualization
   - Build interactive dashboards and insights using Plotly and D3.js.

## Next steps
- Add more data sources (e.g., jobstash.xyz)

# Directory Structure  
      .
      ├── ai-chat-app                   # Frontend React Application 
      │   ├── src
      │   │   ├── components            # UI components for Analytics Dashboard
      │   │   ├── pages
      │   │   │   ├── Analysis.js       # Analytics Dashboard 
      │   │   │   ├── ChatInterface.js  # AI Chat Interface 
      │   │   │   ├── Home.js           # Home Page  
      │   │   │   └── Methodology.js    # Methodology and Pipeline description 
      │   │   ├── utils
      │   │   │   └── dataService.js    # Handles API requests to the Python backend
      │   │   └── index.js
      │   └── package.json              # Frontend dependencies 
      │
      └── ai-chat-python                # Python Backend
          ├── api                       
          │   └── ai_service.py         # Handles AI model queries (PandasAI)
          └── requirements.txt          # Backend dependencies 

# Requirements 
- Python 3.11+
- Flask 3.0.2
- Supabase 1.2.0
- PandasAI 3.0.0+
- Scikit-Learn 1.6.1
- OpenAI 1.65.4
- Pandas 1.5.3
- Numpy 1.24.4
- Matplotlib 3.5.1
- Seaborn 0.12.2
- React-plotly.js 2.6.0
- API Keys (PandasAI, OpenAI, Supabase) <br>
- Note: older package versions used to reduce dependency size
