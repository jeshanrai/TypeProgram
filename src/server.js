const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // allow all origins; restrict this in production
    methods: ['GET', 'POST'],
  },
});

let connectedUsers = {}; // { socketId: username }

io.on('connection', (socket) => {
  console.log(`🟢 ${socket.id} connected`);

  socket.on('join', (username) => {
    connectedUsers[socket.id] = username;
    console.log(`👤 ${username} joined`);
    updateUserList();
  });

  socket.on('disconnect', () => {
    console.log(`🔴 ${socket.id} disconnected`);
    delete connectedUsers[socket.id];
    updateUserList();
  });

  socket.on('challenge', ({ from, to }) => {
    console.log(`⚔️ Challenge from ${from} to ${to}`);
    // Send challenge to the target user if they're online
    const targetSocketId = Object.keys(connectedUsers).find(
      key => connectedUsers[key] === to
    );
    if (targetSocketId) {
      io.to(targetSocketId).emit('incomingChallenge', { from });
    }
  });

  const updateUserList = () => {
    const userList = Object.values(connectedUsers).map(name => ({ name }));
    io.emit('userList', userList);
  };
});

server.listen(3001, () => {
  console.log('🚀 Socket.IO server running at http://localhost:3001');
});