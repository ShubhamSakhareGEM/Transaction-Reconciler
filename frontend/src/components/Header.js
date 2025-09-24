import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #e8f5e8;
  border-radius: 20px;
  color: #2d5a2d;
  font-size: 14px;
  font-weight: 500;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
`;

export default function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <Icon>🏦</Icon>
          <div>
            <Title>Transaction Reconciler</Title>
            <Subtitle>Automated Bank Transaction Reconciliation</Subtitle>
          </div>
        </Logo>
        <Status>
          <StatusDot />
          System Ready
        </Status>
      </HeaderContent>
    </HeaderContainer>
  );
}

