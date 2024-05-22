const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      user_id,
      max_price_range,
      meat_preference,
      religious_restrictions,
      allergens,
      cuisine_types,
      max_distance,
      open_now,
      acceptsLargeParties,
    } = req.body;

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
      acceptsLargeParties,
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

module.exports = router;