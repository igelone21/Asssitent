const express = require('express');
const app = express();

// 1. KRITISCHE MIDDLEWARE ZUERST
app.use(express.json()); // MUSS vor allen Routen stehen

// 2. Explizite Route-Registrierung
app.post('/chat', (req, res) => {
  console.log('✅ POST /chat triggered with:', req.body);
  res.json({ 
    status: 'success',
    message: req.body.message || 'No message received'
  });
});

// 3. Error-Handling
app.use((req, res) => {
  console.error(`🚨 404: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

// 4. Serverstart mit Debug-Logs
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('\n--- SERVER STARTED ---');
  console.log('✅ GET  /       → Root endpoint');
  console.log(`✅ POST /chat   → Test with: curl -X POST http://localhost:${PORT}/chat -H "Content-Type: application/json" -d '{"message":"Hi"}'`);
  console.log('---------------------');
});
