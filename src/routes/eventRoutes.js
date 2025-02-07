const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} = require("../controllers/eventController");
const upload = require("../config/multer");

const router = express.Router();

// ✅ Create an event (Protected - Only Authenticated Users)
router.post("/", authMiddleware, upload.single("image"), createEvent);

// ✅ Update event with optional image update
router.put("/:id", authMiddleware, upload.single("image"), updateEvent);

// ✅ Get all events (Public)
router.get("/", getAllEvents);

// ✅ Get event by ID (Public)
router.get("/:id", getEventById);

// ✅ Delete an Event (Protected - Only Event Creator)
router.delete("/:id", authMiddleware, deleteEvent);

// ✅ Route to Join an Event
router.post("/join/:eventId", joinEvent);

// ✅ Route to Leave an Event
router.post("/leave/:eventId", leaveEvent);

module.exports = router;
