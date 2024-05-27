const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// GET route to retrieve user information with address details
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user information with address details using a database query
    const { rows } = await pool.query(
      `
      SELECT "user".id, "user".email, user_addresses.street1, user_addresses.street2, user_addresses.city, user_addresses.state, user_addresses.zip, user_addresses.country
      FROM "user"
      LEFT JOIN user_addresses ON "user".id = user_addresses.user_id
      WHERE "user".id = $1
    `,
      [userId]
    );

    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ message: "Error fetching user information" });
  }
});

// Handles GET request with query parameter for searching users
router.get('/search', (req, res) => {
  const searchTerm = req.query.search;

  pool.query('SELECT * FROM user WHERE name ILIKE $1', [`%${searchTerm}%`])
      .then((result) => {
          res.send(result.rows);
      })
      .catch((error) => {
          console.error('Error completing SELECT user query', error);
          res.sendStatus(500);
      });
});


// POST route to handle user registration and address storage
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, address } = req.body;

    // Insert user details into the 'user' table
    const userResult = await pool.query(
      `
      INSERT INTO "user" (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
      [username, encryptLib.encryptPassword(password), email]
    );

    const userId = userResult.rows[0].id;

    // Insert address details into the 'user_addresses' table
    await pool.query(
      `
      INSERT INTO user_addresses (user_id, street1, street2, city, state, zip, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        userId,
        address.street1,
        address.street2,
        address.city,
        address.state,
        address.zip,
        address.country,
      ]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});
// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post("/logout", (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
});

module.exports = router;
