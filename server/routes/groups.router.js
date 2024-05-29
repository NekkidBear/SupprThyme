const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

/**
 * GET routes
 */
router.get("/", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT groups.id, groups.group_name, array_agg("user".username) AS members
         FROM groups
         JOIN group_members ON groups.id = group_members.group_id
         JOIN "user" ON group_members.user_id = "user".id
         WHERE groups.owner_id = $1
         GROUP BY groups.id`,
        [req.user.id]
      );
  
      res.send(result.rows);
    } catch (error) {
      console.error("Error completing SELECT groups query", error);
      res.sendStatus(500);
    }
  });

/**
 * POST routes
 */
router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const { name, members } = req.body;

    await client.query("BEGIN");

    const groupInsertResult = await client.query(
      "INSERT INTO groups (group_name, owner_id) VALUES ($1, $2) RETURNING id",
      [name, req.user.id]
    );
    const groupId = groupInsertResult.rows[0].id;

    // Add the group owner as a member of the group
    await client.query(
      "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
      [groupId, req.user.id]
    );

    console.log("members:", members);

    for (let memberId of members) {
      console.log("memberId:", memberId);
      if (memberId === null || memberId === undefined) {
        console.log(`skipping ${memberId} because ID is null`);
        continue;
      }
      await client.query(
        "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
        [groupId, memberId]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({message:'Group created'});
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(`Rollback, Error inserting group: ${error}`);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});
module.exports = router;
