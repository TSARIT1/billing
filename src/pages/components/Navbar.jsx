import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaBars, FaTimes, FaBox, FaFileAlt, FaChevronDown } from 'react-icons/fa';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast'
import useUserStore from '../../store/userStore';

function Navbar() {
  const { fetchUserData, userData } = useUserStore();

   useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navbarRef = useRef(null);

  
  


  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setProfileOpen(false);
  };



  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setMobileMenuOpen(false);
  };
  

 


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        !event.target.classList.contains('nv-mobile-menu-btn')
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <>
      <div className="nv-navbar">
        <div className={`nv-navbar-left ${mobileMenuOpen ? 'active' : ''}`} ref={navbarRef}>

          <div className="fex-end">
            <div className="nv-dropdown">
              <button className="nv-dropbtn">
                <FaBox className="nv-icon" /> Master <FaChevronDown className="nv-chevron" />
              </button>
              <div className="nv-dropdown-content">
                <a href="/add-product">Add Products</a>       
                <a href="/sale-list">Sale List</a>
                <a href="/add-customer">Customers</a>
                <a href="/addvendor">Vendors</a>
                <a href="/bill">Bill Setting</a>
                <a href="/backup">Database Back Up</a>
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

        <div className="profile-center">
          {/* <a href="/">
          {
                  userData.profile_photo ? (
                    <img src={userData.profile_photo} alt="logo"  className='nv-logo'/>
                  ) : (
                    <>
                    <FaUser className="nv-profile-large-icon" />
                    </>
                  )
                }
          </a> */}
        </div>

        <div className="nv-profile-container" ref={profileRef}>
          <button className="nv-profile-btn" onClick={toggleProfile}>
            <FaUser className="nv-profile-icon" />
            {profileOpen ? <FaTimes className="nv-close-icon" /> : <FaChevronDown className="nv-chevron" />}
          </button>

          {profileOpen && (
            <div className="nv-profile-dropdown">
              <div className="nv-profile-header">
                
                {
                  userData.profile_photo ? (
                    <img src={userData.profile_photo} alt={userData.shop_name} className='user_profile_pic'/>
                  ) : (
                    <>
                    <FaUser className="nv-profile-large-icon" />
                    </>
                  )
                }
                <span> {userData?.username} </span>
                <small>{userData?.email}</small>
              </div>
              <div className="nv-profile-menu">
                <a href="/bill-settings">Account Settings</a>
                <a href="/ticket-raise">Ticket Raise</a>
                <span onClick={handleLogout} style={{display:'block'}}>Log out</span>
              </div>
            </div>
          )}
        </div>

        <button className="nv-mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default Navbar;
