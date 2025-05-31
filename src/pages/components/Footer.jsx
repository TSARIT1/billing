import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="ft-footer">
      <div className="ft-container">
        <div className="ft-grid">
          <div className="ft-about">
            <h3 className="ft-heading">About Us</h3>
            <p className="ft-text">We provide comprehensive billing and inventory management solutions to help businesses streamline their operations.</p>
            <div className="ft-social">
              <a href="#" className="ft-social-link"><FaFacebook /></a>
              <a href="#" className="ft-social-link"><FaTwitter /></a>
              <a href="#" className="ft-social-link"><FaLinkedin /></a>
              <a href="#" className="ft-social-link"><FaInstagram /></a>
            </div>
          </div>

          <div className="ft-links">
            <h3 className="ft-heading">Quick Links</h3>
            <ul className="ft-list">
              <li><a href="/addproduct" className="ft-link">Products</a></li>
              <li><a href="/addcustomer" className="ft-link">Customers</a></li>
              <li><a href="/addvendor" className="ft-link">Vendors</a></li>
              <li><a href="/salereport" className="ft-link">Reports</a></li>
              <li><a href="/bill" className="ft-link">Bill Settings</a></li>
            </ul>
          </div>

          <div className="ft-contact">
            <h3 className="ft-heading">Contact Us</h3>
            <ul className="ft-list">
              <li className="ft-contact-item">
                <FaMapMarkerAlt className="ft-contact-icon" />
                <span>Madanapalle, Chittoor- 517247, <br />
Andhra Pradesh</span>
              </li>
              <li className="ft-contact-item">
                <FaPhone className="ft-contact-icon" />
                <span>+91 94913 01258</span>
              </li>
              <li className="ft-contact-item">
                <FaEnvelope className="ft-contact-icon" />
                <span>tsarit@tsaritservices.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="ft-bottom">
          <div className="ft-copyright">
            &copy; {new Date().getFullYear()} Billing System. All Rights Reserved.
          </div>
          <div className="ft-powered-by">
            Powered by <span className="ft-company">TSAR-IT Pvt Ltd</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;