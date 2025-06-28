import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './Siderbar.css';

const socket = io('http://localhost:3001'); // Adjust if your backend is on a different port

const Sidebar = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null); // Assume you can get current user ID

  useEffect(() => {
    // Fetch current user ID from session/localStorage/auth
    const user = JSON.parse(localStorage.getItem('user')); // Assuming you store it here
    setCurrentUserId(user?._id);
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/auth/users')
      .then(res => res.json())
      .then(data => setUsers(data.filter(u => u._id !== currentUserId))) // exclude self
      .catch(err => console.error('Error:', err));
  }, [currentUserId]);

  useEffect(() => {
    socket.on('receive_challenge', ({ from }) => {
      const accept = window.confirm(`${from} has challenged you. Accept?`);
      socket.emit('challenge_response', { from, to: currentUserId, accepted: accept });
    });

    return () => {
      socket.off('receive_challenge');
    };
  }, [currentUserId]);

  const sendChallenge = (targetUser) => {
    socket.emit('send_challenge', {
      from: currentUserId,
      to: targetUser._id,
      fromName: users.find(u => u._id === currentUserId)?.fullName || "Someone"
    });
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar">
      <input
        type="text"
        className="search-bar"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="user-list">
        {filteredUsers.map(user => (
          <div className="user-card" key={user._id}>
            <span className="user-name">{user.fullName}</span>
            <button className="challenge-button" onClick={() => sendChallenge(user)}>
              Challenge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
