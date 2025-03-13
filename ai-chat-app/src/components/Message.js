import React from 'react';
import styled from '@emotion/styled';

const MessageContainer = styled.div`
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

const Timestamp = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 4px;
`;

function Message({ text, isUser, timestamp }) {
  return (
    <MessageContainer isUser={isUser}>
      {text}
      {timestamp && <Timestamp>{new Date(timestamp).toLocaleTimeString()}</Timestamp>}
    </MessageContainer>
  );
}

export default Message; 