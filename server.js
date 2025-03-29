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
    const thread = await openai.beta.threads.create();

    // Nachricht anhängen
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    // Assistant starten
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_DEINE_ASSISTANT_ID", // <-- hier deine echte ID einfügen
    });

    // Auf Ergebnis warten
    let result;
    while (true) {
      result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (result.status === "completed") break;
      await new Promise(r => setTimeout(r, 1000));
    }

    // Antwort abrufen
    const messages = await openai.beta.threads.messages.list(thread.id);
    const reply = messages.data[0].content[0].text.value;

    res.json({ reply });

  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({ error: "Es ist ein Fehler aufgetreten." });
  }
});

// WICHTIG für Render → dynamischer Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
