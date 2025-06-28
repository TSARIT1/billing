import { Link } from 'react-router-dom';
import './Index.css';
import Navbar from './components/Navbar';
import api from '../service/api';

function Index() {

  return (
    <>
    <Navbar />
    <div className="hm-container">
      <div className="hm-hero">
        <div className="hm-hero-overlay">
          <h1 className="hm-hero-title">Billing Management System</h1>
          <p className="hm-hero-text">
            Streamline your sales, customers, vendors, and products in one place.
            Generate bills, manage inventory, and backup your data effortlessly.
          </p>
        </div>
      </div>
      
      <div className="hm-content">
        <div className="hm-btn-group">
          <Link to="/add-sale" className="hm-btn">
            <button> Sale</button>
          </Link>
          
          <Link to="/add-product" className="hm-btn">
            <button>Add Product</button>
          </Link>

          <Link to="/add-customer" className="hm-btn">
            <button>Add Customer</button>
          </Link>

          <Link to="/add-vendor" className="hm-btn">
            <button>Add Vendor</button>
          </Link>

          

          <Link to="/bill-settings" className="hm-btn">
            <button>Bill Settings</button>
          </Link>

          <Link to="/data-backup" className="hm-btn">
            <button>Database Backup</button>
          </Link>

          <div className="hm-sale-info">
            <h3>Sale Summary</h3>
            <div className="hm-sale-stats">
              <p>Today: $1,250</p>
              <p>Total: $24,500</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Index;