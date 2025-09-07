const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.type('html').sendFile('index.html', { root: __dirname });
});

app.get(/^.*\.html$/, (req, res, next) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res
    .type('html')
    .sendFile(req.path, { root: __dirname }, err => {
      if (err) next();
    });
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
