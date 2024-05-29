const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET routes
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM groups WHERE owner_id = $1',
            [req.user.id]
        );

        res.send(result.rows);
    } catch (error) {
        console.error('Error completing SELECT groups query', error);
        res.sendStatus(500);
    }
});
/**
 * POST routes
 */
router.post('/', async (req, res) => {
    const client = await pool.connect();

    try {
        const { name, members } = req.body;

        await client.query('BEGIN');

        const groupInsertResult = await client.query(
            'INSERT INTO groups (group_name, owner_id) VALUES ($1, $2) RETURNING id',
            [name, req.user.id]
        );

        const groupId = groupInsertResult.rows[0].id;

        for (let member of members) {
            await client.query(
                'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
                [groupId, member.id]
            );
        }

        await client.query('COMMIT');

        res.sendStatus(201);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Rollback, Error inserting group: ${error}`);
        res.sendStatus(500);
    } finally {
        client.release();
    }
});
module.exports = router;
