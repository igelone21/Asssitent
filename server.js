require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

// ====================
// INITIALISIERUNG
// ====================
const app = express();
const PORT = process.env.PORT || 10000;

// ====================
// MIDDLEWARE
// ====================
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(express.json());

// Request-Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ====================
// OPENAI-INITIALISIERUNG (MIT FEHLERHANDLING)
// ====================
let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY ist nicht gesetzt!');
  }

  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 10000 // 10 Sekunden Timeout
  });
  console.log('✅ OpenAI erfolgreich initialisiert');
} catch (error) {
  console.error('❌ OpenAI-Initialisierungsfehler:', error.message);
  process.exit(1); // Beendet den Server bei fehlendem Key
}

// ====================
// ROUTEN
// ====================
app.get('/', (req, res) => {
  res.send('Server läuft! Letzte Aktualisierung: ' + new Date().toISOString());
});

app.post('/chat', async (req, res) => {
  // 1. Input-Validierung
  if (!req.body?.message || typeof req.body.message !== 'string') {
    console.warn('Ungültige Anfrage:', req.body);
    return res.status(400).json({ error: 'Nachricht fehlt oder ist ungültig' });
  }

  // 2. API-Request mit Timeout
  try {
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: req.body.message }],
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout nach 10s')), 10000)
    ]);

    // 3. Erfolgreiche Antwort
    console.log('Erfolgreiche API-Antwort');
    return res.json({ 
      reply: completion.choices[0].message.content 
    });

  } catch (error) {
    // 4. Fehlerbehandlung
    console.error('API-Fehler:', error.message);
    return res.status(500).json({ 
      error: 'Fehler bei der Anfrage',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ====================
// FEHLERHANDLING
// ====================
app.use((req, res) => {
  res.status(404).send('Route nicht gefunden');
});

app.use((err, req, res, next) => {
  console.error('Serverfehler:', err);
  res.status(500).send('Interner Serverfehler');
});

// ====================
// SERVERSTART
// ====================
app.listen(PORT, () => {
  console.log(`
  ====================================
  🚀 Server gestartet auf Port ${PORT}
  ====================================
  Umgebung: ${process.env.NODE_ENV || 'development'}
  OpenAI-Modell: ${process.env.OPENAI_MODEL || 'gpt-3.5-turbo'}
  CORS-Origins: ${process.env.ALLOWED_ORIGINS || 'alle (*)'}
  ====================================
  `);
});
