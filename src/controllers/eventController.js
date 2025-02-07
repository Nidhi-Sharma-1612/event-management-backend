const asyncHandler = require("express-async-handler");
const Event = require("../models/Event");
const socket = require("../socket");
const cloudinary = require("../config/cloudinary");

const createEvent = asyncHandler(async (req, res) => {
  try {
    const { title, description, date, location, category } = req.body;
    let imageUrl = "";

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.file) {
      imageUrl = req.file.path; // ✅ Save Cloudinary image URL
    }

    const event = new Event({
      title,
      description,
      date,
      location,
      category,
      image: imageUrl,
      createdBy: req.user.userId, // ✅ Assign logged-in user's ID
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("❌ Error creating event:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Update Event (Only event creator can update)
const updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, category } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Check if the user is the creator
    if (event.createdBy.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this event" });
    }

    // ✅ Delete old image from Cloudinary if new image is uploaded
    if (req.file && event.image) {
      try {
        const publicId = event.image.split("/").pop().split(".")[0]; // Extract public ID
        await cloudinary.uploader.destroy(`event_images/${publicId}`);
      } catch (error) {
        console.error("❌ Cloudinary Delete Error:", error);
      }
    }

    // ✅ Upload new image if provided
    if (req.file) {
      event.image = req.file.path; // ✅ Get new Cloudinary image URL
    }

    // ✅ Update other event details
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;

    await event.save();
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("❌ Error updating event:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get all events (Filter based on user authentication)
const getAllEvents = asyncHandler(async (req, res) => {
  try {
    let filter = {};

    if (req.user) {
      // ✅ If an authenticated user is logged in, fetch only **their events**
      filter.createdBy = req.user._id;
    }

    // ✅ Apply filters if category or date is provided
    const { category, date } = req.query;

    if (category) {
      filter.category = category;
    }
    if (date) {
      filter.date = { $gte: new Date(date) };
    }

    const events = await Event.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get a single event by ID
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
});

const deleteEvent = asyncHandler(async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.createdBy) {
      console.error("❌ Event 'createdBy' field is missing");
      return res
        .status(400)
        .json({ message: "Invalid event data. No creator found." });
    }

    if (!req.user || event.createdBy.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this event" });
    }

    // ✅ Delete event image from Cloudinary (if exists)
    if (event.image) {
      try {
        const publicId = event.image.split("/").pop().split(".")[0]; // Extract public ID
        await cloudinary.uploader.destroy(`event_images/${publicId}`);
      } catch (err) {
        console.error("❌ Cloudinary Image Deletion Error:", err);
      }
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("❌ Error Deleting Event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // ✅ Find event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // ✅ Increment attendees count
    event.attendees = (event.attendees || 0) + 1;
    await event.save();

    // ✅ Emit real-time update via WebSocket
    const io = socket.getIO(); // ✅ Ensure WebSocket is initialized
    io.emit("updateAttendees", {
      eventId: event._id,
      attendees: event.attendees,
    });

    return res.status(200).json({
      message: "Joined successfully",
      attendees: event.attendees,
    });
  } catch (error) {
    console.error("❌ Error joining event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const leaveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.attendees > 0) {
      event.attendees -= 1;
      await event.save();

      // ✅ Emit real-time update
      const io = socket.getIO();
      io.emit("updateAttendees", {
        eventId: event._id,
        attendees: event.attendees,
      });
    }

    res.json({ message: "Left event", attendees: event.attendees });
  } catch (error) {
    console.error("❌ Error leaving event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
};
