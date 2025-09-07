const express = require('express');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: '1mb' }));
app.use(cors());

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Cache-Control', 'no-cache');
  res.type('html').sendFile('index.html', { root: __dirname });
});

app.post('/ask', async (req, res) => {
  const { prompt, temperature, max_tokens } = req.body;
  const baseUrl =
    process.env.OLLAMA_BASE_URL || 'http://host.docker.internal:11434';
  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt,
        temperature,
        max_tokens,
        stream: false
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach model server' });
  }
});

const setCacheHeaders = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const inContent = filePath.includes(`${path.sep}content${path.sep}`);
  const inTemplates = filePath.includes(`${path.sep}templates${path.sep}`);
  if (ext === '.html') {
    res.set('Cache-Control', 'no-cache');
  } else if (inContent || inTemplates || ext === '.js' || ext === '.css') {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
};

app.use(express.static(__dirname, { setHeaders: setCacheHeaders }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
