const express = require('express');
const passport = require('passport');
const router = express.Router();
const Seat = require('../models/Seat'); // Import your Seat model

// POST /api/seats/book/:seatNumber - Protected route to book a seat
const bookSeat = async (req, res) => {
    const { seatNumber } = req.params;
    const bookedBy = req.user ? req.user._id : null; // Use user ID from req.user, set by passport JWT strategy

    if (!bookedBy) {
        return res.status(400).json({ error: 'User not authenticated' });
    }

    try {
        // Find the seat and update its booking status
        const seat = await Seat.findOneAndUpdate(
            { seatNumber },
            { isBooked: true, bookedBy, bookingDate: new Date() },
            { new: true }
        );

        if (!seat) {
            return res.status(404).json({ error: 'Seat not found' });
        }

        // Successfully booked the seat
        res.status(200).json({ message: 'Seat booked successfully', seat });
    } catch (error) {
        // Handle errors
        console.error('Error booking seat:', error);
        res.status(500).json({ error: 'Failed to book seat' });
    }
};

// Protect the route with JWT authentication using passport.authenticate
router.post('/api/seats/book/:seatNumber', passport.authenticate('jwt', { session: false }), bookSeat);

module.exports = router;
