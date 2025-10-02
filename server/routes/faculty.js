const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Grade = require("../models/Grade");
const Timetable = require("../models/Timetable");
const Course = require("../models/Course");
const auth = require("../middleware/auth");

// Middleware: only allow faculty
function facultyOnly(req, res, next) {
  if (req.user.role !== "faculty") {
    return res.status(403).json({ msg: "Access denied: Faculty only" });
  }
  next();
}

// ✅ Get all courses taught by this faculty
router.get("/courses", auth, facultyOnly, async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user.id }).populate("students", "name email");
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Mark Attendance (course-based)
router.post("/attendance", auth, facultyOnly, async (req, res) => {
  try {
    const { courseId, studentId, date, status } = req.body;

    const course = await Course.findOne({ _id: courseId, faculty: req.user.id });
    if (!course) return res.status(403).json({ msg: "Not authorized for this course" });

    const attendance = new Attendance({
      course: courseId,
      student: studentId,
      date,
      status
    });

    await attendance.save();
    res.json({ msg: "Attendance marked", attendance });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Upload Grade
router.post("/grades", auth, facultyOnly, async (req, res) => {
  try {
    const { courseId, studentId, marks, maxMarks } = req.body;

    const course = await Course.findOne({ _id: courseId, faculty: req.user.id });
    if (!course) return res.status(403).json({ msg: "Not authorized" });

    const grade = new Grade({ course: courseId, student: studentId, marks, maxMarks });
    await grade.save();

    res.json({ msg: "Grade uploaded", grade });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Add Timetable entry for a course
router.post("/timetable", auth, facultyOnly, async (req, res) => {
  try {
    const { courseId, day, subject, startTime, endTime } = req.body;

    const course = await Course.findOne({ _id: courseId, faculty: req.user.id });
    if (!course) return res.status(403).json({ msg: "Not authorized" });

    const timetable = new Timetable({
      course: courseId,
      day,
      subject,
      startTime,
      endTime
    });

    await timetable.save();
    res.json({ msg: "Timetable entry added", timetable });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
