import React from 'react';
import styled from '@emotion/styled';

const ErrorContainer = styled.div`
  padding: 20px;
  background-color: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  margin: 10px 0;
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  margin: 0;
  font-size: 14px;
`;

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Map Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorMessage>
            There was an error loading the map. Please try refreshing the page.
          </ErrorMessage>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
