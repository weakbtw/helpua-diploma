import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Required for secure connections to cloud database providers (e.g. Supabase)
  ssl: { rejectUnauthorized: false },
});

pool.on('connect', () => {
  console.log('✅ Підключено до PostgreSQL (Supabase)');
});

pool.on('error', (err) => {
  console.error('❌ Помилка підключення до БД:', err.message);
});

export default pool;
