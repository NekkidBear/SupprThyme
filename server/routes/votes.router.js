const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// POST route to handle new votes
router.post('/', async (req, res) => {
  const { groupId, restaurantId, userId } = req.body;

  if (!groupId || !restaurantId || !userId) {
    return res.status(400).json({ error: 'groupId, restaurantId, and userId are required' });
  }

  try {
    // Check if the user has already voted in this group
    const checkVoteQuery = `
      SELECT * FROM votes
      WHERE group_id = $1 AND user_id = $2
    `;
    const checkVoteResult = await pool.query(checkVoteQuery, [groupId, userId]);

    if (checkVoteResult.rows.length > 0) {
      // If the user has already voted, update their vote
      const updateVoteQuery = `
        UPDATE votes
        SET restaurant_id = $1
        WHERE group_id = $2 AND user_id = $3
        RETURNING *
      `;
      const result = await pool.query(updateVoteQuery, [restaurantId, groupId, userId]);
      res.json(result.rows[0]);
    } else {
      // If the user hasn't voted yet, insert a new vote
      const insertVoteQuery = `
        INSERT INTO votes (group_id, restaurant_id, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await pool.query(insertVoteQuery, [groupId, restaurantId, userId]);
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// GET route to retrieve votes for a group
router.get('/:groupId', async (req, res) => {
  const { groupId } = req.params;

  try {
    const query = `
      SELECT v.restaurant_id, r.name, COUNT(*) as vote_count
      FROM votes v
      JOIN restaurants r ON v.restaurant_id = r.id
      WHERE v.group_id = $1
      GROUP BY v.restaurant_id, r.name
      ORDER BY vote_count DESC
    `;
    const result = await pool.query(query, [groupId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving votes:', error);
    res.status(500).json({ error: 'Failed to retrieve votes' });
  }
});

module.exports = router;
