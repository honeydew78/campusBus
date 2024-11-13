const express = require('express');
const passport = require('passport');
const router = express.Router();
const Seat = require('../models/Seat'); // Import your Seat model

// GET /api/seats - Protected route
const getAllSeats = async (req, res) => {
    try {
        const seats = await Seat.find({});
        
        if (!seats || seats.length === 0) {
            return res.status(404).json({ message: 'No seats found' });
        }
        
        res.status(200).json(seats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch seats' });
    }
};

// Protect the route with JWT authentication
router.get('/api/seats', passport.authenticate('jwt', { session: false }), getAllSeats);

module.exports = router;
