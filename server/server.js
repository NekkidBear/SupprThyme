const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
const testingRouter = require('./routes/testing.router');
const formRouter = require('./routes/preferences_form.router');
const userPrefsRouter = require('./routes/userPreferences.router');
const restaurantsRouter = require('./routes/restaurants.router');
const groupsRouter = require('./routes/groups.router.js');
const votesRouter = require('./routes/votes.router'); // Add this line

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);
app.use('/api/test', testingRouter);
app.use('/api/form_data', formRouter);
app.use('/api/user_preferences', userPrefsRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/votes', votesRouter); // Add this line

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
