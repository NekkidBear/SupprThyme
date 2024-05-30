const pool = require("../server/modules/pool.js");

async function insertUserPreferences() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("Transaction started");

    // Insert user preferences
    const userPreferencesSqlText = `
  INSERT INTO "user_preferences" ("user_id", "max_price_range", "meat_preference", "religious_restrictions", "max_distance", "open_now", "accepts_large_parties")
  VALUES ($1, $2, $3, $4, $5, $6, $7), ($8, $9, $10, $11, $12, $13, $14), ($15, $16, $17, $18, $19, $20, $21), ($22, $23, $24, $25, $26, $27, $28);
`;

    const userPreferencesValues = [
      1,
      1,
      1,
      1,
      5,
      true,
      true,
      2,
      2,
      2,
      2,
      10,
      true,
      true,
      3,
      3,
      3,
      3,
      15,
      true,
      true,
      4,
      4,
      3,
      3,
      20,
      true,
      true,
    ];

    await client.query(userPreferencesSqlText, userPreferencesValues);
    console.log("User preferences inserted");
    // Insert user allergens
    const allergens = [
      { userId: 1, allergenIds: [1, 2] },
      { userId: 2, allergenIds: [3, 4] },
      { userId: 3, allergenIds: [5, 6] },
      { userId: 4, allergenIds: [7, 8, 9] },
    ];

    for (const { userId, allergenIds } of allergens) {
      for (const allergenId of allergenIds) {
        await client.query(
          `
          INSERT INTO "user_allergens" ("user_id", "allergen_id")
          VALUES ($1, $2);
        `,
          [userId, allergenId]
        );
      }
    }

    // Insert user cuisine types
    const cuisineTypes = [
      { userId: 1, cuisineTypeIds: [1, 2] },
      { userId: 2, cuisineTypeIds: [3, 4] },
      { userId: 3, cuisineTypeIds: [5, 6] },
      { userId: 4, cuisineTypeIds: [1, 3, 5] },
    ];

    for (const { userId, cuisineTypeIds } of cuisineTypes) {
      for (const cuisineTypeId of cuisineTypeIds) {
        await client.query(
          `
      INSERT INTO "user_cuisine_types" ("user_id", "cuisine_type_id")
      VALUES ($1, $2);
    `,
          [userId, cuisineTypeId]
        );
      }
    }

    console.log("User cuisine types inserted");

    console.log("User allergens inserted");

    await client.query("COMMIT");
    console.log("Transaction committed");

    console.log("Successfully inserted user preferences and allergens");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error inserting user preferences and allergens:", err.stack);
  } finally {
    client.release();
  }
}

insertUserPreferences().catch((e) => console.error(e.stack));
module.exports = insertUserPreferences;
