# Crypto Jobs Analytics
Hello! Welcome to Crypto Jobs Analytics, an AI-powered platform designed to provide insights into the crypto job market and optimize job search. 

[https://cryptojobs-analytics.vercel.app/](https://cryptojobs-analytics.vercel.app/)

## Content
📌 Table - Browse job listings with filters and search functionality. <br>
📌 Analysis - Gain insights into crypto job market with interactive dashboards. <br>
📌 Chat - Interact with analytics AI to explore crypto jobs database. <br>
📌 Methodology - Learn about the data collection and processing pipelines. <br>


## Stacks used
Data Collection: Selenium, BeautifulSoup <br>
Data Lake & Warehousing: Supabase <br>
Processing & Modeling: Python, OpenAI, Scikit-learn <br>
LLM Chat Integration: Pandas AI <br>
Data Visualization: Plotly, D3.js <br>
Infrastructure: Flask, React <br>
Deployment & Orchestration: Render, Vercel, GitHub Actions v

## Pipeline and Methodology

![pipeline](https://github.com/user-attachments/assets/e23add8b-d86a-49e7-bde0-b921d10de4a5)<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2721.914930192192 398.7803503186959" width="5443.829860384384" height="797.5607006373918"><!-- svg-source:excalidraw --><metadata></metadata>

1. Data Collection (ETL repo: <a href="https://github.com/ghrjeon/cryptojobs-pipeline" target="_blank" rel="noopener noreferrer">cryptojobs-pipeline</a>)
   - Defined data schema for ingestion consistency.
   - Scraped listings from crypto job boards using Selenium and BeautifulSoup.
   - Cleaned and processed data using Python and stored raw data in Supabase.  
3. Data Processing via ML/AI (ETL repo: <a href="https://github.com/ghrjeon/cryptojobs-pipeline" target="_blank" rel="noopener noreferrer">cryptojobs-pipeline</a>)
   - Generated semantic embeddings with OpenAI.
   - Applied cosine similarity to identify and eliminate duplicates.  
   - Assigned job functions and locations via keyword matching and LLM-based inference.  
   - Integrated fine-tuned LLMs to enhance classification accuracy.  
   - Stored processed datasets in Supabase and provisioned API for downstream applications.
4. Data Visualization
   - Designed dashboards using Plotly and D3.js for interactive visualization with auto-updates.  
5. AI Chat Integration
   - Integrated database with PandasAI for natural language analytics.  
   - Developed Flask backend to manage chat requests and responses.  
   - Built a React + JavaScript frontend to support interactive, multi-format AI responses.  

## Roadmap
- Service tool that builds portfolio roadmaps from job descriptions, enabling job seekers to align their work with required skills.
- Expand to additional data sources (e.g., jobstash.xyz).  
- Evaluate and refine LLMs models.  

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
