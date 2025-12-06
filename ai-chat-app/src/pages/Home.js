import React from 'react';
import styled from '@emotion/styled';
import CleanedTable from '../components/CleanedTable';
import ReactMarkdown from 'react-markdown';

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

const Description = styled.div`
  color:rgb(55, 55, 57);
  line-height: 1.6;
  font-size: 21px;
  margin-bottom: 32px;
  max-width: 900px;
  letter-spacing: -0.003em;
  
  br {
    display: none;
    
    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const Subtitle = styled.h2`
  color: #415a77;
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 24px;
`;

const TableContainer = styled.div`
  margin: 32px 0;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;



const SectionTitle = styled.h3`
  margin-top: 28px;
  margin-bottom: 12px;
  color: #1b263b;
`;

const List = styled.ul`
  list-style-type: disc;
  margin-left: 20px;
  padding: 0;
  font-size: 1.05rem;
  line-height: 1.5;
`;

const LinksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
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

const Home = () => {
  return (
    <HomeContainer>
      <Title>Crypto Jobs Analytics</Title>
      <Description>
      Crypto job market is decentralized.
      This platform aggregates crypto job listings and provides data insights to help optimize job search.
      </Description>

     <ReactMarkdown>  
      {`
    📌 Table - Browse job listings with filters and search functionality.
    📌 Analysis - Gain insights into crypto job market with interactive dashboards.
    📌 Chat - Interact with analytics AI to explore crypto jobs database.
    📌 Methodology - Learn about the data collection and processing pipelines.`}
      </ReactMarkdown>

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
          <code>Rosalyn's LinkedIn</code>
          <span>↗︎</span>
        </LinkCard>

        <LinkCard 
          href="https://dune.com/theano2247" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <code>Rosalyn's Dune Dashboard</code>
          <span>↗︎</span>
        </LinkCard>
      </LinksContainer> */}
    </HomeContainer>
  );
};

export default Home;
