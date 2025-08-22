import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserTable from './UserTable';
import './AdminDashboard.css';
import toast, { Toaster } from 'react-hot-toast';
import AdminFeedbackPanel from './AdminFeedbackPanel';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://127.0.0.1:8000/api/users/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `http://127.0.0.1:8000/api/users/${userId}/status/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(user =>
        user.id === userId ? { ...user, is_active: !user.is_active } : user
      ));
    } catch (err) {
      setError('Failed to update user status');
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logout Success.!')
    setTimeout(() => {
      navigate('/admin/login');
    }, 1500);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <>
            {loading ? (
              <div className="loading-spinner">Loading users...</div>
            ) : (
              <UserTable users={users} onToggleStatus={handleToggleStatus} />
            )}
          </>
        );
      case 'tickets':
        return (
          <div className="tab-content">
           <AdminFeedbackPanel />
          </div>
        );
      case 'analytics':
        return (
          <div className="tab-content">
            <h2>Analytics Dashboard</h2>
            <p>This is where analytics will appear. You can replace this with your Analytics component.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="tab-content">
            <h2>Admin Settings</h2>
            <p>This is where admin settings will appear. You can replace this with your Settings component.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <Toaster position='top-center' />
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

        <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab-button ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          Tickets
        </button>
        {/* <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button> */}
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-content">
        {renderTabContent()}
      </div>


    </div>
  );
};

export default AdminDashboard;