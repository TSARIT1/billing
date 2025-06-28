import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addproduct.css';
import api from '../service/api'

const AddProduct = () => {
  const [view, setView] = useState('form'); // 'form' or 'table'
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [products, setProducts] = useState([
  ]);
  const [categories, setCategories] = useState([
    { id:1, "name": "Electronics", "description": "Electronic devices and components"},
    { id:2, "name": "Clothing", "description": "Apparel and fashion items"},
    { id:3, "name": "Groceries", "description": "Food and household items"},
    { id:4, "name": "Furniture", "description": "Home and office furniture"},
    { id:5, "name": "Books", "description": "Educational and recreational books"},
    { id:6, "name": "Toys", "description": "Children's toys and games"},
    { id:7, "name": "Sports", "description": "Sports equipment and gear"},
    { id:8, "name": "Beauty", "description": "Cosmetics and personal care"},
    { id:9, "name": "Automotive", "description": "Vehicle parts and accessories"},
    { id:10, "name": "Health", "description": "Health and wellness products"},
  ]);
  const [units, setUnits] = useState([
    {id:1, "name": "Piece", "symbol": "pc"},
    {id:2, "name": "Kilogram", "symbol": "kg"},
    {id:3, "name": "Gram", "symbol": "g"},
    {id:4, "name": "Liter", "symbol": "L"},
    {id:5, "name": "Milliliter", "symbol": "ml"},
    {id:6, "name": "Meter", "symbol": "m"},
    {id:7, "name": "Centimeter", "symbol": "cm"},
    {id:8, "name": "Dozen", "symbol": "dz"},
    {id:9, "name": "Pack", "symbol": "pk"},
    {id:10, "name": "Box", "symbol": "bx"},
  ]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    category: '',
    unit: '',
    purchase_price: '',
    selling_price: '',
    stock_quantity: '',
    min_stock_level: '',
    barcode: '',
    tax_rate: '',
    discount: '',
    expiry_date: '',
    manufacturer: '',
    supplier: '',
    description: '',
    isActive: true
  });


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/api/products/'),
      
      ]);
      
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
    
 
      console.log('customers data:', productsRes.data);

      
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_name.trim()) newErrors.product_name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (formData.selling_price <= 0) newErrors.selling_price = 'Selling price must be positive';
    if (formData.purchase_price <= 0) newErrors.purchase_price = 'Purchase price must be positive';
    if (formData.stock_quantity < 0) newErrors.stock_quantity = 'Stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!validateForm()) return;

    console.log('form data from frontend : ',formData);
    

    setIsLoading(true);
    try {
      if (isEditing) {
        await axios.put(`/api/products/${currentProductId}`, formData);
      } else {
        await api.post('/api/products/', formData);
      }
      
      resetForm();
      fetchData();
      setView('table');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      product_code: product.product_code,
      product_name: product.product_name,
      category: product.category,
      unit: product.unit,
      purchase_price: product.purchase_price,
      selling_price: product.selling_price,
      stock_quantity: product.stock_quantity,
      min_stock_level: product.min_stock_level,
      barcode: product.barcode,
      tax_rate: product.tax_rate,
      discount: product.discount,
      expiry_date: product.expiry_date,
      manufacturer: product.manufacturer,
      supplier: product.supplier,
      description: product.description,
      isActive: product.isActive
    });
    setIsEditing(true);
    setCurrentProductId(product.id);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      try {
        await axios.delete(`/api/products/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      product_code: '',
      product_name: '',
      category: '',
      unit: '',
      purchase_price: '',
      selling_price: '',
      stock_quantity: '',
      min_stock_level: '',
      barcode: '',
      tax_rate: '',
      discount: '',
      expiry_date: '',
      manufacturer: '',
      supplier: '',
      description: '',
      isActive: true
    });
    setIsEditing(false);
    setCurrentProductId(null);
    setErrors({});
  };

 const filteredProducts = products.filter(product => 
  (product.product_name && product.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
  (product.product_code && product.product_code.toLowerCase().includes(searchTerm.toLowerCase()))
);


  return (
    <div className="product-management-container">
      <div className="view-toggle-buttons">
        <button 
          className={`toggle-btn ${view === 'form' ? 'active' : ''}`}
          onClick={() => setView('form')}
        >
          {isEditing ? 'Edit Product' : 'Add Product'}
        </button>
        <button 
          className={`toggle-btn ${view === 'table' ? 'active' : ''}`}
          onClick={() => setView('table')}
        >
          View Products
        </button>
      </div>

      {view === 'form' && (
        <div className="product-form-container">
          <h2 className="form-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Product Code</label>
                <input 
                  className="form-input" 
                  name="product_code" 
                  value={formData.product_code} 
                  onChange={handleChange} 
                  placeholder="PRD-001"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input 
                  className={`form-input ${errors.product_name ? 'input-error' : ''}`} 
                  name="product_name" 
                  value={formData.product_name} 
                  onChange={handleChange} 
                  placeholder="Enter product name"
                />
                {errors.product_name && <span className="error-message">{errors.product_name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select 
                  className={`form-select ${errors.category ? 'input-error' : ''}`} 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>

                  {categories.map(category => (
                    
                    <option key={category.id} value={category.name}>{category.name}</option>
                    
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Unit *</label>
                <select 
                  className={`form-select ${errors.unit ? 'input-error' : ''}`} 
                  name="unit" 
                  value={formData.unit} 
                  onChange={handleChange}
                >
                  <option value="">Select Unit</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.name + unit.symbol}>{unit.symbol}</option>
                  ))}
                </select>
                {errors.unit && <span className="error-message">{errors.unit}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Purchase Price *</label>
                <div className="input-with-symbol">
                  <span className="currency-symbol">$</span>
                  <input 
                    className={`form-input ${errors.purchase_price ? 'input-error' : ''}`} 
                    type="number" 
                    name="purchase_price" 
                    value={formData.purchase_price} 
                    onChange={handleChange} 
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                {errors.purchase_price && <span className="error-message">{errors.purchase_price}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Selling Price *</label>
                <div className="input-with-symbol">
                  <span className="currency-symbol">$</span>
                  <input 
                    className={`form-input ${errors.selling_price ? 'input-error' : ''}`} 
                    type="number" 
                    name="selling_price" 
                    value={formData.selling_price} 
                    onChange={handleChange} 
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                {errors.selling_price && <span className="error-message">{errors.selling_price}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input 
                  className={`form-input ${errors.stock_quantity ? 'input-error' : ''}`} 
                  type="number" 
                  name="stock_quantity" 
                  value={formData.stock_quantity} 
                  onChange={handleChange} 
                  min="0"
                  placeholder="0"
                />
                {errors.stock_quantity && <span className="error-message">{errors.stock_quantity}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Min Stock Level</label>
                <input 
                  className="form-input" 
                  type="number" 
                  name="min_stock_level" 
                  value={formData.min_stock_level} 
                  onChange={handleChange} 
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Barcode</label>
                <input 
                  className="form-input" 
                  name="barcode" 
                  value={formData.barcode} 
                  onChange={handleChange} 
                  placeholder="Scan or enter barcode"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tax Rate (%)</label>
                <div className="input-with-symbol">
                  <input 
                    className="form-input" 
                    type="number" 
                    name="tax_rate" 
                    value={formData.tax_rate} 
                    onChange={handleChange} 
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0.00"
                  />
                  <span className="percentage-symbol">%</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Discount (%)</label>
                <div className="input-with-symbol">
                  <input 
                    className="form-input" 
                    type="number" 
                    name="discount" 
                    value={formData.discount} 
                    onChange={handleChange} 
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0.00"
                  />
                  <span className="percentage-symbol">%</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input 
                  className="form-input" 
                  type="date" 
                  name="expiry_date" 
                  value={formData.expiry_date} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Manufacturer</label>
                <input 
                  className="form-input" 
                  name="manufacturer" 
                  value={formData.manufacturer} 
                  onChange={handleChange} 
                  placeholder="Manufacturer name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Supplier</label>
                <input 
                  className="form-input" 
                  name="supplier" 
                  value={formData.supplier} 
                  onChange={handleChange} 
                  placeholder="Supplier name"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="3"
                  placeholder="Product description..."
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    checked={formData.isActive} 
                    onChange={handleChange} 
                  />
                  <span className="checkmark"></span>
                  Active Product
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (isEditing ? 'Update Product' : 'Save Product')}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={isLoading}
              >
                Clear Form
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => {
                    handleDelete(currentProductId);
                    setView('table');
                  }}
                  disabled={isLoading}
                >
                  Delete Product
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {view === 'table' && (
        <div className="product-table-container">
          <div className="table-header">
            <h2 className="table-title">Product Inventory</h2>
            <div className="table-controls">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              <button 
                className="btn btn-add"
                onClick={() => {
                  resetForm();
                  setView('form');
                }}
              >
                + Add New Product
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-indicator">Loading products...</div>
          ) : (
            <div className="responsive-table">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <tr 
                        key={product.id} 
                        className={`product-row ${product.stock_quantity <= (product.min_stock_level || 0) ? 'low-stock' : ''}`}
                      >
                        <td>{product.product_code || '-'}</td>
                        <td className="product-name-cell">
                          <div className="product-name">{product.product_name}</div>
                          {product.barcode && (
                            <div className="product-barcode">Barcode: {product.barcode}</div>
                          )}
                        </td>
                        <td>
                          {categories.find(c => c.id === product.category) || 'N/A'}
                        </td>
                        <td className="price-cell">
                          <div className="selling-price">${parseFloat(product.selling_price).toFixed(2)}</div>
                          <div className="purchase-price">Cost: ${parseFloat(product.purchase_price).toFixed(2)}</div>
                        </td>
                        <td className="stock-cell">
                          <div className="stock-quantity">{product.stock_quantity}</div>
                          {product.min_stock_level > 0 && (
                            <div className="min-stock">Min: {product.min_stock_level}</div>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="action-cell">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(product)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(product.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-products">
                        No products found. {searchTerm && 'Try a different search term.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddProduct;