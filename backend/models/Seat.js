const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true, unique: true },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: String, default: null }, // User ID or name
  bookingDate: { type: Date, default: null }
});

const Seat = mongoose.model('Seat', seatSchema);
module.exports = Seat;
