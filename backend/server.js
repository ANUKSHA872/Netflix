import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

import app from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const frontendPath = path.join(__dirname, '../dist');
  app.use(express.static(frontendPath));
  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (isProduction) {
    console.log(`\n  ➜  StreamNest: http://localhost:${PORT}\n`);
  } else {
    console.log('\n  ➜  StreamNest: http://localhost:5173');
    console.log('  ➜  API:       http://localhost:5000\n');
  }
});
