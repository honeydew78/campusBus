const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

const app = express();

// Login and Register
require('./auth/auth');
const login = require('./routes/login');
const loggedInPage = require('./routes/loggedInUser');
const bookingRoute = require('./routes/routeSelection');
const registerRouter = require('./routes/register');

// Import individual seat management routes
const getAllSeatsRoute = require('./routes/getAllSeats');
const bookSeatRoute = require('./routes/bookSeat');
const cancelSeatRoute = require('./routes/cancelSeat');

// DB Config
const DB_URL = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        throw err;
    });

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Routes
app.use('/', login);
app.use('/booking', bookingRoute);
app.use('/register', registerRouter);  // To register page
app.use('/user', passport.authenticate('jwt', { session: false }), loggedInPage);  // Secure Route

// Direct Seat Management Routes
app.use('/api/seats', passport.authenticate('jwt', { session: false }), getAllSeatsRoute);  // GET all seats
app.use('/api/seats/book', passport.authenticate('jwt', { session: false }), bookSeatRoute);  // POST book seat
app.use('/api/seats/cancel', passport.authenticate('jwt', { session: false }), cancelSeatRoute);  // POST cancel booking

module.exports = app;
