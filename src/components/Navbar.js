import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <nav className="navbar-container">
     <div className="navbar-logo">
        <Link to="/">
          <img src="/images/logo.png" alt="TypeCode Logo" className="logo-img" />
          <span className="logo-text">TypeCode</span>
          
        </Link>
      </div>
      <div className="navbar-center">
        <Link to="/Customize">Customize</Link>
        <Link to="/Learn">Learn</Link>
      </div>
      <div className="navbar-right">
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </nav>
  );
}
