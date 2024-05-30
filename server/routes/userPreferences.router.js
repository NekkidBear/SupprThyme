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
        up.cuisine_types,
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

    res.json({ ...userPreferences, allergens });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).send("Error fetching user preferences");
  } finally {
    client.release();
  }
});

/**
 * POST routes
 */
router.post("/:id", async (req, res) => {
  const client = await pool.connect();
  console.log(req.body);
  try {
    await client.query("BEGIN");

    const {
      user_id = null,
      max_price_range = null,
      meat_preference = null,
      religious_restrictions = null,
      allergens = [],
      cuisine_types = [],
      max_distance = 0,
      open_now = true,
      accepts_large_parties = true,
    } = req.body;

    console.log(
      user_id,
      max_price_range,
      meat_preference,
      religious_restrictions,
      allergens,
      cuisine_types,
      max_distance,
      open_now,
      accepts_large_parties
    );

    const userPreferencesSqlText = `
      INSERT INTO "user_preferences" (
        user_id,
        max_price_range,
        meat_preference,
        religious_restrictions,
        cuisine_types,
        max_distance,
        open_now,
        accepts_large_parties
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const userPreferencesValues = [
      user_id,
      max_price_range,
      meat_preference,
      religious_restrictions,
      cuisine_types,
      max_distance,
      open_now,
      accepts_large_parties,
    ];

    await client.query(userPreferencesSqlText, userPreferencesValues);

    if (allergens && allergens.length > 0) {
      const allergensSqlText = `
        INSERT INTO "user_allergens" (user_id, allergen_id)
        VALUES ($1, $2)
      `;

      const allergensValues = allergens.map((allergen_id) => [
        user_id,
        allergen_id,
      ]);

      const allergenQueries = allergensValues.map((values) =>
        client.query(allergensSqlText, values)
      );

      await Promise.all(allergenQueries);
    }

    await client.query("COMMIT");
    res.sendStatus(201);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating user preferences:", error);
    res.status(500).send("Error updating user preferences");
  } finally {
    client.release();
  }
});

/**
 * PUT routes
 */

router.put("/:userId", async (req, res) => {
  const userId = req.params.userId;
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

    console.log(req.body);
    
    const userPreferencesSqlText = `
      UPDATE "user_preferences"
      SET
        max_price_range = $1,
        meat_preference = $2,
        religious_restrictions = $3,
        cuisine_types = $4,
        max_distance = $5,
        open_now = $6,
        accepts_large_parties = $7
      WHERE user_id = $8
    `;

    const userPreferencesValues = [
      max_price_range,
      meat_preference,
      religious_restrictions,
      cuisine_types,
      max_distance,
      open_now,
      accepts_large_parties,
      userId,
    ];
    console.log(userPreferencesValues);
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

      const allergensValues = allergens
        .filter((allergen) => allergen && allergen.id !== null)
        .map((allergen) => [userId, allergen.id]);

      if (allergensValues.length !== allergens.length) {
        console.error(
          `Skipping null or invalid allergenId for userId ${userId}`
        );
      }

      const allergenQueries = allergensValues.map((values) =>
        client.query(allergensSqlText, values)
      );

      await Promise.all(allergenQueries);
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
