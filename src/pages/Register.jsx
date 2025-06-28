import React, { useState } from 'react';
import './auth.css';
import Header from './components/Header';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import api from '../service/api'

const Register = () => {
  const [formData, setFormData] = useState({
    shop_name: '',
    username: '',
    email: '',
    gst_number: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/register',formData);
      toast.success('Registration successful! Redirecting to login...');
      // Clear form
      setFormData({
        shop_name: '',
        username: '',
        email: '',
        gst_number: '',
        phone: '',
        password: '',
        confirm_password: '',
      });
      // setTimeout(() => window.location.href = '/login', 2000);
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
    <ToastContainer 
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <Header />
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">RetailPro</h1>
          <p className="auth-subtitle">Register Your Shop</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">Shop Name*</label>
            <input
              type="text"
              name="shop_name"
              placeholder="My Retail Shop"
              className="auth-input"
              value={formData.shop_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Owner Name*</label>
            <input
              type="text"
              name="username"
              placeholder="Your Full Name"
              className="auth-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Email*</label>
            <input
              type="email"
              name="email"
              placeholder="shop@example.com"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">GST Number*</label>
            <input
              type="text"
              name="gst_number"
              placeholder="22AAAAA0000A1Z5"
              className="auth-input"
              value={formData.gst_number}
              onChange={handleChange}
              required
              pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
              title="Enter valid GST number (e.g., 22AAAAA0000A1Z5)"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Phone Number*</label>
            <input
              type="tel"
              name="phone"
              placeholder="9876543210"
              className="auth-input"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Enter 10 digit phone number"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password* (min 8 characters)</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Confirm Password*</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="••••••••"
              className="auth-input"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <div className="auth-loader"></div> : 'Register Shop'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already registered? <a href="/login" className="auth-link">Login here</a></p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;