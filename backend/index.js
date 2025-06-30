const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectDB, getDB } = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

const connectedUsers = new Map();

app.use(cors());
app.use(express.json());

(async () => {
  await connectDB();
  const db = getDB();

  // --- Socket.IO ---
  io.on('connection', socket => {
    console.log(`🟢 Socket connected: ${socket.id}`);
 function emitOnlineUsers() {
    const onlineUserIds = Array.from(connectedUsers.keys());
    io.emit('online-users', onlineUserIds);
  }
  // Register user on connection
  socket.on('register-user', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
    emitOnlineUsers(); // 👈 Update everyone
  });
    // Handle challenge sent
    socket.on('send-challenge', ({ from, to }) => {
      const toSocketId = connectedUsers.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit('receive-challenge', { from });
        console.log(`📨 Challenge sent from ${from} to ${to}`);
      }
    });

    // Handle challenge accepted
    socket.on('accept-challenge', ({ from, to }) => {
      const fromSocketId = connectedUsers.get(from);
      if (fromSocketId) {
        io.to(fromSocketId).emit('challenge-accepted', { to });
        io.to(fromSocketId).emit('start-game');
        io.to(socket.id).emit('start-game');
        console.log(`✅ Challenge accepted by ${to} for ${from}`);
      }
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      for (let [userId, socketId] of connectedUsers) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`🔴 Disconnected: ${userId}`);
          break;
        }
      }
      emitOnlineUsers(); // 👈 Update everyone
    });
  });

  // --- Routes ---

  // Register
  app.post('/api/register', async (req, res) => {
    const { fullName, email, password, phone } = req.body;
    if (!fullName || !email || !password || !phone)
      return res.status(400).json({ msg: 'All fields are required' });

    try {
      const usersCollection = db.collection('users');
      const existing = await usersCollection.findOne({ email });
      if (existing) return res.status(400).json({ msg: 'Email already registered' });

      const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
      const newUser = {
        fullName,
        email,
        password: hashedPassword,
        phone,
        createdAt: new Date()
      };

      await usersCollection.insertOne(newUser);
      res.status(201).json({ msg: 'User registered successfully' });

    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });

  // Login
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(400).json({ msg: 'Invalid credentials' });

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        }
      });

    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ msg: 'Server error during login' });
    }
  });

  // Get all users
  app.get('/api/auth/users', async (req, res) => {
    try {
      const users = await db.collection('users')
        .find({}, { projection: { _id: 1, fullName: 1 } })
        .toArray();
      res.json(users);
    } catch (err) {
      console.error('Fetch users error:', err);
      res.status(500).json({ msg: 'Failed to fetch users' });
    }
  });

  // Random snippet
  app.post('/api/snippet', async (req, res) => {
    const { language, excludeIds } = req.body;
    try {
      const snippetCollection = db.collection('snippets');
      const query = {
        language,
        ...(excludeIds?.length && {
          _id: { $nin: excludeIds.map(id => new ObjectId(id)) }
        })
      };

      const count = await snippetCollection.countDocuments(query);
      if (count === 0) return res.status(404).json({ message: 'No more snippets.' });

      const random = Math.floor(Math.random() * count);
      const snippet = await snippetCollection.find(query).skip(random).limit(1).toArray();
      res.json(snippet[0]);

    } catch (err) {
      console.error('Snippet fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch snippet' });
    }
  });

  // --- Start server ---
  server.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
})();
