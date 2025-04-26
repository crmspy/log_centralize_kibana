const express = require('express');
const logger = require('./logger'); // Mengimpor logger yang sudah dibuat
const { v4: uuidv4 } = require('uuid');  // Mengimpor uuid untuk generate traceId

const app = express();
const port = 3000;

// Middleware untuk menambahkan traceId di setiap request
app.use((req, res, next) => {
  // Generate traceId untuk setiap request
  const traceId = uuidv4();

  // Menambahkan traceId ke dalam log setiap request
  logger.info(`Request received: ${req.method} ${req.url}`, { traceId, ip: req.ip });

  // Menyimpan traceId dalam response header agar bisa dilihat oleh client (opsional)
  res.setHeader('X-Trace-Id', traceId);

  // Menyimpan traceId dalam request untuk digunakan di endpoint lainnya
  req.traceId = traceId;

  next();
});

// Sample endpoint 1: Hello World
app.get('/', (req, res) => {
  logger.info('Root endpoint hit', { traceId: req.traceId });
  res.send('Hello World');
});

// Sample endpoint 2: Simulasi error
app.get('/error', (req, res) => {
  try {
    throw new Error('Simulated error!');
  } catch (err) {
    logger.error('An error occurred', { traceId: req.traceId, error: err.stack });
    res.status(500).send('Something broke!');
  }
});

// Sample endpoint 3: Log dengan metadata
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  logger.info('Fetching user data', { userId, traceId: req.traceId });
  res.json({ userId, name: 'John Doe', age: 30 });
});

// Start server
app.listen(port, () => {
  logger.info(`Server started on http://localhost:${port}`);
});
