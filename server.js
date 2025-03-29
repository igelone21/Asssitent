const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI initialisieren
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Thread erstellen
    const thread = await openai.chat.completions.create({
      model: 'gpt-4', // Beispiel für GPT-4. Du kannst auch ein anderes Modell wählen.
      messages: [{ role: 'user', content: userMessage }],
    });

    // Antwort zurückgeben
    const reply = thread.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({ error: error.message || "Es ist ein Fehler aufgetreten." });
  }
});

// WICHTIG für Render → dynamischer Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
