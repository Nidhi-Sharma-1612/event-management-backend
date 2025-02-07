const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

// Book an Event
router.post("/", async (req, res) => {
  try {
    const { event, user } = req.body;
    const booking = new Booking({ event, user });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Bookings
router.get("/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate(
      "event"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
