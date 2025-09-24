import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  width: ${props => props.size === 'small' ? '16px' : '24px'};
  height: ${props => props.size === 'small' ? '16px' : '24px'};
  animation: ${spin} 1s linear infinite;
  display: inline-block;
`;

export default function LoadingSpinner({ size = 'medium' }) {
  return <Spinner size={size} />;
}

