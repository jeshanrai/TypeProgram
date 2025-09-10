import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthUI from '../pages/AuthUI/AuthUI';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  // Function to load user from localStorage
  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    loadUserFromStorage();

    // Listen for custom 'storageChanged' event
    window.addEventListener('storageChanged', loadUserFromStorage);

    return () => {
      window.removeEventListener('storageChanged', loadUserFromStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth');

    // Notify other components
    window.dispatchEvent(new Event('storageChanged'));
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/images/logo.png" alt="TypeCode Logo" className="logo-img" />
          <span className="logo-text">TypeCode</span>
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/customize">Customize</Link>
        <Link to="/play">Play</Link>
      </div>

      <div className="navbar-right">
        <div className="navbar-actions">
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider round"></span>
          </label>

          <span className="user-name" style={{ marginRight: '10px', width: '50px', display: 'inline-block' }}>
            {user ? user.fullName.split(' ')[0] : ''}
          </span>
          {user ? (
            <button className="login-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="login-button" onClick={() => navigate('/auth')}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
