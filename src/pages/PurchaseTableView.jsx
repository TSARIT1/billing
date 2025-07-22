// components/PurchaseTableView.js
import React from 'react';

const PurchaseTableView = ({ 
  products, 
  handleEdit, 
  handleDelete, 
  totalQty, 
  totalPurchase, 
  grandPurchase, 
  isLoading,
  setShowPreview,
  handleSave
}) => {
  return (
    <div className="modern-table-container">
      {isLoading ? (
        <div className="modern-loading">Loading purchases...</div>
      ) : (
        <>
          <div className="modern-table-wrapper">
            <table className="modern-data-table">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Date</th>
                  <th>Product Name</th>
                  <th>Purchase Price</th>
                  <th>MRP</th>
                  <th>Sale Price</th>
                  <th>Vendor</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id || item.barcode}>
                    <td>{item.barcode}</td>
                    <td>{item.purchaseDate}</td>
                    <td>{item.productName}</td>
                    <td>₹{item.purchasePrice?.toFixed(2)}</td>
                    <td>₹{item.mrp?.toFixed(2)}</td>
                    <td>₹{item.salePrice?.toFixed(2)}</td>
                    <td>{item.vendor || '--'}</td>
                    <td>{item.quantity} {item.unitType}</td>
                    <td>₹{(item.purchasePrice * item.quantity).toFixed(2)}</td>
                    <td className="actions-cell">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="modern-action-btn edit"
                      >
                        edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="modern-action-btn delete"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modern-summary-cards">
            <div className="modern-summary-card">
              <h3>Total Items</h3>
              <p>{products.length}</p>
            </div>
            <div className="modern-summary-card">
              <h3>Total Quantity</h3>
              <p>{totalQty}</p>
            </div>
            <div className="modern-summary-card">
              <h3>Avg. Purchase Price</h3>
              <p>₹{products.length > 0 ? (totalPurchase / products.length).toFixed(2) : 0}</p>
            </div>
            <div className="modern-summary-card highlight">
              <h3>Grand Total</h3>
              <p>₹{grandPurchase.toFixed(2)}</p>
            </div>
          </div>

          <div className="modern-save-section">
            <button 
              onClick={() => setShowPreview(true)}
              disabled={products.length === 0} 
              className="modern-btn preview"
            >
              Preview Purchase
            </button>
            
            <button 
              onClick={handleSave} 
              disabled={isLoading || products.length === 0} 
              className="modern-btn save"
            >
              {isLoading ? 'Saving...' : 'Save All Purchases'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PurchaseTableView;