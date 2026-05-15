import pool from '../db/pool.js';

export async function createFeedback(req, res) {
  const { firstName, lastName, email, category, message } = req.body;

  try {
    // Optional fields default to null if not provided
    await pool.query(
      `INSERT INTO feedbacks (first_name, last_name, email, category, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName || null, lastName || null, email, category || null, message]
    );

    res.status(201).json({ message: 'Повідомлення успішно надіслано' });
  } catch (err) {
    console.error('CreateFeedback error:', err.message);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

export async function getAllFeedbacks(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM feedbacks ORDER BY created_at DESC'
    );
    res.json({ feedbacks: result.rows });
  } catch (err) {
    console.error('GetAllFeedbacks error:', err.message);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

export async function markFeedbackRead(req, res) {
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE feedbacks SET is_read = true WHERE id = $1',
      [id]
    );
    res.json({ message: 'Позначено як прочитане' });
  } catch (err) {
    console.error('MarkFeedbackRead error:', err.message);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}
