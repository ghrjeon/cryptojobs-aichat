import React from 'react';
import styled from '@emotion/styled';

const ErrorContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border: 1px solid #ff0000;
  border-radius: 4px;
  background-color: #fff5f5;
  color: #ff0000;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page and try again.</p>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 