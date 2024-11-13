// auth.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Local Strategy for Login
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user, { message: 'Login successful' });
    } catch (error) {
        return done(error);
    }
}));

// JWT Strategy for Protected Routes
const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Use Authorization header
    secretOrKey: 'top_secret', // Ensure this matches your JWT signing key
};

passport.use('jwt', new JWTStrategy(opts, async (jwt_payload, done) => {
    try {
        // Optionally, you can verify if the user still exists or is active
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));
