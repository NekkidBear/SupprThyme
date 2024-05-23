const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', async (req, res) => {
    const limit = req.query.limit || 5; // Default limit is 5, or use the provided query param
  
    try {
      const query = `
        SELECT id, name, ranking_position, price_level, location_string
        FROM restaurants
        ORDER BY ranking_position ASC
        LIMIT $1;
      `;
      const result = await pool.query(query, [limit]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching top restaurants:', error);
      res.status(500).json({ error: 'Failed to fetch top restaurants' });
    }
  });

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
