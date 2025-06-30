import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './Siderbar.css';

const socket = io('http://localhost:3001');

const Sidebar = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUserId(user?._id);
  }, []);
    useEffect(() => {
    if (!currentUserId) return;

    socket.emit('register-user', currentUserId);

    socket.on('online-users', (ids) => {
      setOnlineUserIds(ids);
    });

    return () => {
      socket.off('online-users');
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    fetch('http://localhost:3001/api/auth/users')
      .then(res => res.json())
      .then(data => {
        
        setUsers(data.filter(u => u._id !== currentUserId));
      })
      .catch(err => console.error('Error fetching users:', err));
  }, [currentUserId]);

  

  const sendChallenge = (targetUser) => {
    socket.emit('send-challenge', {
      from: currentUserId,
      to: targetUser._id
    });
    console.log(`✅ Sent challenge from ${currentUserId} to ${targetUser._id}`);
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar-ct">
      <input
        type="text"
        className="sidebar-search"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="sidebar-userlist">
        {filteredUsers.map(user => (
          <div className="sidebar-usercard" key={user._id}>
           <span className="sidebar-username">
  {onlineUserIds.includes(user._id) && <span className="online-dot" />}
  {user.fullName}
</span>

            <button className="sidebar-challenge-btn" onClick={() => sendChallenge(user)}>
              Challenge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
