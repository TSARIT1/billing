import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './addsale.css';

const PurchaseEntry = () => {
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [unitTypes, setUnitTypes] = useState(['PCS', 'KG', 'L', 'M', 'BOX']);

  const [form, setForm] = useState({
    barcode: '',
    productName: '',
    purchasePrice: '',
    quantity: '',
    unitType: 'PCS',
    purchaseDate: new Date().toISOString().split('T')[0],
    mrp: '',
    salePrice: '',
    vendor: '',
  });

  // Fetch vendors on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('/api/vendors');
        setVendors(Array.isArray(response.data) ? response.data : response.data.vendors || []);
      } catch (err) {
        console.error('Error fetching vendors:', err);
      }
    };
    fetchVendors();
  }, []);

  // Fetch existing purchases on component mount
  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/purchases');
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to fetch purchases');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (!form.productName || !form.purchasePrice || !form.quantity) {
      setError('Product name, purchase price, and quantity are required');
      return false;
    }
    if (isNaN(form.purchasePrice) || isNaN(form.quantity)) {
      setError('Price and quantity must be numbers');
      return false;
    }
    setError('');
    return true;
  };

  const handleAdd = () => {
    if (!validateForm()) return;

    const newProduct = {
      barcode: form.barcode || `PRD-${Date.now()}`,
      productName: form.productName,
      purchasePrice: parseFloat(form.purchasePrice),
      quantity: parseInt(form.quantity),
      unitType: form.unitType,
      purchaseDate: form.purchaseDate,
      mrp: parseFloat(form.mrp) || parseFloat(form.purchasePrice) * 1.2,
      salePrice: parseFloat(form.salePrice) || parseFloat(form.purchasePrice) * 1.15,
      vendor: form.vendor,
      retailPrice: parseFloat(form.salePrice) || parseFloat(form.purchasePrice) * 1.15,
      stockQty: parseInt(form.quantity),
    };

    setProducts([...products, newProduct]);
    resetForm();
  };

  const handleEdit = (product) => {
    setForm({
      barcode: product.barcode,
      productName: product.productName,
      purchasePrice: product.purchasePrice,
      quantity: product.quantity,
      unitType: product.unitType,
      purchaseDate: product.purchaseDate,
      mrp: product.mrp,
      salePrice: product.salePrice,
      vendor: product.vendor,
    });
    setEditId(product.id);
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    
    const updatedProducts = products.map(product => 
      product.id === editId ? { 
        ...product, 
        ...form,
        purchasePrice: parseFloat(form.purchasePrice),
        quantity: parseInt(form.quantity),
        mrp: parseFloat(form.mrp),
        salePrice: parseFloat(form.salePrice),
        retailPrice: parseFloat(form.salePrice),
        stockQty: parseInt(form.quantity)
      } : product
    );
    
    setProducts(updatedProducts);
    resetForm();
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const resetForm = () => {
    setForm({
      barcode: '',
      productName: '',
      purchasePrice: '',
      quantity: '',
      unitType: 'PCS',
      purchaseDate: new Date().toISOString().split('T')[0],
      mrp: '',
      salePrice: '',
      vendor: '',
    });
  };

  const handleCancel = () => {
    resetForm();
    setEditId(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/purchases', { purchases: products });
      setSuccess('Purchases saved successfully!');
      setProducts(response.data); // Update with any server-generated IDs
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save purchases');
    } finally {
      setIsLoading(false);
    }
  };

const totalQty = Array.isArray(products)
  ? products.reduce((sum, item) => sum + Number(item.quantity), 0)
  : 0;

const totalPurchase = Array.isArray(products)
  ? products.reduce((sum, item) => sum + Number(item.purchasePrice), 0)
  : 0;

const grandPurchase = Array.isArray(products)
  ? products.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0)
  : 0;


  return (
    <div className="ad-page-container">
      <button className="ad-close-button" onClick={() => navigate(-1)}>X</button>
      <h2 className="ad-title">Purchase Entry</h2>

      {error && <div className="ad-error">{error}</div>}
      {success && <div className="ad-success">{success}</div>}

      <div className="ad-form-grid">
        <div className="ad-form-group">
          <label>Barcode</label>
          <input 
            name="barcode" 
            value={form.barcode} 
            onChange={handleChange} 
            placeholder="BarCode/Code" 
            className="ad-input"
          />
        </div>

        <div className="ad-form-group">
          <label>Product Name*</label>
          <input 
            name="productName" 
            value={form.productName} 
            onChange={handleChange} 
            placeholder="Product Name" 
            className="ad-input"
            required
          />
        </div>

        <div className="ad-form-group">
          <label>Purchase Price*</label>
          <input 
            name="purchasePrice" 
            value={form.purchasePrice} 
            onChange={handleChange} 
            type="number" 
            placeholder="Purchase Price" 
            className="ad-input"
            required
          />
        </div>

        <div className="ad-form-group">
          <label>Quantity*</label>
          <input 
            name="quantity" 
            value={form.quantity} 
            onChange={handleChange} 
            type="number" 
            placeholder="Purchase Qty" 
            className="ad-input"
            required
          />
        </div>

        <div className="ad-form-group">
          <label>Unit Type</label>
          <select 
            name="unitType" 
            value={form.unitType} 
            onChange={handleChange} 
            className="ad-select"
          >
            {unitTypes.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="ad-form-group">
          <label>Purchase Date</label>
          <input 
            name="purchaseDate" 
            value={form.purchaseDate} 
            onChange={handleChange} 
            type="date" 
            className="ad-input"
          />
        </div>

        <div className="ad-form-group">
          <label>MRP</label>
          <input 
            name="mrp" 
            value={form.mrp} 
            onChange={handleChange} 
            type="number" 
            placeholder="MRP" 
            className="ad-input"
          />
        </div>

        <div className="ad-form-group">
          <label>Sale Price</label>
          <input 
            name="salePrice" 
            value={form.salePrice} 
            onChange={handleChange} 
            type="number" 
            placeholder="Sale Price" 
            className="ad-input"
          />
        </div>

        <div className="ad-form-group">
          <label>Vendor</label>
          <select 
            name="vendor" 
            value={form.vendor} 
            onChange={handleChange} 
            className="ad-select"
          >
            <option value="">Select Vendor</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ad-button-group">
        {editId ? (
          <>
            <button onClick={handleUpdate} className="ad-button ad-update-btn">Update</button>
            <button onClick={handleCancel} className="ad-button ad-cancel-btn">Cancel</button>
          </>
        ) : (
          <button onClick={handleAdd} className="ad-button ad-add-btn">Add New</button>
        )}
        
        <button onClick={handleSave} disabled={isLoading || products.length === 0} className="ad-button ad-save-btn">
          {isLoading ? 'Saving...' : 'Save'}
        </button>
        
        <button onClick={() => navigate('/')} className="ad-button ad-exit-btn">Exit</button>
      </div>

      <div className="ad-summary">
        <div className="ad-summary-item">
          <span>Total Items:</span>
          <span>{products.length}</span>
        </div>
        <div className="ad-summary-item">
          <span>Total Qty:</span>
          <span>{totalQty}</span>
        </div>
        <div className="ad-summary-item">
          <span>Avg. Purchase Price:</span>
          <span>₹{products.length > 0 ? (totalPurchase / products.length).toFixed(2) : 0}</span>
        </div>
        <div className="ad-summary-item">
          <span>Grand Total:</span>
          <span>₹{grandPurchase.toFixed(2)}</span>
        </div>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="ad-loading">Loading purchases...</div>
      ) : (
        <div className="ad-table-container">
          <table className="ad-product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Barcode</th>
                <th>Date</th>
                <th>Name</th>
                <th>MRP</th>
                <th>Purchase</th>
                <th>Vendor</th>
                <th>Qty</th>
                <th>Sale Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id || item.barcode}>
                  <td>{item.id || '--'}</td>
                  <td>{item.barcode}</td>
                  <td>{item.purchaseDate}</td>
                  <td>{item.productName}</td>
                  <td>₹{item.mrp?.toFixed(2)}</td>
                  <td>₹{item.purchasePrice?.toFixed(2)}</td>
                  <td>{item.vendor || '--'}</td>
                  <td>{item.quantity} {item.unitType}</td>
                  <td>₹{item.salePrice?.toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(item)} 
                      className="ad-action-btn ad-edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="ad-action-btn ad-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseEntry;