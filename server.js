const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Cache-Control', 'no-cache');
  res.type('html').sendFile('index.html', { root: __dirname });
});

app.get(/^(?!\/templates\/).*\.html$/, (req, res, next) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Cache-Control', 'no-cache');
  res
    .type('html')
    .sendFile(req.path, { root: __dirname }, err => {
      if (err) next();
    });
});

const setImmutableCache = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const isImmutable =
    filePath.includes(`${path.sep}content${path.sep}`) ||
    filePath.includes(`${path.sep}templates${path.sep}`) ||
    ext === '.js' ||
    ext === '.css';
  if (isImmutable) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
};

app.use(express.static(__dirname, { setHeaders: setImmutableCache }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
