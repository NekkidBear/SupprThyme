
const runQuery = require('./runQuery');

async function insertUserPreferences() {
  try {
    // Insert user preferences
    await runQuery(`
      INSERT INTO "user_preferences" ("user_id", "max_price_range", "meat_preference", "religious_restrictions", "cuisine_types", "max_distance", "open_now", "accepts_large_parties", "allergens")
      VALUES
          (1, 1, 1, 1, ARRAY[1, 2], 5, true, true, ARRAY[1, 2]),
          (2, 2, 2, 2, ARRAY[3, 4], 10, true, true, ARRAY[3, 4]),
          (3, 3, 3, 3, ARRAY[5, 6], 15, true, true, ARRAY[5, 6]),
          (4, 4, 4, 4, ARRAY[1, 3, 5], 20, true, true, ARRAY[7, 8, 9]);
    `);

    console.log('Successfully inserted user preferences');
  } catch (err) {
    console.error('Error inserting user preferences:', err.stack);
  }
}

module.exports = insertUserPreferences;