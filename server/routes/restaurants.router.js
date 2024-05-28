const express = require("express");
const pool = require("../modules/pool");
const { build } = require("vite");
const router = express.Router();
const googleMapsClient = require("@google/maps").createClient({
  key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  Promise: Promise,
});

async function normalizeLocation(city, state) {
  console.log("normalizeLocation input:", { city, state });
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
    console.log("normalizeLocation output:", {
      city: cityComponent ? cityComponent.long_name : city,
      state: stateComponent ? stateComponent.long_name : state,
    });
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
    SELECT DISTINCT id, name, rating, price_level, location_string, address, latitude, longitude
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
    console.log("buildWhereClause input: ", {
      preferences,
      userLocationString,
    });
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

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    console.log("buildWhere output: ", { whereClause, values });
    return {
      whereClause,
      values,
    };
  };

  const limit = req.query.limit || 5; // Default limit is 5, or use the provided query param

  try {
    let { aggregatePreferences, group_id } = req.query;
    console.log('aggregatePreferences: ',aggregatePreferences)
    if (group_id) {
      const groupResponse = await pool.query(
        `SELECT * FROM groups WHERE id = $1`,
        [group_id]
      );
      const users = groupResponse.rows[0].users;
      const preferences = await Promise.all(
        users.map((user) =>
          pool.query(`SELECT * FROM preferences WHERE user_id = $1`, [user.id])
        )
      );
      // Aggregate the preferences
      aggregatePreferences = preferences.reduce((aggregate, current) => {
        if (!current.data) {
          // Skip this user if they have not defined preferences
          return aggregate;
        }

        // For price range and max distance, find the maximum value that is less than or equal to the lowest maximum value
        aggregate.max_price_range = Math.min(
          aggregate.max_price_range || Infinity,
          current.data.max_price_range
        );
        aggregate.max_distance = Math.min(
          aggregate.max_distance || Infinity,
          current.data.max_distance
        );

        // For meat preference, check if a restaurant offers vegetarian/vegan options if a user prefers it
        if (
          current.data.meat_preference === "Vegetarian" ||
          current.data.meat_preference === "Vegan"
        ) {
          aggregate.meat_preference = "Vegetarian/Vegan";
        }

        // For cuisine types, use distinct items
        aggregate.cuisine_types = [
          ...new Set([
            ...(aggregate.cuisine_types || []),
            ...current.data.cuisine_types,
          ]),
        ];

        // For open now, calculate based on their local time vs the days/hours listed in the database
        aggregate.open_now = aggregate.open_now && current.data.open_now;

        // For accepts large parties, default to true
        aggregate.accepts_large_parties =
          aggregate.accepts_large_parties && current.data.accepts_large_parties;

        return aggregate;
      }, {});
    }

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
    console.log("parsed preferences:", parsedPreferences);
    const city = parsedPreferences.city || "";
    const state = parsedPreferences.state || "";
    console.log(`city: ${city}, state: ${state}`);
    const location = await normalizeLocation(city, state);
    const userLocationString = `${location.city}, ${location.state}`;

    const { whereClause, values } = await buildWhereClause(
      parsedPreferences,
      userLocationString
    );

    console.log(whereClause);

    const query = `
    SELECT DISTINCT id, name, rating, price_level, location_string, address, latitude, longitude
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
