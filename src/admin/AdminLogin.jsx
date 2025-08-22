import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaSignInAlt } from 'react-icons/fa';
import axios from 'axios';
import './AdminLogin.css';
import Header from '../pages/components/Header';
import toast, {Toaster} from 'react-hot-toast';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', credentials);

      // toast.success('Login successful!')

      if (response.data.user?.is_staff) {
        localStorage.setItem('adminToken', response.data.access);
        // navigate('/admin/dashboard');
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        setError('Access denied. Administrator privileges required.');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      toast.error("Login failed. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <Toaster
  position="bottom-center"
  reverseOrder={false}
/>
    <div className="admin-login-container">
      <div className="login-box">
        <div className="login-header">
          <h2><FaLock /> Admin Portal</h2>
          <p>Enter your credentials to access the dashboard</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email"><FaUser /> Email Address</label>
            <input
              type="email"
              id="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password"><FaLock /> Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <FaSignInAlt /> Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default AdminLogin;