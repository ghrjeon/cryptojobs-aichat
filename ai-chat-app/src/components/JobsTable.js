import { useEffect, useState } from 'react';
import CleanedTable from './CleanedTable';
import styled from '@emotion/styled';
const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
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