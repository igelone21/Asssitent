const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();  // Damit Umgebungsvariablen geladen werden

const app = express();

// Middleware
app.use(cors());  // CORS erlauben
app.use(express.json());  // JSON im Request-Body erlauben

// OpenAI initialisieren
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST Route für den Chat
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Chat-Komplettierung an OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4',  // Beispielmodell, du kannst auch ein anderes Modell wählen
      messages: [{ role: 'user', content: userMessage }],
    });

    // Antwort zurückgeben
    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({ error: error.message || "Es ist ein Fehler aufgetreten." });
  }
});

// Dynamischer Port, um auf Render zu funktionieren
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
