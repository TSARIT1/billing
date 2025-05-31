import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaBars, FaTimes, FaBox, FaFileAlt, FaChevronDown } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navbarRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (navbarRef.current && !navbarRef.current.contains(event.target) && 
          !event.target.classList.contains('nv-mobile-menu-btn')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="nv-navbar">
      <div className={`nv-navbar-left ${mobileMenuOpen ? 'active' : ''}`} ref={navbarRef}>
        <a href="/"><img src='/path/to/logo.png' alt="Logo" className="nv-logo" /></a>

        <div className="fex-end">
          <div className="nv-dropdown">
          <button className="nv-dropbtn">
            <FaBox className="nv-icon" /> Master <FaChevronDown className="nv-chevron" />
          </button>
          <div className="nv-dropdown-content">
            <a href="/addproduct">Products</a>
            <a href="#">Add Logo</a>
            <a href="#">Shipping Master</a>
            <a href="#">Payment Type</a>
            <a href="#">Unit Master</a>
            <a href="/add-customer">Customers</a>
            <a href="addvendor">Vendors</a>
            <a href="bill">Bill Setting</a>
            <a href="backup">Database Back Up</a>
          </div>
        </div>

        <div className="nv-dropdown">
          <button className="nv-dropbtn">
            <FaFileAlt className="nv-icon" /> Report <FaChevronDown className="nv-chevron" />
          </button>
          <div className="nv-dropdown-content">
            <a href="/add-sale">Sale Report</a>
          </div>
        </div>
        </div>
      </div>

      <div className="nv-profile-container" ref={profileRef}>
        <button className="nv-profile-btn" onClick={toggleProfile}>
          <FaUser className="nv-profile-icon" />
          {profileOpen ? <FaTimes className="nv-close-icon" /> : <FaChevronDown className="nv-chevron" />}
        </button>
        
        {profileOpen && (
          <div className="nv-profile-dropdown">
            <div className="nv-profile-header">
              <FaUser className="nv-profile-large-icon" />
              <span>Admin User</span>
              <small>admin@example.com</small>
            </div>
            <div className="nv-profile-menu">
              <a href="/profile">Account Settings</a>
              <a href="#logout">Log out</a>
            </div>
          </div>
        )}
      </div>
      
      <button className="nv-mobile-menu-btn" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </div>
  );
}

export default Navbar;