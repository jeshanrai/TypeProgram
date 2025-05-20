import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">TypeCode</div>
      <div className="navbar-center">
        <a href="#customize">Customize</a>
        <a href="#learn">Learn</a>
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
