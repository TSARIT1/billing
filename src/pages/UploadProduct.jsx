import React, { useState } from 'react';
import axios from 'axios';
import './UploadProduct.css';
import api from '../service/api';

const UploadProduct = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus(null);
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('error');
      setErrors(['Please select a file to upload']);
      return;
    }

    setIsLoading(true);
    setUploadStatus(null);
    setErrors([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/import-products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setUploadStatus('success');
      if (response.data.errors && response.data.errors.length > 0) {
        setErrors(response.data.errors);
      }
      alert("file upload success...!")
    } catch (error) {
      setUploadStatus('error');
      if (error.response) {
        setErrors([error.response.data.error || 'Upload failed']);
      } else {
        setErrors(['Network error. Please try again.']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const templateHeaders = [
      'product_name', 'product_code', 'category', 'unit', 
      'purchase_price', 'selling_price', 'stock_quantity', 
      'min_stock_level', 'barcode', 'tax_rate', 'discount', 
      'expiry_date', 'manufacturer', 'supplier', 'description', 'is_active'
    ].join(',');

    const blob = new Blob([templateHeaders], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="up-container">
      <div className="up-card">
        <h2 className="up-title">Upload Products</h2>
        
        <div className="up-instructions">
          <p>Upload a CSV or Excel file with product data. The file should contain these fields:</p>
          <ul className="up-fields-list">
            <li>product_name (required)</li>
            <li>product_code</li>
            <li>category</li>
            <li>unit</li>
            <li>purchase_price (required)</li>
            <li>selling_price (required)</li>
            <li>stock_quantity</li>
            <li>min_stock_level</li>
            <li>barcode</li>
            <li>tax_rate</li>
            <li>discount</li>
            <li>expiry_date</li>
            <li>manufacturer</li>
            <li>supplier</li>
            <li>description</li>
            <li>is_active</li>
          </ul>
          <button 
            className="up-download-btn"
            onClick={downloadTemplate}
          >
            Download Template
          </button>
        </div>

        <form onSubmit={handleSubmit} className="up-form">
          <div className="up-file-input-container">
            <label htmlFor="file-upload" className="up-file-label">
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="up-file-input"
            />
            {file && (
              <div className="up-file-name">
                Selected: {file.name}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="up-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload Products'}
          </button>
        </form>

        {uploadStatus === 'success' && (
          <div className="up-success-message">
            Products uploaded successfully!
          </div>
        )}

        {uploadStatus === 'error' && errors.length > 0 && (
          <div className="up-error-container">
            <h4 className="up-error-title">Upload Errors:</h4>
            <ul className="up-error-list">
              {errors.map((error, index) => (
                <li key={index} className="up-error-item">
                  {typeof error === 'object' ? JSON.stringify(error) : error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProduct;