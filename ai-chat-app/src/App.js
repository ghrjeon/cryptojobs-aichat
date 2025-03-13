import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from '@emotion/styled';
import Sidebar from './components/Sidebar';
import ChatInterface from './pages/ChatInterface';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';
import Analysis from './pages/Analysis';
import JobsTable from './components/JobsTable';
import Methodology from './pages/Methodology';
const AppContainer = styled.div`
  display: flex;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${props => props.sidebarWidth};
  padding: 20px;
  transition: margin-left 0.3s ease;
  background-color: #f5f5f5;
`;

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AppContainer>
          <Sidebar />
          <MainContent sidebarWidth="220px">
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