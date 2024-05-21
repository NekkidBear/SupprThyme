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
router.post("/", (req, res) => {
  // POST route code here
});

module.exports = router;
