import express from 'express';
import dotenv from 'dotenv';
import sessionMiddleware from './modules/session-middleware.js';
import passport from './strategies/user.strategy.js';
import userRouter from './routes/user.router.js';
import testingRouter from './routes/testing.router.js';
import formRouter from './routes/preferences_form.router.js';
import userPrefsRouter from './routes/userPreferences.router.js';
import restaurantsRouter from './routes/restaurants.router.js';
import groupsRouter from './routes/groups.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

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
app.use('/api/groups/', groupsRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

export default app;
