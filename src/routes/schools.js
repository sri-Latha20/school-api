import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import db from '../db.js';

const router = Router();

// Helpers
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /addSchool
router.post(
  '/addSchool',
  [
    body('name').isString().trim().isLength({ min: 2 }).withMessage('name must be at least 2 chars'),
    body('address').isString().trim().isLength({ min: 3 }).withMessage('address must be at least 3 chars'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('latitude must be between -90 and 90'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('longitude must be between -180 and 180'),
  ],
  handleValidation,
  async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    try {
      const [result] = await db.execute(
        'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
        [name, address, latitude, longitude]
      );
      const [rows] = await db.execute('SELECT * FROM schools WHERE id = ?', [result.insertId]);
      res.status(201).json({ message: 'School added', school: rows[0] });
    } catch (err) {
      console.error('Error inserting school:', err);
      res.status(500).json({ error: 'Failed to add school' });
    }
  }
);

// GET /listSchools?lat=<>&lon=<>
router.get(
  '/listSchools',
  [
    query('lat').exists().withMessage('lat is required').bail().isFloat({ min: -90, max: 90 }),
    query('lon').exists().withMessage('lon is required').bail().isFloat({ min: -180, max: 180 }),
  ],
  handleValidation,
  async (req, res) => {
    const userLat = Number(req.query.lat);
    const userLon = Number(req.query.lon);

    // Haversine formula in MySQL to compute distance in KM
    const sql = `
      SELECT
        id, name, address, latitude, longitude,
        ROUND(6371 * 2 * ASIN(SQRT(
          POWER(SIN(RADIANS(latitude - ?) / 2), 2) +
          COS(RADIANS(?)) * COS(RADIANS(latitude)) *
          POWER(SIN(RADIANS(longitude - ?) / 2), 2)
        )), 3) AS distance_km
      FROM schools
      ORDER BY distance_km ASC
    `;

    try {
      const [rows] = await db.execute(sql, [userLat, userLat, userLon]);
      res.json({ count: rows.length, schools: rows });
    } catch (err) {
      console.error('Error listing schools:', err);
      res.status(500).json({ error: 'Failed to list schools' });
    }
  }
);

export default router;
