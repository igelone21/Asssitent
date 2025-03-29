const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI initialisieren (schließt den Schlüssel aus dem Render-Umgebungsvariablen ein)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST-Route für den Chat
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // OpenAI Chat-API aufrufen
    const thread = await openai.chat.completions.create({
      model: 'gpt-4',  // Du kannst hier auch ein anderes Modell wählen
      messages: [{ role: 'user', content: userMessage }],
    });

    // Antwort von OpenAI zurückgeben
    const reply = thread.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({ error: error.message || "Es ist ein Fehler aufgetreten." });
  }
});

// Dynamischer Port für Render
const PORT = process.env.PORT || 10000;  // Standardport auf 10000, falls Render nicht konfiguriert ist
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
