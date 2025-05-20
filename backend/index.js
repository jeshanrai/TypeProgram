const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const snippetRoutes = require('./routes/snippetRoutes');  // <--- this

require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/snippets', snippetRoutes);  // <--- use route

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
