const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();  // Stellt sicher, dass Umgebungsvariablen geladen werden

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Damit der JSON-Body verarbeitet wird

// OpenAI initialisieren
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });  // API-Schlüssel wird aus Umgebungsvariablen geladen

// Testroute für die einfache Überprüfung, ob der Server läuft
app.get("/", (req, res) => {
  res.send("Server läuft!");
});

// POST-Route für den Chat
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;  // Nachricht vom Benutzer

  try {
    // Chat-Komplettierung an OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4',  // Beispielmodell (du kannst auch ein anderes Modell wählen)
      messages: [{ role: 'user', content: userMessage }],
    });

    // Antwort von OpenAI zurückgeben
    const reply = response.choices[0].message.content;
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
