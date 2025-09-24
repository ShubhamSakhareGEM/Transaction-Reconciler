import React, { useRef } from 'react';
import styled from 'styled-components';

const UploadContainer = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: ${props => props.hasFile ? '#f8f9fa' : '#fafafa'};
  border-color: ${props => props.hasFile ? '#667eea' : '#ddd'};

  &:hover {
    border-color: #667eea;
    background: #f8f9fa;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const UploadIcon = styled.div`
  font-size: 24px;
  color: #667eea;
`;

const UploadText = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

const FileName = styled.div`
  font-size: 14px;
  color: #666;
  word-break: break-all;
`;

const FileSize = styled.div`
  font-size: 12px;
  color: #999;
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background: #c82333;
  }
`;

export default function FileUpload({ label, file, onFileChange, accept }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
        {label}
      </label>
      <UploadContainer hasFile={!!file} onClick={handleClick}>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
        />
        <UploadContent>
          <UploadIcon>📁</UploadIcon>
          {file ? (
            <>
              <UploadText>File Selected</UploadText>
              <FileName>{file.name}</FileName>
              <FileSize>{formatFileSize(file.size)}</FileSize>
              <RemoveButton onClick={handleRemove}>Remove</RemoveButton>
            </>
          ) : (
            <>
              <UploadText>Click to upload or drag and drop</UploadText>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {accept && `Accepted formats: ${accept}`}
              </div>
            </>
          )}
        </UploadContent>
      </UploadContainer>
    </div>
  );
}

