const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat'); // Import your Seat model

// POST /api/seats/cancel/:seatNumber
const cancelSeat = async (req, res) => {
    const { seatNumber } = req.params;
    const cancelingUser = req.user ? req.user._id : null;

    if (!cancelingUser) {
        return res.status(400).json({ error: 'User not authenticated' });
    }

    try {
        // Find the seat to check if it's booked by the current user
        const seat = await Seat.findOne({ seatNumber });

        if (!seat) {
            return res.status(404).json({ error: 'Seat not found' });
        }

        if (seat.bookedBy && seat.bookedBy.toString() !== cancelingUser.toString()) {
            return res.status(403).json({ error: 'Unauthorized to cancel this booking' });
        }

        // Update the seat to cancel the booking
        seat.isBooked = false;
        seat.bookedBy = null;
        seat.bookingDate = null;
        await seat.save();

        res.status(200).json({ message: 'Seat booking canceled', seat });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};

router.post('/api/seats/cancel/:seatNumber', cancelSeat);

module.exports = router;
