import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="nav-header">
      <div className="nav-container">
        <div >
            <a href="/" className="nav-logo" style={{textDecoration:'none'}}>Billing Software | TSAR-IT</a>
        </div>
        <nav className="nav-links">
          <a href="/login"><button className="nav-login-button">Login</button></a> | 
          <a href="/register"><button className="nav-login-button">Register</button></a> |
          <a href="/admin/login"><button className="nav-login-button">Admin Login</button></a> |
          <a href="/contact"><button className="nav-login-button">Contact Us</button></a> 
          
        </nav>
      </div>
    </header>
  );
};

export default Header;