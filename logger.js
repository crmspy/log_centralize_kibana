const winston = require('winston');
const { printf, combine, timestamp, json, colorize, metadata } = winston.format;
const os = require('os');  // Mengimpor os module untuk hostname
const DailyRotateFile = require('winston-daily-rotate-file');  // Mengimpor winston-daily-rotate-file

// Custom log format untuk console
const customFormat = printf(({ timestamp, level, message, metadata }) => {
  let logMessage = `${timestamp} [${level}] ${message}`;

  // Menambahkan traceId jika ada di metadata
  if (metadata && metadata.traceId) {
    logMessage += ` | TraceId: ${metadata.traceId}`;
  }

  // Menambahkan PID dan Server Name dari metadata (jika ada)
  const pid = metadata && metadata.pid ? metadata.pid : process.pid;
  const serverName = metadata && metadata.os ? metadata.os : os.hostname();
  
  logMessage += ` | PID: ${pid} | Server: ${serverName}`;

  // Menambahkan metadata lainnya jika ada dan tidak kosong
  if (metadata && Object.keys(metadata).length > 0) {
    logMessage += ` | Metadata: ${JSON.stringify(metadata)}`;
  }

  return logMessage;
});

// Logger setup
const logger = winston.createLogger({
  level: 'info', // default level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    metadata({ fillExcept: ['message', 'level', 'timestamp'] }), // Menambahkan metadata otomatis
    json() // format output log dalam bentuk JSON
  ),
  transports: [
    // Console log dengan format warna dan custom
    new winston.transports.Console({
      format: combine(
        colorize(),
        customFormat // format custom untuk console
      )
    }),
    // Log ke file dalam format JSON dengan rotation harian
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log', // Format nama file dengan tanggal
      datePattern: 'YYYY-MM-DD', // Format rotasi harian
      level: 'info', // hanya log dengan level info atau lebih tinggi yang disimpan
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Timestamp langsung di sini
        json() // format JSON untuk file log
      ),
      zippedArchive: true, // Mengkompresi file log lama
      maxSize: '20m', // Maksimal ukuran file sebelum ter-rotate
      maxFiles: '14d' // Hanya simpan log selama 14 hari terakhir
    })
  ],
});

// Menambahkan metadata (PID dan server) secara otomatis dalam log
logger.info('Server started on http://localhost:3000', {
  traceId: '123e4567-e89b-12d3-a456-426614174000',
});

logger.warn('This is a warning log');
logger.error('This is an error log', { userId: 123, errorCode: '500' });
logger.error(new Error('An error occurred in the system'), { userId: 123 });

module.exports = logger;
