// VKB Simple Bot Turn/Status Server
// Usage: node index.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory status for two bots (can expand for more)
let botStatus = {
  A: { status: 'waiting', timestamp: Date.now() },
  B: { status: 'waiting', timestamp: Date.now() }
};

// Optional: simple secret for basic protection (set to empty string to disable)
const SHARED_SECRET = process.env.VKB_SECRET || '';

function checkSecret(req, res, next) {
  if (SHARED_SECRET && req.body.secret !== SHARED_SECRET && req.query.secret !== SHARED_SECRET) {
    return res.status(403).json({ error: 'Forbidden: bad secret' });
  }
  next();
}

// Update bot status
app.post('/turn', checkSecret, (req, res) => {
  const { bot, status } = req.body;
  if (!bot || !status || !(bot in botStatus)) {
    return res.status(400).json({ error: 'Missing or invalid bot/status' });
  }
  botStatus[bot] = { status, timestamp: Date.now() };
  res.json({ ok: true });
});

// Get all bot status
app.get('/turn', checkSecret, (req, res) => {
  res.json(botStatus);
});

// Health check
app.get('/', (req, res) => {
  res.send('VKB Bot Status Server running.');
});

app.listen(PORT, () => {
  console.log(`VKB Server running on port ${PORT}`);
});
