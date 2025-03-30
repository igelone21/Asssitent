require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// CORS-Konfiguration
app.use(cors({
  origin: '*', // Erlaube alle Domains (für Entwicklung)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Debug: zeigt ob der Code wirklich deployed ist
console.log("✅ Server-Code geladen");

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
    console.error("Fehler bei der OpenAI-Anfrage:", error.response?.data || error.message || error);
    res.status(500).json({ error: 'API-Fehler' });
  }
});

// Fallback für alle anderen Routen
app.use((req, res) => {
  res.status(404).json({ error: 'Route nicht gefunden' });
});

// Serverstart
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
