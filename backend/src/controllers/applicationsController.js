import pool from '../db/pool.js';
import jwt from 'jsonwebtoken';

// Format: #TIMESTAMP-RANDOM (e.g., #1Q2W3E4R-5T6Y)
const generateTicketId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `#${timestamp}-${random}`;
};

// Fallback logic for extracting userId if auth middleware is bypassed or optional
const extractUserId = (req) => {
  try {
    if (req.user?.id) return req.user.id;
    
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return null;
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET);
    return decoded.id || decoded.userId || null;
  } catch {
    return null;
  }
};

export async function createApplication(req, res) {
  const {
    fullName, idCode, phone, address,
    serviceType, region, description,
  } = req.body;

  if (!fullName || !idCode || !phone || !address || !serviceType || !region) {
    return res.status(400).json({ error: 'Заповніть всі обов\'язкові поля' });
  }

  if (!/^\d{10}$/.test(idCode)) {
    return res.status(400).json({ error: 'ІПН має містити рівно 10 цифр' });
  }

  try {
    const serviceResult = await pool.query(
      'SELECT id FROM services WHERE code = $1 AND is_active = true',
      [serviceType]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(400).json({ error: 'Послугу не знайдено' });
    }

    const serviceId = serviceResult.rows[0].id;
    const ticketId = generateTicketId();
    const userId = extractUserId(req);
    const formData = { description: description || '' };

    const result = await pool.query(
      `INSERT INTO applications
        (user_id, service_id, full_name, id_code, phone, address, region, description, form_data, ticket_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, ticket_id, status, created_at`,
      [userId, serviceId, fullName, idCode, phone, address, region, description || '', formData, ticketId]
    );

    const application = result.rows[0];

    // Tracking initial status creation in history logs
    await pool.query(
      `INSERT INTO status_history (application_id, changed_by, old_status, new_status, comment)
       VALUES ($1, $2, $3, $4, $5)`,
      [application.id, userId, null, 'pending', 'Заявку подано']
    );

    res.status(201).json({
      message: 'Заявку успішно подано',
      ticketId: application.ticket_id,
      status: application.status,
      createdAt: application.created_at,
    });
  } catch (err) {
    console.error('CreateApplication error:', err.message);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

export async function getMyApplications(req, res) {
  try {
    const result = await pool.query(
      `SELECT
        a.id, a.ticket_id, a.full_name, a.status,
        a.region, a.created_at, a.updated_at,
        s.name AS service_name, s.code AS service_code
       FROM applications a
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );

    res.json({ applications: result.rows });
  } catch (err) {
    console.error('GetMyApplications error:', err.message);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

export async function getApplicationById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
        a.*, s.name AS service_name, s.code AS service_code,
        s.processing_days
       FROM applications a
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заявку не знайдено' });
    }

    const application = result.rows[0];

    // Restrict access: only admins or the application owner can view details
    if (req.user.role !== 'admin' && application.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Доступ заборонено' });
    }

    const historyResult = await pool.query(
      `SELECT sh.*, u.first_name, u.last_name
       FROM status_history sh
       LEFT JOIN users u ON sh.changed_by = u.id
       WHERE sh.application_id = $1
       ORDER BY sh.changed_at ASC`,
      [id]
    );

    res.json({
      application,
      statusHistory: historyResult.rows,
    });
  } catch (err) {
    console.error('GetApplicationById error:', err.message);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

export async function updateApplicationStatus(req, res) {
  const { id } = req.params;
  const { status, comment } = req.body;

  const validStatuses = ['pending', 'reviewing', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Недійсний статус' });
  }

  try {
    const current = await pool.query(
      'SELECT status FROM applications WHERE id = $1',
      [id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Заявку не знайдено' });
    }

    const oldStatus = current.rows[0].status;

    await pool.query(
      'UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );

    // Keep an audit trail of status changes
    await pool.query(
      `INSERT INTO status_history (application_id, changed_by, old_status, new_status, comment)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, req.user.id, oldStatus, status, comment || '']
    );

    res.json({
      message: 'Статус оновлено',
      oldStatus,
      newStatus: status,
    });
  } catch (err) {
    console.error('UpdateStatus error:', err.message);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

export async function getAllApplications(req, res) {
  const { status, region, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Dynamic SQL building for optional filters (status, region)
    let query = `
      SELECT
        a.id, a.ticket_id, a.full_name, a.status,
        a.region, a.phone, a.created_at,
        s.name AS service_name
      FROM applications a
      LEFT JOIN services s ON a.service_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }
    if (region) {
      params.push(region);
      query += ` AND a.region = $${params.length}`;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM applications',
    );

    res.json({
      applications: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error('GetAllApplications error:', err.message);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}
