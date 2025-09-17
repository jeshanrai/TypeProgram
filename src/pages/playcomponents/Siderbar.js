import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Siderbar.css";

const socket = io("http://localhost:3001");

const Sidebar = ({ snippetPreview }) => { // ✅ receive snippetPreview as prop
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Get current user ID
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUserId(user?._id);
  }, []);

  // Register user on socket and listen for online users
  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("register-user", currentUserId);

    socket.on("online-users", (ids) => {
      setOnlineUserIds(ids);
    });

    return () => socket.off("online-users");
  }, [currentUserId]);

  // Fetch all users except current
  useEffect(() => {
    if (!currentUserId) return;

    fetch("http://localhost:3001/api/auth/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.filter((u) => u._id !== currentUserId)))
      .catch((err) => console.error("Error fetching users:", err));
  }, [currentUserId]);

  // Send challenge with snippet
  const sendChallenge = (targetUser) => {
    if (!snippetPreview || snippetPreview.trim() === "") {
      console.warn("❌ No snippet to send!");
      return;
    }

    socket.emit("send-challenge", {
      from: currentUserId,
      to: targetUser._id,
      snippet: snippetPreview, // ✅ send the current snippet
    });

    console.log(`✅ Sent challenge from ${currentUserId} to ${targetUser._id}`);
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar-wrapper">
      {/* Floating toggle button */}
      {!isOpen && (
        <button
          className="sidebar-floating-toggle"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar-ct ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <input
            type="text"
            className="sidebar-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="sidebar-toggle" onClick={() => setIsOpen(false)}>
            ✖
          </button>
        </div>

        <div className="sidebar-userlist">
          {filteredUsers.map((user) => (
            <div
              className="sidebar-usercard"
              key={user._id}
              onClick={() => sendChallenge(user)}
            >
              <span className="sidebar-username">
                {onlineUserIds.includes(user._id) && <span className="online-dot" />}
                {user.fullName.split(" ")[0]}
              </span>
              <button className="sidebar-challenge-btn">⚔</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
