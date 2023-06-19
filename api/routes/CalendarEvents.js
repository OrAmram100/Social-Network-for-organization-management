const router = require("express").Router();
const CalendarEvent = require("../models/calendarEvent");

// POST endpoint for creating a new calendar event
router.post("/events", async (req, res) => {
  try {
    const event = new CalendarEvent(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET endpoint for retrieving all calendar events
router.get("/events/:organizationId", async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const events = await CalendarEvent.find( {organizationId: organizationId});
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT endpoint for updating the title of a calendar event
router.put("/events/:eventId", async (req, res) => {
    try {
      const updatedEvent = await CalendarEvent.findByIdAndUpdate(
        req.params.eventId,
        { title: req.body.title },
        { new: true }
      );
      res.status(200).json(updatedEvent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // DELETE endpoint for deleting a calendar event
router.delete("/events/:eventId", async (req, res) => {
    try {
      await CalendarEvent.findByIdAndDelete(req.params.eventId);
      res.status(200).json({ message: "Event deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
