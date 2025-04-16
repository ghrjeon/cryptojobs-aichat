import React from 'react';
import styled from '@emotion/styled';
import ReactMarkdown from 'react-markdown';

const HomeContainer = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Description = styled.div`
  color: #34495e;
  line-height: 1.3;
  font-size: 1.1rem;
`;

const List = styled.ul`
  list-style-type: disc;
  margin-left: 20px;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1.4;
  margin-top: 0
`;

const LinksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const LinkCard = styled.a`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
  }

  code {
    font-family: monospace;
  }

  span {
    margin-left: 8px;
  }
`;

const Home = () => {
  return (
    <HomeContainer>

      <Title>Methodology</Title>
      <Description>
        <ReactMarkdown>
          {`
1. Data Collection:
   - Schema is defined for data collection
   - Data is scraped from crypto job boards using Selenium and BeautifulSoup
   - Collected data is stored in Supabase, and APIs are created for access

2. Data Processing:
   - Collected data is processed using Python
   - Embeddings are generated via OpenAI
   - Duplicate entries are detected and removed using Cosine Similarity (Scikit-learn)
   - Job functions and Locations are inferred via keyword matching and LLM via OpenAI
   - Processed data is stored in Supabase, and APIs are created for access
   - ETL is orchestrated via GitHub Actions

3. AI Chat Integration:
   - Processed data is loaded into PandasAI for chat integration
   - Python Flask backend is built to handle message processing and responses
   - React + JavaScript chat interface is built to service various AI response formats

4. Data Visualization:
   - Dashboard is built and data insights are visualized using Plotly and D3.js

5. Next Steps:
   - Add more data sources (e.g., jobstash.xyz )
   - Fine-tune LLM to optimize job function inference
   - Create backup AI service to handle PandasAI outage
          `}
        </ReactMarkdown>
      </Description>
      <Description>
        <h3>Stacks Used:</h3>
        <List>
          <li>Data Collection: Selenium, BeautifulSoup</li>
          <li>Data Warehousing: Supabase</li>
          <li>Data Processing: Python, OpenAI, Scikit-learn</li>
          <li>LLM Chat Integration: Pandas AI</li>
          <li>Data Visualization: Plotly, D3.js</li>
          <li>Backend: Python, Flask</li>
          <li>Frontend: React, JavaScript</li>
          <li>Deployment: Render, Vercel</li>
          <li>Orchestration: GitHub Actions</li>
        </List>
      </Description>
      <LinksContainer>
        <LinkCard 
          href="https://github.com/ghrjeon/cryptojobs-aichat" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <code>Github to this project</code>
          <span>↗︎</span>
        </LinkCard>

        <LinkCard 
          href="https://www.linkedin.com/in/ghrjeon" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <code>Rosalyn's LinkedIn</code>
          <span>↗︎</span>
        </LinkCard>
      </LinksContainer>

    </HomeContainer>
  );
};

export default Home; 