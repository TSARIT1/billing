import React, { useState } from 'react';
import './auth.css';
import Header from './components/Header';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    console.log('Login data:', formData);
    setLoading(false);
    // Add your actual login logic here
  };

  return (
    <>
    <Header />
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">RetailPro</h1>
          <p className="auth-subtitle">Shop Owner Portal</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label className="auth-label">Password*</label>
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

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <div className="auth-loader"></div> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have a shop account? <a href="/register" className="auth-link">Register your shop</a></p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;