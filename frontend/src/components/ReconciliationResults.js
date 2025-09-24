import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import Pagination from './Pagination';

const ResultsContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ResultsHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
`;

const Title = styled.h2`
  margin: 0 0 10px 0;
  font-size: 24px;
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 30px;
  background: #f8f9fa;
`;

const SummaryCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  border-left: 4px solid ${props => props.color || '#667eea'};
`;

const SummaryValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: ${props => props.color || '#333'};
  margin-bottom: 4px;
`;

const SummaryLabel = styled.div`
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableContainer = styled.div`
  padding: 30px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }
  
  &:hover {
    background: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: top;
`;

const RuleBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.rule) {
      case 'ID_MATCH': return '#d4edda';
      case 'AMOUNT_DATE_MATCH': return '#cce5ff';
      default: return '#f8d7da';
    }
  }};
  color: ${props => {
    switch (props.rule) {
      case 'ID_MATCH': return '#155724';
      case 'AMOUNT_DATE_MATCH': return '#004085';
      default: return '#721c24';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ITEMS_PER_PAGE = 10;

export default function ReconciliationResults({ data }) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedMatches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.matches.slice(startIndex, endIndex);
  }, [data.matches, currentPage]);

  const totalPages = Math.ceil(data.matches.length / ITEMS_PER_PAGE);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <ResultsContainer>
      <ResultsHeader>
        <Title>Reconciliation Results</Title>
        <Subtitle>Analysis completed successfully</Subtitle>
      </ResultsHeader>

      <SummaryGrid>
        <SummaryCard color="#28a745">
          <SummaryValue color="#28a745">{data.totalTransactions}</SummaryValue>
          <SummaryLabel>Total Transactions</SummaryLabel>
        </SummaryCard>
        <SummaryCard color="#17a2b8">
          <SummaryValue color="#17a2b8">{data.totalReferences}</SummaryValue>
          <SummaryLabel>Total References</SummaryLabel>
        </SummaryCard>
        <SummaryCard color="#28a745">
          <SummaryValue color="#28a745">{data.matched}</SummaryValue>
          <SummaryLabel>Matched</SummaryLabel>
        </SummaryCard>
        <SummaryCard color="#dc3545">
          <SummaryValue color="#dc3545">{data.unmatchedTransactions}</SummaryValue>
          <SummaryLabel>Unmatched Transactions</SummaryLabel>
        </SummaryCard>
        <SummaryCard color="#ffc107">
          <SummaryValue color="#ffc107">{data.unmatchedReferences}</SummaryValue>
          <SummaryLabel>Unmatched References</SummaryLabel>
        </SummaryCard>
      </SummaryGrid>

      <TableContainer>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
          Matched Transactions ({data.matches.length} total)
        </h3>
        
        {data.matches.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <div>No matches found</div>
          </EmptyState>
        ) : (
          <>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Transaction ID</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Reference ID</TableHeaderCell>
                  <TableHeaderCell>Match Rule</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {paginatedMatches.map((match, index) => (
                  <TableRow key={index}>
                    <TableCell>{match.txnId || '—'}</TableCell>
                    <TableCell>{formatAmount(match.txnAmount)}</TableCell>
                    <TableCell>{formatDate(match.txnDate)}</TableCell>
                    <TableCell>{match.referenceId || '—'}</TableCell>
                    <TableCell>
                      <RuleBadge rule={match.rule}>
                        {match.rule?.replace(/_/g, ' ') || 'Unknown'}
                      </RuleBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </TableContainer>
    </ResultsContainer>
  );
}

