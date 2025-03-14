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
  margin-top: 20px;
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
      <Title>Welcome to Rosalyn's Crypto Jobs Analytics!</Title>
      <br></br>
      <Description>
        <h3>Discover and analyze crypto job trends!</h3>
        <p>
          📌 Methodology - Learn about the data collection and processing pipeline.<br />
          📌 Chat - Interact with AI to explore crypto jobs database.<br />
          📌 Analysis - Gain insights into crypto job market with interactive dashboards.<br />
          📌 Table - Browse job listings with advanced filters and search functionality.
        </p>
      </Description>
      <br></br>

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
        </List>
      </Description>

      <br></br>
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

        <LinkCard 
          href="https://dune.com/theano2247/me-and-tensor-market-analysis" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <code>Rosalyn's Dune Dashboard</code>
          <span>↗︎</span>
        </LinkCard>
        <LinkCard 
          href="https://rosalyn.observablehq.cloud/rosalyn-analytics/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <code>Rosalyn's Blockchain and Twitter Analytics</code>
          <span>↗︎</span>
        </LinkCard>
      </LinksContainer>
    </HomeContainer>
  );
};

export default Home; 