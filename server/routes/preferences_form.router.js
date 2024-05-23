const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

/**
 * GET route template
 */
router.get("/", (req, res) => {
  // GET route code here
});
//Price Ranges
router.get("/price-ranges", (req, res) => {
  sqlText = `
    SELECT * FROM "price_ranges"
    `;
  pool
    .query(sqlText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.error("Error fetching Price Ranges", error);
    });
});

//Meat Preference
router.get("/meat-preferences", (req, res) => {
  sqlText = `
    SELECT * FROM "meat_preferences"
    `;
  pool
    .query(sqlText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.error("Error fetching Meat Preference", error);
    });
});

//religious restriction options
router.get("/religious-options", (req, res) => {
  sqlText = `
    SELECT * FROM "religious_restrictions"
    `;
  pool
    .query(sqlText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.error("Error fetching Religious options", error);
    });
});

//allergen options
router.get("/allergen-options", (req, res) => {
  sqlText = `
    SELECT * FROM "allergens"
    `;
  pool
    .query(sqlText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.error("Error fetching allergens list", error);
    });
});

//cuisine options
router.get("/cuisine-options", (req, res) => {
  sqlText = `
    SELECT * FROM "cuisine_types"
    `;
  pool
    .query(sqlText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.error("Error fetching cuisines", error);
    });
});

/**
 * POST route template
 */
router.post('/', async (req, res) => {
  try {
    const {
      maxPriceRangeId,
      meatPreferenceId,
      religiousRestrictionsId,
      allergenIds,
      cuisineTypeIds,
      maxDistance,
      openNow,
      acceptsLargeParties,
      isMiles,
    } = req.body;

    const userId = req.user.id; 

    const query = `
      INSERT INTO "user_preferences" (
        "user_id",
        "max_price_range",
        "meat_preference",
        "religious_restrictions",
        "allergens",
        "cuisine_types",
        "max_distance",
        "open_now",
        "accepts_large_parties"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    const values = [
      userId,
      maxPriceRangeId,
      meatPreferenceId,
      religiousRestrictionsId,
      allergenIds,
      cuisineTypeIds,
      maxDistance,
      openNow,
      acceptsLargeParties,
    ];

    await pool.query(query, values);

    res.sendStatus(201); // Created
  } catch (error) {
    console.error('Error inserting user preferences:', error);
    res.sendStatus(500); // Internal Server Error
  }
});

module.exports = router;
