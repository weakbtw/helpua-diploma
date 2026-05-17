import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import pool from './db/pool.js';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import serviceRoutes from './routes/services.js';
import feedbackRoutes from './routes/feedback.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// API Health Check & Database Connectivity Verification
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'HelpUA API працює ✅', db: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

// Primary API Route Definitions
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/feedback', feedbackRoutes);

// Fallback handler for non-existent routes
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не знайдено' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Exception:', err.stack);
  res.status(500).json({ error: 'Внутрішня помилка сервера' });
});

// Server Lifecycle Management
app.listen(PORT, () => {
  console.log(`🚀 Сервер HelpUA запущено на порту ${PORT}`);
});
