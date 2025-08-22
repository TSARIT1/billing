import React from 'react';
import { FaShoppingCart, FaChartLine, FaUsers, FaBoxes, FaFileInvoice, FaMobileAlt, FaShieldAlt, FaRupeeSign } from 'react-icons/fa';
import { MdPointOfSale, MdInventory } from 'react-icons/md';
import './Home.css'
import Header from './components/Header';
import api from '../service/api';
import PriceComponent from './components/PriceComponent';

const HomePage = () => {
  return (
    <>
    <Header />
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Retail Billing Made Simple</h1>
          <p>Powerful, free billing software for all business types with inventory management and customer tracking</p>
          <div className="cta-buttons">
            <a href="/main"><button className="primary-btn">Get Started</button></a>
            <button className="secondary-btn">Watch Demo</button>
          </div>
        </div>
        <div className="hero-image">
          <img src='https://tadigital.com.au/wp-content/uploads/2023/08/POS-Inventory-management-software-by-TA-Digital-Marketing-Agency-Brisbane.jpg' alt="POS Software Interface" />
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>About TSAR-IT Billing Software</h2>
          <p>
            TSAR-IT Billing Software is a comprehensive retail management solution developed by <strong>TSAR-IT Pvt Ltd</strong>, 
            designed to streamline your business operations. Our free billing software helps businesses of all sizes 
            manage sales, inventory, customers, and reports from a single platform.
          </p>
          <p>
            With a focus on simplicity and efficiency, our software reduces manual work and helps you focus on 
            growing your business. Whether you run a small retail shop or a chain of stores, our solution scales 
            with your needs.
          </p>
          <div className="company-info">
            <h3>Powered by TSAR-IT Pvt Ltd</h3>
            <p>Innovative software solutions since 2019</p>
            <p>Trusted by 5,000+ businesses across India</p>
          </div>
        </div>
      </section>


      <PriceComponent />

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <MdPointOfSale size={40} />
            </div>
            <h3>POS Billing</h3>
            <p>Fast and intuitive point of sale with barcode scanning support</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <MdInventory size={40} />
            </div>
            <h3>Inventory Management</h3>
            <p>Track stock levels, get low stock alerts, and manage suppliers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers size={40} />
            </div>
            <h3>Customer Management</h3>
            <p>Store customer details, track purchase history, and manage loyalty</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaFileInvoice size={40} />
            </div>
            <h3>Invoice Generation</h3>
            <p>Professional invoices with GST support and multiple templates</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine size={40} />
            </div>
            <h3>Sales Reports</h3>
            <p>Detailed reports to analyze sales trends and business performance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaMobileAlt size={40} />
            </div>
            <h3>Mobile Friendly</h3>
            <p>Responsive design works on desktops, tablets, and smartphones</p>
          </div>
        </div>
      </section>



      {/* Usage Section */}
      <section className="usage-section">
        <h2>How It Works</h2>
        <div className="usage-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Add Your Products</h3>
              <p>Create your product catalog with prices, categories, and stock levels</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Process Sales</h3>
              <p>Quickly create bills, apply discounts, and accept multiple payment methods</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Manage Inventory</h3>
              <p>Automatically update stock levels and get alerts for low inventory</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Analyze Reports</h3>
              <p>Generate detailed reports to understand your business performance</p>
            </div>
          </div>
        </div>
        <div className="dashboard-preview">
          <img src="" alt="Dashboard Preview" />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2>Why Choose Our Billing Software</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <FaRupeeSign size={30} />
            <h3>Cost Effective</h3>
            <p>Free to use with no hidden charges or subscription fees</p>
          </div>
          <div className="benefit-card">
            <FaShieldAlt size={30} />
            <h3>Data Security</h3>
            <p>Your business data is safe with regular backups</p>
          </div>
          <div className="benefit-card">
            <FaMobileAlt size={30} />
            <h3>Easy to Use</h3>
            <p>Intuitive interface with minimal learning curve</p>
          </div>
          <div className="benefit-card">
            <FaShoppingCart size={30} />
            <h3>All Business Types</h3>
            <p>Works for retail shops, supermarkets, restaurants, and more</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Transform Your Business?</h2>
        <p>Join thousands of businesses using TSAR-IT Billing Software today</p>
        <button className="primary-btn">Start Free Now</button>
        <div className="powered-by">
          <p>Powered by</p>
          <div className="tsar-logo">
            <h3>TSAR-IT Pvt Ltd</h3>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HomePage;






