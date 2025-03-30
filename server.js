require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 10000;

console.log("✅ Server-Code geladen (manuelle CORS-Lösung)");

app.use(express.json());

// 🔧 Manuelles CORS-Handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Erlaube alle Domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Beantworte Preflight sofort
  }
  next();
});

// 🔑 OpenAI-Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 💬 POST /chat Endpoint
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
    console.error("❌ OpenAI-Fehler:", error.response?.data || error.message || error);
    res.status(500).json({ error: 'API-Fehler' });
  }
});

// 404 für alles andere
app.use((req, res) => {
  res.status(404).json({ error: 'Route nicht gefunden' });
});

// Start
app.listen(PORT, () => {
  console.log(`🟢 Server läuft auf Port ${PORT}`);
});
