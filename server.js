require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

// Initialisierung
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI-Initialisierung
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Routen
app.post('/chat', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: req.body.message }],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'API-Fehler' });
  }
});

// Serverstart
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
