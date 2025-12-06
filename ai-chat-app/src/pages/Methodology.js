import React from 'react';
import styled from '@emotion/styled';
import ReactMarkdown from 'react-markdown';
import pipeline from '../pages/pipeline.svg';

const HomeContainer = styled.div`
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #000000;
  font-size: 56px;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const SectionTitle = styled.h3`
  color: #1d1d1f;
  font-size: 28px;
  font-weight: 600;
  margin-top: 48px;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
`;

const Description = styled.div`
  color: #6e6e73;
  line-height: 1.6;
  font-size: 18px;
  margin-bottom: 32px;
  
  h3 {
    color: #1d1d1f;
    font-size: 24px;
    font-weight: 600;
    margin: 32px 0 16px;
    letter-spacing: -0.01em;
  }
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  font-size: 17px;
  line-height: 1.6;
  color: #1d1d1f;

  li {
    position: relative;
    padding-left: 24px;
    margin-bottom: 12px;

    &:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #0071e3;
    }

    strong {
      font-weight: 600;
      color: #1d1d1f;
    }
  }
`;

const LinksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin: 48px 0;
`;

const LinkCard = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background-color: #ffffff;
  border-radius: 16px;
  text-decoration: none;
  color: #1d1d1f;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.12);
  }

  code {
    font-family: "SF Mono", SFMono-Regular, ui-monospace, monospace;
    font-size: 15px;
    font-weight: 500;
    color: #0071e3;
    letter-spacing: -0.01em;
  }

  span {
    margin-left: 12px;
    font-size: 18px;
    opacity: 0.5;
    transition: opacity 0.2s ease;
  }

  &:hover span {
    opacity: 1;
  }
`;

const MethodologySection = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const Home = () => {
  return (
    <HomeContainer>
      <Title>Methodology</Title>
      <img style={{width: '100%', height: 'auto', marginTop: '10px', marginBottom: '20px'}} src={pipeline} alt="Methodology" />

      <MethodologySection>
      <ReactMarkdown>
            {`
## 1. Data Collection  
    - Defined data schema for ingestion consistency.
    - Scraped listings from crypto job boards using Selenium and BeautifulSoup.
    - Cleaned and processed data using Python and stored raw data in Supabase.  

## 2. Data Augmentation   
    - Generated semantic embeddings with OpenAI.
    - Applied cosine similarity to identify and eliminate duplicates.  
    - Assigned job functions and locations via keyword matching and LLM-based inference.  
    - Integrated fine-tuned LLMs to enhance classification accuracy.  
    - Stored processed datasets in Supabase and provisioned API for downstream applications.  

## 4. Data Visualization  
    - Designed dashboards using Plotly and D3.js for interactive visualization with auto-updates.  

## 3. AI Chat Integration  
    - Integrated database with PandasAI for natural language analytics.  
    - Developed Flask backend to manage chat requests and responses.  
    - Built a React + JavaScript frontend to support interactive, multi-format AI responses.  

## 5. Roadmap  
    - Service tool that builds portfolio roadmaps from job descriptions, enabling job seekers to align their work with required skills.
    - Expand to additional data sources (e.g., jobstash.xyz).  
    - Evaluate and refine LLMs models.  
          `}
          </ReactMarkdown>
      </MethodologySection>
      <MethodologySection> 
      <ReactMarkdown>
              {`
## Stacks Used  
    - Data Collection: Selenium, BeautifulSoup
    - Data Lake & Warehousing: Supabase
    - Processing & Modeling: Python, OpenAI, Scikit-learn
    - LLM Chat Integration: Pandas AI
    - Data Visualization: Plotly, D3.js
    - Infrastructure: Flask, React
    - Deployment & Orchestration: Render, Vercel, GitHub Actions
          `}
        </ReactMarkdown>
        </MethodologySection>
      {/* <LinksContainer>
        <LinkCard 
          href="https://github.com/ghrjeon/cryptojobs-aichat" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <code>GitHub to this project</code>
          <span>↗︎</span>
        </LinkCard>

        <LinkCard 
          href="https://www.linkedin.com/in/ghrjeon" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <code>LinkedIn</code>
          <span>↗︎</span>
        </LinkCard>
      </LinksContainer> */}

    </HomeContainer>
  );
};

export default Home; 