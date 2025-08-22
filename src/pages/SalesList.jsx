import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SalesList.css';
import api from '../service/api';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/sales/', {
          params: {
            search: searchTerm,
            page: currentPage,
            page_size: itemsPerPage
          }
        });
        setSales(response.data.results);
        setTotalPages(Math.ceil(response.data.count / itemsPerPage));
        setLoading(false);
       
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSales();
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, itemsPerPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
  };

  const handleCloseDetails = () => {
    setSelectedSale(null);
  };

  if (loading && currentPage === 1) return <div className="sale-r-loading">Loading sales...</div>;
  if (error) return <div className="sale-r-error">Error: {error}</div>;


  const handleDownloadPdf = async (saleId) => {
  try {
    const response = await api.get(`/api/sales/${saleId}/sale_pdf/`, {
      responseType: 'blob' // Important for file downloads
    });
    
    // Create a blob URL for the PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice_${selectedSale.invoice_number}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to download invoice. Please try again.');
  }
};

  return (
    <div className="sale-r-container">
      <h1 className="sale-r-title">Sales History</h1>
      
      <div className="sale-r-controls">
        <div className="sale-r-search">
          <input
            type="text"
            placeholder="Search by customer, invoice, or product..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="sale-r-search-input"
          />
          <span className="sale-r-search-icon">🔍</span>
        </div>
      </div>
      
      <div className="sale-r-list">
        {sales.length > 0 ? (
          sales.map((sale) => (
            <div key={sale.id} className="sale-r-card">
              <div className="sale-r-card-header">
                <span className="sale-r-invoice">Invoice #{sale.invoice_number}</span>
                <span className="sale-r-date">{new Date(sale.sale_date).toLocaleDateString()}</span>
              </div>
              
              <div className="sale-r-card-body">
                <div className="sale-r-customer">
                  <span className="sale-r-customer-name">{sale.customer_name || 'Walk-in Customer'}</span>
                  {sale.customer_phone && (
                    <span className="sale-r-customer-phone">{sale.customer_phone}</span>
                  )}
                </div>
                
                <div className="sale-r-summary">
                  <span className="sale-r-items-count">{sale.items.length} items</span>
                  <span className="sale-r-total">₹{sale.total_amount}</span>
                </div>
              </div>
              
              <div className="sale-r-card-footer">
                <button 
                  className="sale-r-details-btn"
                  onClick={() => handleViewDetails(sale)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="sale-r-no-results">
            No sales found matching your search criteria.
          </div>
        )}
      </div>

 {totalPages > 1 && Number.isFinite(totalPages) && (
  <div className="sale-r-pagination">
    <button
      className="sale-r-pagination-btn"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </button>

    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      let pageNum;
      if (totalPages <= 5) {
        pageNum = i + 1;
      } else if (currentPage <= 3) {
        pageNum = i + 1;
      } else if (currentPage >= totalPages - 2) {
        pageNum = totalPages - 4 + i;
      } else {
        pageNum = currentPage - 2 + i;
      }

      return (
        <button
          key={pageNum}
          className={`sale-r-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
          onClick={() => handlePageChange(pageNum)}
        >
          {pageNum}
        </button>
      );
    })}


          
          <button
            className="sale-r-pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {selectedSale && (
        <div className="sale-r-modal">
          <div className="sale-r-modal-content">
            <div className="sale-r-modal-header">
              <h2>Invoice #{selectedSale.invoice_number}</h2>
              <button className="sale-r-close-btn" onClick={handleCloseDetails}>×</button>
            </div>
            
            <div className="sale-r-modal-body">
              <div className="sale-r-customer-info">
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> {selectedSale.customer_name || 'Walk-in Customer'}</p>
                {selectedSale.customer_phone && <p><strong>Phone:</strong> {selectedSale.customer_phone}</p>}
                {selectedSale.customer_address && <p><strong>Address:</strong> {selectedSale.customer_address}</p>}
              </div>
              
              <div className="sale-r-items-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Tax</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.sale_price}</td>
                        <td>{item.tax_rate}% (₹{item.tax_amount})</td>
                        <td>₹{item.total_amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="sale-r-totals">
                <div className="sale-r-total-row">
                  <span>Subtotal:</span>
                  <span>₹{selectedSale.taxable_amount}</span>
                </div>
                <div className="sale-r-total-row">
                  <span>Tax:</span>
                  <span>₹{selectedSale.tax_amount}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="sale-r-total-row">
                    <span>Discount:</span>
                    <span>-₹{selectedSale.discount}</span>
                  </div>
                )}
                <div className="sale-r-total-row sale-r-grand-total">
                  <span>Grand Total:</span>
                  <span>₹{selectedSale.total_amount}</span>
                </div>
              </div>
            </div>
            
            <div className="sale-r-modal-footer">
                <button className="sale-r-print-btn" onClick={() => handleDownloadPdf(selectedSale.id)}>Download Invoice</button>
              <button className="sale-r-print-btn">Print Invoice</button>
              <button className="sale-r-close-modal-btn" onClick={handleCloseDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesList;