import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCity, FaGlobeAmericas, FaMapPin, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import './addcustomer.css';
import api from '../service/api'

function AddCustomer() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('add');
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    customerType: '',
    taxId: '',
    notes: '',
    status: 'active'
  });

  useEffect(() => {
    if (activeTab === 'list') {
      fetchCustomers();
    }
  }, [activeTab]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/customers/');
      setCustomers(response.data);
      console.log('data',response.data);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async () => {
    if (fields.every(f => formData[f.key]?.trim())) {
      onSubmit(formData);
      onClose();
    }
    try {

      const res = await axios.post('',formData);
      console.log('data sent backend'); 
      
    } catch (error) {
      console.error(error)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('Customer name is required');
      return false;
    }
    if (!form.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (editingCustomer) {
        await api.put(`/api/customers/${editingCustomer._id}/`, form);
        setSuccess('Customer updated successfully!');
      } else {
        await api.post('/api/customers/', form);
        setSuccess('Customer saved successfully!');
      }
      setTimeout(() => {
        setSuccess('');
        handleCancel();
        setActiveTab('list');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save customer');
      console.error(err);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      customerType: '',
      taxId: '',
      notes: '',
      status: 'active'
    });
    setEditingCustomer(null);
    setError('');
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditingCustomer(customer);
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    setIsLoading(true);
    try {
      await api.delete(`/api/customers/${id}/`);
      setSuccess('Customer deleted successfully!');
      fetchCustomers();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete customer');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="ac-page-container">
      <div className="ac-tabs">
        <button
          className={`ac-tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          {editingCustomer ? 'Edit Customer' : 'Add Customer'}
        </button>
        <button
          className={`ac-tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          View Customers
        </button>
      </div>

      <div className="ac-form-container">
        {activeTab === 'add' ? (
          <>
            <h2 className="ac-title">
              <FaUser /> {editingCustomer ? 'Edit Customer' : 'Add Customer'}
            </h2>

            {error && <div className="ac-error-message">{error}</div>}
            {success && <div className="ac-success-message">{success}</div>}

            <div className="ac-form-grid">
              <div className="ac-form-group">
                <label>
                  <FaUser /> Name*
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="ac-input"
                  required
                />
              </div>

              <div className="ac-form-group">
                <label>
                  <FaPhone /> Phone*
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="ac-input"
                  required
                />
              </div>

              <div className="ac-form-group">
                <label>
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="ac-input"
                />
              </div>

              <div className="ac-form-group">
                <label>
                  <FaMapMarkerAlt /> Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="ac-input"
                />
              </div>

              <div className="ac-form-group">
                <label>
                  <FaCity /> City
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="ac-input"
                />
              </div>

              <div className="ac-form-group">
                <label>
                  <FaGlobeAmericas /> State
                </label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State/Province"
                  className="ac-input"
                />
              </div>

              <div className="ac-form-group">
                <label>
                  <FaMapPin /> ZIP Code
                </label>
                <input
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  placeholder="Postal/ZIP Code"
                  className="ac-input"
                />
              </div>

              <div className="ac-form-group">
                <label>Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="ac-select"
                >
                  <option value='' selected>select</option>
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div className="ac-form-group">
                <label>Customer Type</label>
                <select
                  name="customerType"
                  value={form.customerType}
                  onChange={handleChange}
                  className="ac-select"
                >
                  <option value="" checked>select</option>
                  <option value="retail">Retail Customer</option>
                  <option value="wholesale">Wholesale Customer</option>
                  <option value="business">Business Customer</option>
                </select>
              </div>

              <div className="ac-form-group">
                <label>Tax ID/GSTIN</label>
                <input
                  name="taxId"
                  value={form.taxId}
                  onChange={handleChange}
                  placeholder="Tax Identification Number"
                  className="ac-input"
                />
              </div>

              <div className="ac-form-group ac-full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Additional notes..."
                  className="ac-textarea"
                  rows="3"
                />
              </div>

              <div className="ac-form-group">
                <label>Status</label>
                <div className="ac-radio-group">
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={form.status === 'active'}
                      onChange={handleChange}
                    />
                    Active
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={form.status === 'inactive'}
                      onChange={handleChange}
                    />
                    Inactive
                  </label>
                </div>
              </div>
            </div>

            <div className="ac-form-actions">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="ac-button ac-save-button"
              >
                <FaSave /> {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="ac-button ac-cancel-button"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="ac-title">
              <FaUser /> Customer List
            </h2>

            {error && <div className="ac-error-message">{error}</div>}
            {success && <div className="ac-success-message">{success}</div>}

            <div className="ac-search-container">
              <div className="ac-search-box">
                <FaSearch className="ac-search-icon" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ac-search-input"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="ac-loading">Loading customers...</div>
            ) : (
              <div className="ac-customer-table-container">
                <table className="ac-customer-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <tr key={customer._id}>
                          <td>{customer.name}</td>
                          <td>{customer.phone}</td>
                          <td>{customer.email || '-'}</td>
                          <td>{customer.customerType}</td>
                          <td>
                            <span className={`ac-status ${customer.status}`}>
                              {customer.status}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleEdit(customer)}
                              className="ac-action-button ac-edit-button"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(customer._id)}
                              className="ac-action-button ac-delete-button"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="ac-no-data">
                          No customers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AddCustomer;