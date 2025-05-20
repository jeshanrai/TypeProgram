const express = require('express');
const router = express.Router();

// Example route to get snippets
router.get('/', (req, res) => {
  res.json({ message: 'Get all snippets' });
});

// Add more routes here as needed (POST, PUT, DELETE)

module.exports = router;
