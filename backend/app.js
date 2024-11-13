const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

const app = express();

// Initialize passport
require('./auth/auth');
app.use(passport.initialize());

// Import Routes
const login = require('./routes/login');
const loggedInPage = require('./routes/loggedInUser');
const bookingRoute = require('./routes/routeSelection');
const registerRouter = require('./routes/register');
const getAllSeatsRoute = require('./routes/getAllSeats');
const bookSeatRoute = require('./routes/bookSeat');
const cancelSeatRoute = require('./routes/cancelSeat');

// Database Config
const keys = require('./config/keys');
mongoose.connect(keys.MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Database connection error:", err));

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
app.use('/register', registerRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), loggedInPage);
app.use('/api/seats', getAllSeatsRoute);
app.use('/api/seats/book', bookSeatRoute);
app.use('/api/seats/cancel', cancelSeatRoute);

module.exports = app;
