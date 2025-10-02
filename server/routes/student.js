const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Grade = require("../models/Grade");
const Timetable = require("../models/Timetable");
const Course = require("../models/Course");
const auth = require("../middleware/auth");

// ✅ Get courses the student is enrolled in
router.get("/courses", auth, async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user.id })
      .populate("faculty", "name email");
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Get attendance for a course
router.get("/attendance/:courseId", auth, async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id, course: req.params.courseId });
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Get grades for a course
router.get("/grades/:courseId", auth, async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user.id, course: req.params.courseId });
    res.json(grades);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Get timetable for a course
router.get("/timetable/:courseId", auth, async (req, res) => {
  try {
    const timetable = await Timetable.find({ course: req.params.courseId });
    res.json(timetable);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
