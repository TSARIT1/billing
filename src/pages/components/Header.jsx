import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="nav-header">
      <div className="nav-container">
        <div >
            <a href="/" className="nav-logo" style={{textDecoration:'none'}}>RetailShop</a>
        </div>
        <nav className="nav-links">
          <a href="/login"><button className="nav-login-button">Login</button></a>
        </nav>
      </div>
    </header>
  );
};

export default Header;