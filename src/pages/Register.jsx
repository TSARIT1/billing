import React, { useState } from 'react';
import './auth.css';
import Header from './components/Header';
import 'react-toastify/dist/ReactToastify.css'
import api from '../service/api'
import toast, {Toaster} from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    shop_name: '',
    username: '',
    email: '',
    gst_number: '',
    phone: '',
    password: '',
    confirm_password: '',
    referred_by:''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Show loading toast immediately
  const toastId = toast.loading('Registering your account...');
  setLoading(true);

  try {
    const res = await api.post('/api/register/', formData);
    
    // Update to success state
    toast.success('Registered successfully! Redirecting to login...', {
      id: toastId,
      duration: 2000
    });
    
    // Clear form
    setFormData({
      shop_name: '',
      username: '',
      email: '',
      gst_number: '',
      phone: '',
      password: '',
      confirm_password: '',
      referred_by: ''
    });
    
    // Redirect after 2 seconds
    setTimeout(() => window.location.href = '/login', 2000);
    
  } catch (error) {
    // Update to error state
    toast.error(error.response?.data?.message || 'Registration failed. Please try again.', {
      id: toastId
    });
    
  } finally {
    setLoading(false);
  }
};

  return (
    <>
    <Toaster 
        position="bottom-center"
        reverseOrder={false}
      />
    <Header />
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">Billing Software</h1>
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
              placeholder="+91 00000 00000"
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

          <div className="auth-input-group">
            <label htmlFor="referred_by" className="auth-label">
              Referred By
            </label>
            <input
              id="referred_by"
              type="text"
              name="referred_by"
              placeholder="Enter referrer's full name"
              className="auth-input"
              value={formData.referred_by}
              onChange={handleChange}
              required
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