const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config(); // Stellt sicher, dass Umgebungsvariablen geladen werden

const app = express();
app.use(cors());
app.use(express.json());  // Damit der JSON-Body verarbeitet wird

// Überprüfung Route GET /
app.get("/", (req, res) => {
  res.send("Server läuft!");  // Diese Antwort sollte im Browser erscheinen
});

// POST-Route für den Chat
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',  // Beispielmodell
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({ error: error.message || "Es ist ein Fehler aufgetreten." });
  }
});

// Dynamischer Port für Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
