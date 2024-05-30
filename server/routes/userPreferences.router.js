const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

/**
 * GET routes
 */

//GET single user's preferences
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const client = await pool.connect();

  try {
    // Fetch user preferences
    const userPreferencesQuery = `
      SELECT
        up.id,
        up.user_id,
        pr.range AS max_price_range,
        mp.preference AS meat_preference,
        rr.restriction AS religious_restrictions,
        up.max_distance,
        up.open_now,
        up.accepts_large_parties
      FROM user_preferences up
      LEFT JOIN price_ranges pr ON up.max_price_range = pr.id
      LEFT JOIN meat_preferences mp ON up.meat_preference = mp.id
      LEFT JOIN religious_restrictions rr ON up.religious_restrictions = rr.id
      WHERE up.user_id = $1;
    `;
    const userPreferencesResult = await client.query(userPreferencesQuery, [
      userId,
    ]);
    const userPreferences = userPreferencesResult.rows[0];

    // Fetch user allergens
    const allergenQuery = `
      SELECT a.id, a.allergen
      FROM user_allergens ua
      JOIN allergens a ON ua.allergen_id = a.id
      WHERE ua.user_id = $1;
    `;
    const allergenResult = await client.query(allergenQuery, [userId]);
    const allergens = allergenResult.rows;

    // Fetch user cuisine types
    const cuisineQuery = `
      SELECT ct.id, ct.type
      FROM user_cuisine_types uct
      JOIN cuisine_types ct ON uct.cuisine_type_id = ct.id
      WHERE uct.user_id = $1;
    `;
    const cuisineResult = await client.query(cuisineQuery, [userId]);
    const cuisineTypes = cuisineResult.rows;

    res.json({ ...userPreferences, allergens, cuisineTypes });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).send("Error fetching user preferences");
  } finally {
    client.release();
  }
});

// GET IDs for given human-friendly values
router.get("/ids", async (req, res) => {
  const client = await pool.connect();
  console.log ('req.query is:',req.query)

  
  try {
    const {
      max_price_range,
      meat_preference,
      religious_restrictions,
      allergens,
      cuisine_types,
    } = req.query;

    // Parse the allergens and cuisine_types to arrays of objects
    const allergensArray = JSON.parse(allergens);
    const cuisineTypesArray = JSON.parse(cuisine_types);

    // Extract the IDs from the arrays
    const allergenIds = allergensArray.map(a => a.id);
    const cuisineTypeIds = cuisineTypesArray.map(ct => ct.id);

    // Query the database for the other IDs
    const priceRangeId = await getIdFromValue('price_ranges', 'range', max_price_range, client);
    const meatPreferenceId = await getIdFromValue('meat_preferences', 'preference', meat_preference, client);
    const religiousRestrictionsId = await getIdFromValue('religious_restrictions', 'restriction', religious_restrictions, client);

    // Return the IDs in the response
    res.json({
      max_price_range: priceRangeId,
      meat_preference: meatPreferenceId,
      religious_restrictions: religiousRestrictionsId,
      allergens: allergenIds,
      cuisine_types: cuisineTypeIds,
    });
  } catch (error) {
    console.error("Error fetching IDs:", error);
    res.status(500).send("Error fetching IDs");
  } finally {
    client.release();
  }
});

// Helper function to get ID from a single value
async function getIdFromValue(table, column, value, client) {
  const query = `SELECT id FROM ${table} WHERE ${column} = $1`;
  const result = await client.query(query, [value]);
  return result.rows[0]?.id || null;
}

/**
 * POST routes
 */
router.put("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).send("Invalid user ID");
  }
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      max_price_range = null,
      meat_preference = null,
      religious_restrictions = null,
      allergens = [],
      cuisine_types = [],
      max_distance = 0,
      open_now = true,
      accepts_large_parties = true,
    } = req.body;
    const max_distance_int = parseInt(max_distance, 10);
    if (isNaN(max_distance_int)) {
      return res.status(400).send("Invalid max distance");
    }

    const userPreferencesSqlText = `
      UPDATE "user_preferences"
      SET
        max_price_range = $1,
        meat_preference = $2,
        religious_restrictions = $3,
        max_distance = $4,
        open_now = $5,
        accepts_large_parties = $6
      WHERE user_id = $7
    `;

    const userPreferencesValues = [
      max_price_range,
      meat_preference,
      religious_restrictions,
      max_distance_int,
      open_now,
      accepts_large_parties,
      userId,
    ];

    await client.query(userPreferencesSqlText, userPreferencesValues);

    if (allergens && allergens.length > 0) {
      const deleteAllergensSqlText = `
        DELETE FROM "user_allergens"
        WHERE user_id = $1
      `;

      await client.query(deleteAllergensSqlText, [userId]);

      const allergensSqlText = `
        INSERT INTO "user_allergens" (user_id, allergen_id)
        VALUES ($1, $2)
      `;

      const allergensValues = allergens.map((allergen_id) => [
        userId,
        allergen_id,
      ]);

      const allergenQueries = allergensValues.map((values) =>
        client.query(allergensSqlText, values)
      );

      await Promise.all(allergenQueries);
    }

    if (cuisine_types && cuisine_types.length > 0) {
      const deleteCuisineSqlText = `
        DELETE FROM "user_cuisine_types"
        WHERE user_id = $1
      `;

      await client.query(deleteCuisineSqlText, [userId]);

      const cuisineSqlText = `
        INSERT INTO "user_cuisine_types" (user_id, cuisine_type_id)
        VALUES ($1, $2)
      `;

      const cuisineValues = cuisine_types.map((cuisine_type_id) => [
        userId,
        cuisine_type_id,
      ]);

      const cuisineQueries = cuisineValues.map((values) =>
        client.query(cuisineSqlText, values)
      );

      await Promise.all(cuisineQueries);
    }

    await client.query("COMMIT");
    res.sendStatus(200);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating user preferences:", error);
    res.status(500).send("Error updating user preferences");
  } finally {
    client.release();
  }
});

module.exports = router;
