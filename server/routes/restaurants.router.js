const express = require("express");
const pool = require("../modules/pool");
const { build } = require("vite");
const router = express.Router();

/**
 * GET route template
 */
router.get("/", async (req, res) => {
  const limit = req.query.limit || 5; // Default limit is 5, or use the provided query param
  const userHomeMetro = req.query.userHomeMetro;
  try {
    const query = `
        SELECT id, name, rating, price_level, location_string, address
        FROM restaurants
        WHERE location_string ILIKE $1 --case-insensitive pattern matching
        ORDER BY rating ASC
        LIMIT $2;
      `;
    const result = await pool.query(query, [`%${userHomeMetro}%`, limit]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching top restaurants:", error);
    res.status(500).json({ error: "Failed to fetch top restaurants" });
  }
});

//Search for restaurants based on aggregate criteria
router.get("/search", async (req, res) => {
  const buildWhereClause = (preferences) => {
    const conditions = [];

    if (preferences.allergens) {
      const allergenCondition = preferences.allergens
        .map((allergen) => `'${allergen}'`)
        .join(", ");
      conditions.push(`NOT EXISTS (
        SELECT 1
        FROM user_allergens ua
        JOIN restaurants r ON r.id = restaurants.id
        WHERE ua.user_id = ANY(r.user_ids)
        AND ua.allergen_id IN (${allergenCondition})
      )`);
    }

    if (preferences.meatPreference) {
      conditions.push(`meat_preference = ${preferences.meatPreference}`);
    }

    if (preferences.religiousRestrictions) {
      conditions.push(
        `religious_restrictions = ${preferences.religiousRestrictions}`
      );
    }

    if (preferences.cuisineTypes) {
      const cuisineCondition = preferences.cuisineTypes
        .map((cuisine) => `'${cuisine}'`)
        .join(", ");
      conditions.push(`cuisine && ARRAY[${cuisineCondition}]`);
    }

    if (preferences.maxDistance) {
      conditions.push(`distance <= ${preferences.maxDistance}`);
    }

    if (preferences.openNow) {
      conditions.push(`is_open_now = ${preferences.openNow}`);
    }

    if (preferences.acceptsLargeParties) {
      conditions.push(
        `accepts_large_parties = ${preferences.acceptsLargeParties}`
      );
    }

    if (preferences.priceRange) {
      const [minPrice, maxPrice] = preferences.priceRange;
      conditions.push(
        `price_level >= ${minPrice} AND price_level <= ${maxPrice}`
      );
    }

    return conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  };
  const limit = req.query.limit || 5; // Default limit is 5, or use the provided query param

  try {
    const { aggregatePreferences } = req.query;
    const parsedPreferences = JSON.parse(aggregatePreferences);
    const whereClause = buildWhereClause(parsedPreferences);

    // Construct the SQL query based on the provided preferences
    const query = `
      SELECT id, name, rating, price_level, location_string, address
      FROM restaurants
      ${whereClause}
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
