import React, { useState } from 'react';
import './auth.css';
import Header from './components/Header';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/api/login/', {
        email: formData.email,
        password: formData.password
      });
      
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      if (formData.rememberMe) {
        localStorage.setItem("token", res.data.access);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        sessionStorage.setItem('token', res.data.access);
        sessionStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      toast.success('Login successful! Redirecting...');
      setTimeout(() => navigate('/main'), 1500);
      
    } catch (error) {
      console.log(error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 401) {
          localStorage.removeItem('token')
          errorMessage = 'Invalid email or password';
        } else if (error.response.status === 404) {
          errorMessage = 'User not found. Please register.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
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

            <div className="auth-options">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <a href="/forgot-password" className="auth-forgot">
                Forgot password?
              </a>
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