# OpenAI Assistant Backend (Deutsch)

Dies ist ein einfaches Node.js-Backend, um einen Assistant aus dem OpenAI Playground via API in deine Webflow-Seite einzubinden.

## 🚀 Anleitung

### 1. .env anlegen
Kopiere `.env.example` nach `.env` und füge deinen OpenAI API Key ein.

### 2. Assistant-ID setzen
In `server.js`, ersetze `asst_DEINE_ASSISTANT_ID_HIER` durch deine Assistant-ID aus dem Playground.

### 3. Starten (lokal)
```bash
npm install
node server.js
```

### 4. Auf Render deployen
- Neues Web Service auf [https://render.com](https://render.com) erstellen
- GitHub-Repo verbinden
- Umgebungsvariable `OPENAI_API_KEY` setzen
- Start Command: `node server.js`

## 🌐 Webflow Integration

Füge folgenden Code in ein Embed-Element in Webflow ein:

```html
<input type="text" id="userInput" placeholder="Stelle eine Frage" />
<button onclick="sendMessage()">Senden</button>
<p id="response"></p>

<script>
  async function sendMessage() {
    const message = document.getElementById("userInput").value;
    const res = await fetch("https://DEIN-BACKEND.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    document.getElementById("response").textContent = data.reply;
  }
</script>
```

Viel Erfolg!