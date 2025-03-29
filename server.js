const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Vereinfachte CORS für Testzwecke
app.use(cors());

app.use(express.json());

// OpenAI-Client mit Fehlerbehandlung
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch (error) {
  console.error("OpenAI Initialization Error:", error);
  process.exit(1);
}

// Test-Route
app.get("/", (req, res) => {
  res.send("Server läuft! Version 1.0");
});

// Chat-Route mit erweiterter Logging
app.post("/chat", async (req, res) => {
  console.log("Received request body:", req.body);
  
  if (!req.body || !req.body.message) {
    return res.status(400).json({ error: "Nachricht fehlt im Request-Body" });
  }

  const userMessage = req.body.message;
  
  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo', // günstiger für Tests
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.choices[0].message.content;
    console.log("Successful response:", reply);
    res.json({ reply });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ 
      error: "Serverfehler",
      details: error.message 
    });
  }
});

// Server mit Port 10000 für Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
