import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import userIcon from "../../assets/images/user.png";
import './userDropdown.css';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <button 
        className="user-dropdown__toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={userIcon} alt="user" />
        <span>{user?.username || 'User'}</span>
      </button>

      {isOpen && (
        <div className="user-dropdown__menu">
          <Link to="/account" className="dropdown-item">
            <i className="ri-user-settings-line"></i>
            Account Settings
          </Link>
          <button onClick={handleLogout} className="dropdown-item">
            <i className="ri-logout-box-line"></i>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown; 