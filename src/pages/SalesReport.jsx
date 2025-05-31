import React, { useState } from 'react';
import { FaPrint, FaTimes, FaDownload, FaSpinner, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import './salereport.css';

const SalesReport = () => {
  const [laserReport, setLaserReport] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [productName, setProductName] = useState('All');
  const [prodFrom, setProdFrom] = useState('');
  const [prodTo, setProdTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [activeTab, setActiveTab] = useState('date');

  const validateDates = () => {
    if ((activeTab === 'date' && fromDate && toDate && new Date(fromDate) > new Date(toDate)) ||
        (activeTab === 'product' && prodFrom && prodTo && new Date(prodFrom) > new Date(prodTo))) {
      setError('End date must be after start date');
      return false;
    }
    return true;
  };

  const fetchReportData = async () => {
    if (!validateDates()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = generateDummyData();
      setReportData(data);
      setSuccess(`Report generated with ${data.length} records`);
      return data;
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateDummyData = () => {
    const baseData = [
      { id: 1, Date: '2025-5-10', Product: 'Product A', Quantity: 5, Amount: 150, Profit: 30 },
      { id: 2, Date: '2025-5-11', Product: 'Product A', Quantity: 3, Amount: 90, Profit: 18 },
      { id: 3, Date: '2025-5-12', Product: 'Product B', Quantity: 7, Amount: 210, Profit: 42 },
      { id: 4, Date: '2025-5-13', Product: 'Product C', Quantity: 2, Amount: 100, Profit: 20 },
      { id: 5, Date: '2025-5-14', Product: 'Product A', Quantity: 8, Amount: 240, Profit: 48 },
    ];

    // Filter based on product selection
    let filteredData = productName === 'All' 
      ? baseData 
      : baseData.filter(item => item.Product === productName);

    // Filter based on date range
    if (activeTab === 'date' && fromDate && toDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.Date);
        return itemDate >= new Date(fromDate) && itemDate <= new Date(toDate);
      });
    } else if (activeTab === 'product' && prodFrom && prodTo) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.Date);
        return itemDate >= new Date(prodFrom) && itemDate <= new Date(prodTo);
      });
    }

    return filteredData;
  };

  const handleGenerateReport = async () => {
    await fetchReportData();
  };

  const handleDownload = async () => {
    if (reportData.length === 0) {
      const data = await fetchReportData();
      if (!data || data.length === 0) return;
    }

    const headers = activeTab === 'product' 
      ? ['Date', 'Product', 'Quantity', 'Amount', 'Profit']
      : ['Date', 'Product', 'Quantity', 'Amount'];

    const csvContent = [
      headers,
      ...reportData.map(d => activeTab === 'product' 
        ? [d.Date, d.Product, d.Quantity, d.Amount, d.Profit]
        : [d.Date, d.Product, d.Quantity, d.Amount])
    ]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${activeTab}_sale_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    // In a real app, implement actual print functionality
    window.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="sr-container">
      <div className="sr-header">
        <h2 className="sr-title">Sales Analytics Report</h2>
        <div className="sr-actions">
          <button 
            className="sr-button sr-button-primary"
            onClick={handlePrint}
            disabled={isLoading || reportData.length === 0}
          >
            <FaPrint />
            <span>Print</span>
          </button>
          <button 
            className="sr-button sr-button-secondary"
            onClick={handleDownload}
            disabled={isLoading || reportData.length === 0}
          >
            <FaDownload />
            <span>Export</span>
          </button>
        </div>
      </div>

      {error && <div className="sr-alert sr-alert-error">{error}</div>}
      {success && <div className="sr-alert sr-alert-success">{success}</div>}

      <div className="sr-tabs">
        <button
          className={`sr-tab ${activeTab === 'date' ? 'active' : ''}`}
          onClick={() => setActiveTab('date')}
        >
          Date Wise Report
        </button>
        <button
          className={`sr-tab ${activeTab === 'product' ? 'active' : ''}`}
          onClick={() => setActiveTab('product')}
        >
          Product Wise Profit
        </button>
      </div>

      <div className="sr-report-controls">
        {activeTab === 'date' ? (
          <>
            <div className="sr-filter-group">
              <label className="sr-checkbox-label">
                <input 
                  type="checkbox" 
                  className="sr-checkbox"
                  checked={laserReport} 
                  onChange={() => setLaserReport(!laserReport)} 
                />
                <span>Detailed Laser Report</span>
              </label>
            </div>

            <div className="sr-date-filters">
              <div className="sr-date-input">
                <label className="sr-label">From Date</label>
                <div className="sr-date-wrapper">
                  <FaCalendarAlt className="sr-date-icon" />
                  <input 
                    type="date" 
                    className="sr-input"
                    value={fromDate} 
                    onChange={(e) => setFromDate(e.target.value)} 
                  />
                </div>
              </div>

              <div className="sr-date-input">
                <label className="sr-label">To Date</label>
                <div className="sr-date-wrapper">
                  <FaCalendarAlt className="sr-date-icon" />
                  <input 
                    type="date" 
                    className="sr-input"
                    value={toDate} 
                    onChange={(e) => setToDate(e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="sr-filter-group">
              <label className="sr-label">Product</label>
              <select 
                className="sr-select"
                value={productName} 
                onChange={(e) => setProductName(e.target.value)}
              >
                <option value="All">All Products</option>
                <option value="Product A">Product A</option>
                <option value="Product B">Product B</option>
                <option value="Product C">Product C</option>
              </select>
            </div>

            <div className="sr-date-filters">
              <div className="sr-date-input">
                <label className="sr-label">From Date</label>
                <div className="sr-date-wrapper">
                  <FaCalendarAlt className="sr-date-icon" />
                  <input 
                    type="date" 
                    className="sr-input"
                    value={prodFrom} 
                    onChange={(e) => setProdFrom(e.target.value)} 
                  />
                </div>
              </div>

              <div className="sr-date-input">
                <label className="sr-label">To Date</label>
                <div className="sr-date-wrapper">
                  <FaCalendarAlt className="sr-date-icon" />
                  <input 
                    type="date" 
                    className="sr-input"
                    value={prodTo} 
                    onChange={(e) => setProdTo(e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <button 
          className="sr-button sr-button-generate"
          onClick={handleGenerateReport}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="sr-spinner" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FaFilter />
              <span>Generate Report</span>
            </>
          )}
        </button>
      </div>

      {reportData.length > 0 && (
        <div className="sr-results">
          <div className="sr-summary-cards">
            <div className="sr-card">
              <h3>Total Records</h3>
              <p>{reportData.length}</p>
            </div>
            <div className="sr-card">
              <h3>Total Quantity</h3>
              <p>{reportData.reduce((sum, item) => sum + item.Quantity, 0)}</p>
            </div>
            <div className="sr-card">
              <h3>Total Amount</h3>
              <p>{formatCurrency(reportData.reduce((sum, item) => sum + item.Amount, 0))}</p>
            </div>
            {activeTab === 'product' && (
              <div className="sr-card">
                <h3>Total Profit</h3>
                <p>{formatCurrency(reportData.reduce((sum, item) => sum + item.Profit, 0))}</p>
              </div>
            )}
          </div>

          <div className="sr-table-container">
            <table className="sr-data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  {activeTab === 'product' && <th>Profit</th>}
                </tr>
              </thead>
              <tbody>
                {reportData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.Date}</td>
                    <td>{item.Product}</td>
                    <td>{item.Quantity}</td>
                    <td>{formatCurrency(item.Amount)}</td>
                    {activeTab === 'product' && <td>{formatCurrency(item.Profit)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;