import { useEffect, useState } from 'react';
import CleanedTable from './CleanedTable';
import styled from '@emotion/styled';

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

const TitleContainer = styled.div`
  padding: 10px;
  margin: auto ;
`;

function JobsTable() {
    return (
        <>
        <TitleContainer>
            <Title>Crypto Jobs Database</Title>
        </TitleContainer>
        <div>
         <CleanedTable />    
        </div>
        </>
    )
}

export default JobsTable;