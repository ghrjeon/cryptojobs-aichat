import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from '@emotion/styled';
import Sidebar from './components/Sidebar';
import ChatInterface from './pages/ChatInterface';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';
import Analysis from './pages/Analysis';
import JobsTable from './components/JobsTable';
import Methodology from './pages/Methodology';
import { GlobalStyles } from './styles/globalStyles';
const AppContainer = styled.div`
  display: flex;
  background-color: #ffffff;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${props => props.isOpen ? '280px' : '80px'};
  padding: 40px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #ffffff;
`;

function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Router>
      <GlobalStyles />
      <ErrorBoundary>
        <AppContainer>
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <MainContent isOpen={isOpen}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/data" element={<JobsTable />} />
              <Route path="/analysis" element={<Analysis />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </ErrorBoundary>
    </Router>
  );
}

export default App; 