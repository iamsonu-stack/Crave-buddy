
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import pool from './db.js';
import authRoutes from './routes/auth.js';

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error(
    'JWT_SECRET missing or too short. Set a secret of at least 32 characters in backend/.env.'
  );
  process.exit(1);
}

const app = express();
const port = Number(process.env.PORT || 5000);

const allowedOrigins = (
  process.env.FRONTEND_ORIGIN ||
  'http://localhost:5173,http://localhost:5174'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      // Allow local health checks and requests without an Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error('This origin is not allowed by the API CORS policy.')
      );
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

// Check whether the API and PostgreSQL are working.
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      status: 'ok',
      api: 'CraveBuddy API',
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      status: 'error',
      api: 'CraveBuddy API',
      database: 'unavailable',
    });
  }
});

// Login, registration, current-user and logout routes.
app.use('/api/auth', authRoutes);

// Common error handler.
app.use((error, _req, res, _next) => {
  console.error('API error:', error?.message || error);

  if (res.headersSent) return;

  res.status(500).json({
    message: 'An unexpected server error occurred. Please try again.',
  });
});

const server = app.listen(port, () => {
  console.log(`CraveBuddy API running at http://localhost:${port}`);
});

// Close connections safely when the server stops.
async function shutdown() {
  console.log('Shutting down CraveBuddy API...');

  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
