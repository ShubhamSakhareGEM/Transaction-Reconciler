import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import LoadingSpinner from './components/LoadingSpinner';
import ReconciliationResults from './components/ReconciliationResults';
import Header from './components/Header';
import { GlobalStyles } from './styles/GlobalStyles';

const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  margin: 0;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin: 10px 0;
  border-left: 4px solid #c33;
`;

export default function App() {
  const [txFile, setTxFile] = useState(null);
  const [refFile, setRefFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateCSV = useCallback((file) => {
    if (!file) return { isValid: true };
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return { isValid: false, message: 'Please select a CSV file' };
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return { isValid: false, message: 'File size must be less than 10MB' };
    }
    
    return { isValid: true };
  }, []);

  const handleFileChange = useCallback((file, type) => {
    const validation = validateCSV(file);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }
    
    if (type === 'transaction') {
      setTxFile(file);
      toast.success('Transaction file uploaded successfully');
    } else {
      setRefFile(file);
      toast.success('Reference file uploaded successfully');
    }
    setError(null);
  }, [validateCSV]);

  const handleRun = async () => {
    if (!txFile || !refFile) {
      toast.error('Please upload both transaction and reference files');
      return;
    }

    setLoading(true);
    setReport(null);
    setError(null);

    try {
      // Upload transaction file
      const txFormData = new FormData();
      txFormData.append('file', txFile);
      await axios.post(`${API_BASE}/api/upload/transactions`, txFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Upload reference file
      const refFormData = new FormData();
      refFormData.append('file', refFile);
      await axios.post(`${API_BASE}/api/upload/reference`, refFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Run reconciliation
      const response = await axios.get(`${API_BASE}/api/reconcile`);
      setReport(response.data);
      toast.success('Reconciliation completed successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during reconciliation';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTxFile(null);
    setRefFile(null);
    setReport(null);
    setError(null);
    toast.info('Form reset successfully');
  };

  return (
    <AppContainer>
      <GlobalStyles />
      <Header />
      <MainContent>
        <Card>
          <h2 style={{ marginTop: 0, color: '#333' }}>Transaction Reconciler</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Upload your transaction and reference CSV files to perform automated reconciliation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <FileUpload
              label="Transactions CSV"
              file={txFile}
              onFileChange={(file) => handleFileChange(file, 'transaction')}
              accept=".csv"
            />
            <FileUpload
              label="Reference CSV"
              file={refFile}
              onFileChange={(file) => handleFileChange(file, 'reference')}
              accept=".csv"
            />
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button onClick={handleRun} disabled={loading || !txFile || !refFile}>
              {loading ? <LoadingSpinner size="small" /> : null}
              {loading ? 'Running Reconciliation...' : 'Run Reconciliation'}
            </Button>
            <Button 
              onClick={handleReset} 
              disabled={loading}
              style={{ background: '#6c757d' }}
            >
              Reset
            </Button>
          </div>
        </Card>

        {report && (
          <ReconciliationResults data={report} />
        )}
      </MainContent>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AppContainer>
  );
}