require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// 💡 Debug-Ausgabe
console.log("✅ Server-Code geladen (mit CORS Fix)");

// 🔐 CORS komplett erlauben
app.use(cors());
app.options('*', cors()); // <-- Behandelt Preflight global!

app.use(express.json());

// 🔑 OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🚀 POST /chat Endpoint
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
    console.error("❌ Fehler bei OpenAI:", error.response?.data || error.message || error);
    res.status(500).json({ error: 'API-Fehler' });
  }
});

// 📦 Fallback für andere Routen
app.use((req, res) => {
  res.status(404).json({ error: 'Route nicht gefunden' });
});

// 🟢 Serverstart
app.listen(PORT, () => {
  console.log(`🟢 Server läuft auf Port ${PORT}`);
});
