const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./db');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();
const db = getDB(); // ✅ THIS LINE IS REQUIRED

// POST endpoint to fetch a random snippet (excluding used ones)
app.post('/api/snippet', async (req, res) => {
  const { language, excludeIds } = req.body;

  try {
    const collection = db.collection('snippets');

    const query = {
      language,
      ...(excludeIds?.length && {
        _id: { $nin: excludeIds.map(id => new ObjectId(id)) },
      }),
    };

    const count = await collection.countDocuments(query);
    if (count === 0) return res.status(404).json({ message: 'No more snippets.' });

    const random = Math.floor(Math.random() * count);
    const snippet = await collection.find(query).skip(random).limit(1).toArray();

    res.json(snippet[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch snippet' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
