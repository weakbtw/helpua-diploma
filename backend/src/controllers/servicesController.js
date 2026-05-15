import pool from '../db/pool.js';

export async function getAllServices(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, code, name, description, processing_days FROM services WHERE is_active = true ORDER BY name'
    );
    res.json({ services: result.rows });
  } catch (err) {
    console.error('GetAllServices error:', err.message);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}
