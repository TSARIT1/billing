import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaDoorOpen, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCity, FaGlobeAmericas, FaMapPin } from 'react-icons/fa';
import axios from 'axios';
import './addcustomer.css';

function AddCustomer() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    customerType: 'retail', // retail/wholesale/business
    taxId: '',
    notes: '',
    status: 'active' // active/inactive
  });

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
      const response = await axios.post('/api/customers', form);
      setSuccess('Customer saved successfully!');
      setTimeout(() => {
        setSuccess('');
        handleCancel();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save customer');
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
      customerType: 'retail',
      taxId: '',
      notes: '',
      status: 'active'
    });
    setError('');
  };

  const handleExit = () => {
    navigate(-1);
  };

  return (
    <div className="ac-page-container">
      <button className="ac-close-button" onClick={handleExit}>
        <FaTimes />
      </button>

      <div className="ac-form-container">
        <h2 className="ac-title">
          <FaUser /> Add Customer
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
          <button
            onClick={handleExit}
            className="ac-button ac-exit-button"
          >
            <FaDoorOpen /> Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCustomer;