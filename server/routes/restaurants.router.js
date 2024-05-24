const express = require("express");
const pool = require("../modules/pool");
const { build } = require("vite");
const router = express.Router();
const googleMapsClient = require("@google/maps").createClient({
  key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  Promise: Promise,
});

async function normalizeLocation(city, state) {
  const response = await googleMapsClient
    .geocode({
      address: `${city}, ${state}`,
    })
    .asPromise();

  if (response.json.results.length > 0) {
    const result = response.json.results[0];
    const cityComponent = result.address_components.find((component) =>
      component.types.includes("locality")
    );
    const stateComponent = result.address_components.find((component) =>
      component.types.includes("administrative_area_level_1")
    );

    return {
      city: cityComponent ? cityComponent.long_name : city,
      state: stateComponent ? stateComponent.long_name : state,
    };
  } else {
    return { city, state };
  }
}
/**
 * GET route template
 */
router.get("/", async (req, res) => {
  const limit = req.query.limit || 5; // Default limit is 5, or use the provided query param
  const address = req.query.address;
  try {
    const query = `
      SELECT id, name, rating, price_level, location_string, address
      FROM restaurants
      WHERE address ILIKE $1 -- case-insensitive pattern matching for address
      ORDER BY rating ASC
      LIMIT $2;
    `;
    const result = await pool.query(query, [`%${address}%`, limit]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching top restaurants:", error);
    res.status(500).json({ error: "Failed to fetch top restaurants" });
  }
});

//Search for restaurants based on aggregate criteria
router.get("/search", async (req, res) => {
  const buildWhereClause = async (preferences, userLocationString) => {
    const conditions = [];
    const values = [];

    if (preferences.allergens) {
      const allergenCondition = preferences.allergens
        .map((_, index) => `$${index + 1}`)
        .join(", ");
      conditions.push(`NOT EXISTS (
        SELECT 1
        FROM user_allergens ua
        JOIN restaurants r ON r.id = restaurants.id
        WHERE ua.user_id = ANY(r.user_ids)
        AND ua.allergen_id IN (${allergenCondition})
      )`);
      values.push(...preferences.allergens);
    }

    if (preferences.meatPreference) {
      conditions.push(`meat_preference = $${values.length + 1}`);
      values.push(preferences.meatPreference);
    }

    if (preferences.religiousRestrictions) {
      conditions.push(`religious_restrictions = $${values.length + 1}`);
      values.push(preferences.religiousRestrictions);
    }

    if (preferences.cuisineTypes) {
      const cuisineCondition = preferences.cuisineTypes
        .map((_, index) => `$${values.length + index + 1}`)
        .join(", ");
      conditions.push(`cuisine && ARRAY[${cuisineCondition}]`);
      values.push(...preferences.cuisineTypes);
    }

    if (preferences.maxDistance) {
      conditions.push(`distance <= $${values.length + 1}`);
      values.push(preferences.maxDistance);
    }

    if (preferences.openNow) {
      conditions.push(`open_now = $${values.length + 1}`);
      values.push(preferences.openNow);
    }

    if (userLocationString) {
      conditions.push(`location_string = $${values.length + 1}`);
      values.push(userLocationString);
    }

    return {
      whereClause:
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
      values,
    };
  };

  const limit = req.query.limit || 5; // Default limit is 5, or use the provided query param

  try {
    let { aggregatePreferences } = req.query;

    console.log("Query parameters:", req.query);

    let parsedPreferences = {};
    if (aggregatePreferences) {
      try {
        parsedPreferences = JSON.parse(aggregatePreferences);
      } catch (error) {
        console.error("Error parsing aggregatePreferences:", error);
        return res
          .status(400)
          .json({ error: "Invalid aggregatePreferences parameter" });
      }
    }

    const { city, state } = parsedPreferences;

    const location = await normalizeLocation(city, state);
    const userLocationString = `${location.city}, ${location.state}`;

    const { whereClause, values } = await buildWhereClause(
      parsedPreferences,
      userLocationString
    );

    console.log(whereClause);

    const query = `
      SELECT id, name, rating, price_level, location_string, address
      FROM restaurants
      ${whereClause}
      ORDER BY rating DESC
      LIMIT $${values.length + 1};
    `;

    values.push(limit);

    // Log the complete SQL query
    const completeQuery = query.replace(
      /\$(\d+)/g,
      (_, index) => `'${values[index - 1]}'`
    );
    console.log(completeQuery);

    const result = await pool.query(query, values);
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
