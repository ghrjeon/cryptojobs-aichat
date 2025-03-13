import React from 'react';
import styled from '@emotion/styled';

const DotsContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #2c3e50;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

function LoadingDots() {
  return (
    <DotsContainer>
      <Dot delay={0} />
      <Dot delay={0.2} />
      <Dot delay={0.4} />
    </DotsContainer>
  );
}

export default LoadingDots; 