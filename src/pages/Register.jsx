import React, { useState } from 'react';
import './auth.css';
import Header from './components/Header';

const Register = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    gstNumber: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Registration data:', formData);
    setLoading(false);
    // Add your actual registration logic here
  };

  return (
    <>
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
              name="shopName"
              placeholder="My Retail Shop"
              className="auth-input"
              value={formData.shopName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Owner Name*</label>
            <input
              type="text"
              name="ownerName"
              placeholder="Your Full Name"
              className="auth-input"
              value={formData.ownerName}
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
              name="gstNumber"
              placeholder="22AAAAA0000A1Z5"
              className="auth-input"
              value={formData.gstNumber}
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
              minLength="8"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Confirm Password*</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              className="auth-input"
              value={formData.confirmPassword}
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