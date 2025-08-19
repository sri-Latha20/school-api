import 'dotenv/config.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import schoolsRouter from './routes/schools.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));
app.use(compression());

// Basic rate limit (optional but recommended)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120, // 120 requests per minute per IP
});
app.use(limiter);

// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'School API is running' });
});

// Routes
app.use(schoolsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
