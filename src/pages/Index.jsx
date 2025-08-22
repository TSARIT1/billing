import React from 'react';
import { Link } from 'react-router-dom';
import './Index.css';
import Navbar from './components/Navbar';
import Logo from '../assets/tsar-logo.png';
import useUserStore from '../store/userStore';

function Index() {
  const { userData } = useUserStore();
  const isPlanActive = userData?.plan_status === 'active';

  return (
    <>
      <Navbar />
      <div className="hm-container">
        <div className="hm-hero">
          <div className="hm-hero-overlay">
           
            <img src={Logo} alt="logo" className='cp_logo'/>
            <h1 className="hm-hero-title">Billing Management System</h1>
            <p className="hm-hero-text">
              Streamline your sales, customers, vendors, and products in one place.
              Generate bills, manage inventory, and backup your data effortlessly.
            </p>
          </div>
        </div>
        
        {/* Plan Status Overlay - Fixed Position */}
        {!isPlanActive && (
          <div className="hm-plan-overlay">
            <div className="hm-plan-expired">
              <div className="hm-plan-icon">⚠️</div>
              <h2>Your plan has expired</h2>
              <p>Your access to the billing system has been suspended. Please renew your plan to continue using all features.</p>
              <Link to="/price" className="hm-renew-btn">
                <button>Renew Now</button>
              </Link>
            </div>
          </div>
        )}
        
        <div className="hm-content">
          <div className="hm-btn-group">
            <Link to={isPlanActive ? "/add-sale" : "#"} className={`hm-btn ${!isPlanActive ? "disabled" : ""}`}>
              <button disabled={!isPlanActive}>Sale</button>
            </Link>
            
            <Link to={isPlanActive ? "/add-product" : "#"} className={`hm-btn ${!isPlanActive ? "disabled" : ""}`}>
              <button disabled={!isPlanActive}>Add Product</button>
            </Link>

            <Link to={isPlanActive ? "/add-customer" : "#"} className={`hm-btn ${!isPlanActive ? "disabled" : ""}`}>
              <button disabled={!isPlanActive}>Add Customer</button>
            </Link>

            <Link to={isPlanActive ? "/add-vendor" : "#"} className={`hm-btn ${!isPlanActive ? "disabled" : ""}`}>
              <button disabled={!isPlanActive}>Add Vendor</button>
            </Link>

            <Link to={isPlanActive ? "/bill-settings" : "#"} className={`hm-btn ${!isPlanActive ? "disabled" : ""}`}>
              <button disabled={!isPlanActive}>Bill Settings</button>
            </Link>

            <Link to={isPlanActive ? "/data-backup" : "#"} className={`hm-btn ${!isPlanActive ? "disabled" : ""}`}>
              <button disabled={!isPlanActive}>Database Backup</button>
            </Link>

            <div className="hm-sale-info">
              <h3>Sale Summary</h3>
              <div className="hm-sale-stats">
                <p>Today:1,250</p>
                <p>Total:24,500</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;