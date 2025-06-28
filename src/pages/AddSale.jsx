import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './addsale.css';

const PurchaseEntry = () => {
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [unitTypes] = useState(['PCS', 'KG', 'L', 'M', 'BOX']);

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

  // Fetch vendors and purchases on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [vendorsRes, purchasesRes] = await Promise.all([
          axios.get('/api/vendors'),
          axios.get('/api/purchases')
        ]);
        
        setVendors(Array.isArray(vendorsRes.data) ? vendorsRes.data : vendorsRes.data.vendors || []);
        setProducts(Array.isArray(purchasesRes.data) ? purchasesRes.data : []);
      } catch (err) {
        toast.error('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (!form.productName || !form.purchasePrice || !form.quantity) {
      toast.error('Product name, purchase price, and quantity are required');
      return false;
    }
    if (isNaN(form.purchasePrice) || isNaN(form.quantity)) {
      toast.error('Price and quantity must be numbers');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validateForm()) return;

    const newProduct = {
      id: Date.now().toString(),
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
    toast.success('Product added to list');
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
    setShowForm(true);
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
    toast.success('Product updated');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/purchases/${id}`);
        setProducts(products.filter(product => product.id !== id));
        toast.success('Product deleted');
      } catch (err) {
        toast.error('Failed to delete product');
      }
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
      setProducts(response.data);
      toast.success('Purchases saved successfully!');
    } catch (err) {
      toast.error('Failed to save purchases');
    } finally {
      setIsLoading(false);
    }
  };

  const totalQty = products.reduce((sum, item) => sum + Number(item.quantity), 0);
  const totalPurchase = products.reduce((sum, item) => sum + Number(item.purchasePrice), 0);
  const grandPurchase = products.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0);

  return (
    <div className="modern-purchase-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="modern-header">
        <h2 className="modern-title">Purchase Management</h2>
        <div className="modern-view-toggle">
          <button 
            onClick={() => setShowForm(true)} 
            className={`modern-toggle-btn ${showForm ? 'active' : ''}`}
          >
            Add Purchase
          </button>
          <button 
            onClick={() => setShowForm(false)} 
            className={`modern-toggle-btn ${!showForm ? 'active' : ''}`}
          >
            View Purchases
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="modern-form-container">
          <div className="modern-form-grid">
            <div className="modern-form-group">
              <label>Barcode</label>
              <input 
                name="barcode" 
                value={form.barcode} 
                onChange={handleChange} 
                placeholder="BarCode/Code" 
              />
            </div>

            <div className="modern-form-group">
              <label>Product Name*</label>
              <input 
                name="productName" 
                value={form.productName} 
                onChange={handleChange} 
                placeholder="Product Name" 
                required
              />
            </div>

            <div className="modern-form-group">
              <label>Purchase Price*</label>
              <input 
                name="purchasePrice" 
                value={form.purchasePrice} 
                onChange={handleChange} 
                type="number" 
                placeholder="Purchase Price" 
                required
              />
            </div>

            <div className="modern-form-group">
              <label>Quantity*</label>
              <input 
                name="quantity" 
                value={form.quantity} 
                onChange={handleChange} 
                type="number" 
                placeholder="Purchase Qty" 
                required
              />
            </div>

            <div className="modern-form-group">
              <label>Unit Type</label>
              <select name="unitType" value={form.unitType} onChange={handleChange}>
                {unitTypes.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div className="modern-form-group">
              <label>Purchase Date</label>
              <input 
                name="purchaseDate" 
                value={form.purchaseDate} 
                onChange={handleChange} 
                type="date" 
              />
            </div>

            <div className="modern-form-group">
              <label>MRP</label>
              <input 
                name="mrp" 
                value={form.mrp} 
                onChange={handleChange} 
                type="number" 
                placeholder="MRP" 
              />
            </div>

            <div className="modern-form-group">
              <label>Sale Price</label>
              <input 
                name="salePrice" 
                value={form.salePrice} 
                onChange={handleChange} 
                type="number" 
                placeholder="Sale Price" 
              />
            </div>

            <div className="modern-form-group">
              <label>Vendor</label>
              <select name="vendor" value={form.vendor} onChange={handleChange}>
                <option value="">Select Vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modern-form-actions">
            {editId ? (
              <>
                <button onClick={handleUpdate} className="modern-btn update">
                  Update Product
                </button>
                <button onClick={handleCancel} className="modern-btn cancel">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleAdd} className="modern-btn add">
                Add to List
              </button>
            )}
          </div>
        </div>
      ) : (
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
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="modern-action-btn delete"
                          >
                            <i className="fas fa-trash"></i>
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
      )}
    </div>
  );
};

export default PurchaseEntry;