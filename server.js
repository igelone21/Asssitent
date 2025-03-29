const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS mit Einschränkungen
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'  // Beispiel: ALLOWED_ORIGINS="http://localhost:3000,https://deine-website.de"
}));

app.use(express.json());

// OpenAI-Client initialisieren
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test-Route
app.get("/", (req, res) => {
  res.send("Server läuft!");
});

// Chat-Route mit Validierung
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  
  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: "Ungültige Nachricht." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("Fehler:", error);
    if (error.response?.status === 429) {
      res.status(429).json({ error: "API-Limit erreicht. Bitte warten Sie." });
    } else {
      res.status(500).json({ error: error.message || "Interner Serverfehler." });
    }
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
