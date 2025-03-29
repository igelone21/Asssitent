const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_DEINE_ASSISTANT_ID_HIER", // <-- Assistant-ID einfügen
    });

    let result;
    while (true) {
      result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (result.status === "completed") break;
      await new Promise(r => setTimeout(r, 1000));
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const reply = messages.data[0].content[0].text.value;
    res.json({ reply });
  } catch (err) {
    console.error("Fehler:", err);
    res.status(500).json({ error: "Etwas ist schiefgelaufen." });
  }
});

app.listen(3000, () => console.log("Assistant-Server läuft auf Port 3000"));