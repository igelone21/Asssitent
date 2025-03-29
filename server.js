const express = require('express');
const app = express();

// 1. Magic Middleware (loggt ALLES)
app.use((req, res, next) => {
  console.log(`👉 ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// 2. Body-Parser mit Error-Handling
app.use(express.json({
  strict: false,
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      console.error('⚠️ Invalid JSON received:', buf.toString());
      throw new Error('Invalid JSON');
    }
  }
}));

// 3. Test-Route mit atomic logging
app.post('/chat', (req, res) => {
  console.log('💥 POST /chat Body:', req.body || 'NO BODY');
  if (!req.body?.message) {
    console.error('❌ Missing message field');
    return res.status(400).json({ error: 'message field required' });
  }
  res.json({ echo: req.body.message });
});

// 4. Expliziter 404-Handler
app.use((req, res) => {
  console.error(`🚫 404: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

// 5. Nuclear launch codes
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`\n\n███████████████████████████████████████\n█ SERVER STARTED ON PORT ${PORT} █\n███████████████████████████████████████\n`);
  process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT ERROR:', err);
  });
});
