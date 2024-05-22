const express = require("express");
const pool = require("../modules/pool");
const { sql } = require("node-pg-migrate/dist/operations/sql");
const router = express.Router();

/**
 * GET route template
 */
router.get("/", (req, res) => {
  // GET route code here
});

/**
 * POST route template
 */
router.post("/", (req, res) => {
  const sqlText = `
        INSERT INTO "user_preferences"
            (user_id, 
                max_price_range, 
                meat_preference, 
                religious_restrictions, 
                cuisine_types, 
                max_distance, 
                open_now, 
                accepts_large_parties)

            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const sqlValues = [req.body]
    pool.query(sqlText, sqlValues)
    .then ((results) =>{
        res.sendStatus(201);
    })
    .catch((error)=>{
        console.error("error updating user preferences", error);
    })
});

module.exports = router;
