const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat'); // Import your Seat model

// POST /api/seats/book - Route to book a seat without authentication
const bookSeat = async (req, res) => {
    const { seatNumber } = req.body; // Get seatNumber from request body
    const bookedBy = req.body.bookedBy || 'Anonymous'; // Use user ID from request body or default to 'Anonymous'

    try {
        // Find the seat and update its booking status
        const seat = await Seat.findOneAndUpdate(
            { seatNumber, isBooked: false }, // Ensure the seat is not already booked
            { isBooked: true, bookedBy, bookingDate: new Date() },
            { new: true }
        );

        if (!seat) {
            return res.status(404).json({ error: 'Seat not found or already booked' });
        }

        // Successfully booked the seat
        res.status(200).json({ message: 'Seat booked successfully', seat });
    } catch (error) {
        // Handle errors
        console.error('Error booking seat:', error);
        res.status(500).json({ error: 'Failed to book seat' });
    }
};

// Route without authentication
router.post('/api/seats/book', bookSeat);

module.exports = router;
