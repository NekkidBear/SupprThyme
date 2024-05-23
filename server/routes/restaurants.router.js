const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

/**
 * GET route template
 */
router.get("/", async (req, res) => {
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
    console.error("Error fetching top restaurants:", error);
    res.status(500).json({ error: "Failed to fetch top restaurants" });
  }
});

//Search for restaurants based on aggregate criteria
router.get("/search", async (req, res) => {

  const buildWhereClause=(preferences) => {
    const conditions = [];
  
    if (preferences.cuisine) {
      conditions.push(`cuisine @> '{"${preferences.cuisine.join('", "')}"}''`);
    }
  
    if (preferences.dietaryRestrictions) {
      conditions.push(`dietary_restrictions @> '{"${preferences.dietaryRestrictions.join('", "')}"}''`);
    }
  
    if (preferences.priceRange) {
      const [minPrice, maxPrice] = preferences.priceRange;
      conditions.push(`price_level >= ${minPrice} AND price_level <= ${maxPrice}`);
    }
  
    // Add more conditions based on your preferences structure
  
    return conditions.join(' AND ');
  }
  const limit = req.query.limit || 5; // Default limit is 5, or use the provided query param

  try {
    const { aggregatePreferences } = req.query;
    const parsedPreferences = JSON.parse(aggregatePreferences);

    // Construct the SQL query based on the provided preferences
    const query = `
        SELECT id, name, rating, price_level, location_string, photo
        FROM restaurants
        WHERE ${buildWhereClause(parsedPreferences)}
        ORDER BY rating DESC
        LIMIT $1;
      `;

    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error searching restaurants:", error);
    res.status(500).json({ error: "Failed to search restaurants" });
  }
});

/**
 * POST route template
 */
router.post("/", (req, res) => {
  // POST route code here
});

module.exports = router;
