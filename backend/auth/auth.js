const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

// Local Strategy for Login
passport.use('login', new localStrategy({
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
passport.use(new JWTstrategy({
    secretOrKey: 'top_secret',  // Replace with your secret key
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // Extract JWT from Authorization header
}, async (token, done) => {
    try {
        // Pass the decoded token user to the next middleware
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));
