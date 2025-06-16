import React, { useState } from 'react';
import './Play.css';

const users = Array.from({ length: 26 }, (_, i) => `User ${String.fromCharCode(65 + i)}`);

const Play = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleChallenge = (user) => {
    alert(`Challenged ${user}!`);
  };

  return (
    <div className="play-wrapper">
      <div className={`sidebar ${sidebarOpen ? 'visible' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h2>Players</h2>
        </div>
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={index} className="user-card">
              <span className="username">{user}</span>
              <button onClick={() => handleChallenge(user)} className="challenge-btn">
                Challenge
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="main-section">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="main-content">
          <h1>Typing Challenge Arena</h1>
          <p>Select an opponent from the left to start a duel.</p>
        </div>
      </div>
    </div>
  );
};

export default Play;
