require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Optional: Request-Logger (zum Debuggen)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// OpenAI-Initialisierung
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /chat Route
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Keine Nachricht übergeben.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('Fehler bei der OpenAI-Anfrage:', error);
    res.status(500).json({ error: 'API-Fehler' });
  }
});

// Fallback-Route für 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route nicht gefunden' });
});

// Serverstart
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
