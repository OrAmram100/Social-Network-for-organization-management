const router = require("express").Router();
const Attendance = require("../models/Attendance");

// POST endpoint for creating a new attendance record
router.post("/", async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    const savedAttendance = await attendance.save();
    res.status(201).json(savedAttendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET endpoint for retrieving attendance records for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.params.userId });
    res.status(200).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE endpoint for deleting an attendance record by its id
router.delete("/:id", async (req, res) => {
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!deletedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT endpoint for updating an existing attendance record by its id
router.put("/:id", async (req, res) => {
    try {
      const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedAttendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      res.status(200).json(updatedAttendance);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
