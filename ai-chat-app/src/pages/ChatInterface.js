import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { searchData } from '../utils/dataService';
import LoadingDots from '../components/LoadingDots';
import * as d3 from 'd3';
import DataTable from 'react-data-table-component';
import CleanedTable from '../components/CleanedTable';
import { customStyles } from '../components/customStyle';

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
  padding: 0;
  margin-bottom: 22px;
`;

const ChatInterfaceContainer = styled.div`
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;


const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 500px;
  min-height: 200px;
`;

const MessageInput = styled.input`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 1rem;
  flex: 1;
`;

const SendButton = styled.button`
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #34495e;
  }
`;

const InputContainer = styled.form`
  display: flex;
  gap: 1rem;
`;

const Message = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  max-width: 80%;
  ${props => props.isUser ? `
    background-color: #2c3e50;
    color: white;
    align-self: flex-end;
  ` : `
    background-color: #f0f0f0;
    align-self: flex-start;
  `}
`;

const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #34495e;
  }
`;
const TipContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  border-radius: 8px;
  margin: 0 auto;
`;

const BubbleButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  align-items: center;
  margin-top: 0;
`;

const BubbleButton = styled.button`
  background-color:rgb(253, 229, 229);
  border: none;
  border-radius: 18px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #e0e0e0;
  }
`;

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDataFrame, setIsDataFrame] = useState(false);
  const [tableData, setTableData] = useState([]);
  const tableRef = useRef(null);
  const [isChart, setIsChart] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [currentResponse, setCurrentResponse] = useState({
    type: null,
    data: null
  });
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: 'Hey there! How may I assist with your data analysis?'
    }]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError(null); // Clear previous errors
    setCurrentResponse({ type: null, data: null });
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending query:', input);
      const aiResponse = await searchData(input, messages);
      console.log('AI Response:', aiResponse); // Debug log
      
      setIsLoading(false);

      if (aiResponse.type === 'error') {
        // Handle error response
        setError({
          message: aiResponse.value,
          code: aiResponse.code,
          details: aiResponse.error_details
        });
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${aiResponse.value}`
        }]);
        
        // Optionally display the code that caused the error
        console.error('Error details:', {
          message: aiResponse.value,
          code: aiResponse.code,
          details: aiResponse.error_details
        });
        return;
      } 

      if (aiResponse.type === 'string' || aiResponse.type === 'number') {
        setCurrentResponse({
          type: aiResponse.type,
          data: aiResponse.value
        });
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: aiResponse.value
        }]);
      }
      else {
        // Handle successful response
        setCurrentResponse({
          type: aiResponse.type,
          data: aiResponse.value
        });

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `See the ${aiResponse.type} below!`
        }]);
      }
    } catch (error) {
      console.error('Request error:', error);
      setIsLoading(false);
      setError({
        message: 'PandasAI is having issues. Please try again later.',
        details: error.message
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    }
  };

  const renderChart = (data) => {
    if (!data) {
        return <p>No data available.</p>;
    }
    
    // Use the API_URL as the base URL for the chart
    const API_URL = 'https://ai-chat-python-backend.onrender.com';
    
    // If data is already a full URL, use it directly
    // Otherwise, if it's a relative path, prepend the API_URL
    const chartUrl = data.startsWith('http') 
        ? data 
        : `${API_URL}${data}`;
    
    console.log('Chart URL:', chartUrl);
    
    return (
        <div>
            <img 
                src={chartUrl} 
                alt="Chart" 
                style={{ maxWidth: '100%', height: 'auto' }}
                onError={(e) => {
                    console.error('Error loading chart:', e);
                    console.log('Failed URL:', e.target.src);
                }}
            />
        </div>
    );
  }

  const renderTable = (data) => {
    if (data.length === 0) {
      return <p>No data available.</p>;
    }

    // Define columns based on the keys of the first data object
    const columns = Object.keys(data[0]).map(key => {
      // Calculate max content length for this column
      const maxLength = Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      );
      
      // Set width based on content length (with some padding)
      const estimatedWidth = Math.min(Math.max(maxLength * 10, 100), 400);
      
      // Default column configuration for other columns
      return {
        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize column names
        selector: row => row[key],
        sortable: true,
        width: `${estimatedWidth}px`,
        wrap: true,
        cell: row => (
          <div style={{ 
            whiteSpace: 'normal', 
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {row[key]}
          </div>
        ),
      };
    });

    return (
      <DataTable
        data={data}
        columns={columns}
        progressPending={isLoading}
        pagination
        dense
        customStyles={customStyles}
        style={{ width: '80vw' }}
      />
    );
  }

  // Render response based on current type
  const renderResponse = () => {
    if (!currentResponse.type) return null;

    switch (currentResponse.type) {
      case 'dataframe':
        return (
          <div>
            <h3>DataFrame Response:</h3>
            <div ref={tableRef}>
              {renderTable(JSON.parse(currentResponse.data))}
            </div>
          </div>
        );
      
      case 'chart':
        return (
          <div>
            <h3>Chart Response:</h3>
            {renderChart(currentResponse.data)}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Add an error display component
  const ErrorDisplay = ({ error }) => {
    if (!error) return null;
    return (
      <div style={{ 
        padding: '1rem', 
        margin: '1rem 0', 
        backgroundColor: '#fff3f3', 
        border: '1px solid #ffcdd2',
        borderRadius: '4px' 
      }}>
        <h4 style={{ color: '#d32f2f', margin: '0 0 0.5rem' }}>Error</h4>
        <p style={{ margin: '0 0 0.5rem' }}>{error.message}</p>
        {error.code && (
          <details>
            <summary>Show Error Details</summary>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '0.5rem', 
              overflow: 'auto' 
            }}>
              {error.code}
            </pre>
          </details>
        )}
      </div>
    );
  };

  // Add example prompts array
  const examplePrompts = [
    "What are the top 5 highest-paying jobs?",
    "Which country has the most job listings?",
    "How many postings are there in each job function category?",
    "Show me a bar chart of average salary by job function - lables should be fully visible."
  ];
  
  // Add this function to handle clicking a bubble button
  const handlePromptClick = (prompt) => {
    setInput(prompt);
  };

  return (
    <ChatInterfaceContainer>
      <TitleContainer>
        <Title>Chat with Crypto Jobs Database</Title>
        <ToggleButton onClick={() => setShowTable(!showTable)}>
          {showTable ? 'Hide Data Table' : 'Show Data Table'}
        </ToggleButton>
      </TitleContainer>
      {showTable && (
          <CleanedTable />
      )}
      <TipContainer>
        <h2>Try out these prompts!</h2>
        <BubbleButtonsContainer>
          {examplePrompts.map((prompt, index) => (
            <BubbleButton 
              key={index} 
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </BubbleButton>
          ))}
        </BubbleButtonsContainer>
      </TipContainer>
      <ChatContainer>
        <MessagesContainer>
        <MessagesWrapper>
          {messages.map((message, index) => (
            <Message key={index} isUser={message.role === 'user'}>
              {message.content}
            </Message>
          ))}
          {isLoading && (
            <Message isUser={false}>
              <LoadingDots />
            </Message>
          )}
        </MessagesWrapper>
      </MessagesContainer>
      <InputContainer onSubmit={handleSubmit}>
        <MessageInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <SendButton type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </SendButton>
      </InputContainer>
      <br></br>
      {/* Add error display */}
      <ErrorDisplay error={error} />
      
      {/* Render current response */}
      {renderResponse()}
    </ChatContainer>
    <div style={{ height: '100px' }}></div>
    </ChatInterfaceContainer>
  );
}

export default ChatInterface; 