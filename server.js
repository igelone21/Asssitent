const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();

// Middleware zuerst!
app.use(cors());
app.use(express.json());

// Explizite Route-Registrierung vor dem Listen
app.post('/chat', async (req, res) => {
  console.log('POST /chat reached'); // WICHTIG für Debugging
  
  if (!req.body?.message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: req.body.message }],
    });
    
    return res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return res.status(500).json({ error: 'AI Service Error' });
  }
});

// GET-Route
app.get('/', (req, res) => {
  res.send('Server läuft! Final Version');
});

// Error Handling
app.use((req, res) => {
  res.status(404).send('Route not found');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
  console.log(`➡️ Test with: curl -X POST http://localhost:${PORT}/chat -H "Content-Type: application/json" -d '{"message":"Hi"}'`);
});
