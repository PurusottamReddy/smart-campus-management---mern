const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Grade = require("../models/Grade");
const Timetable = require("../models/Timetable");
const Course = require("../models/Course");
const auth = require("../middleware/auth");
const Assignment = require("../models/Assignment");
const Note = require("../models/Note");
const upload = require("../middleware/upload");

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

// ✅ Get all notes for student’s enrolled courses
router.get("/notes", auth, async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user.id }).select("_id");
    const notes = await Note.find({ course: { $in: courses } });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Get assignments for student’s courses
router.get("/assignments", auth, async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user.id }).select("_id");
    const assignments = await Assignment.find({ course: { $in: courses } });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Get notes for a specific course the student is enrolled in
router.get("/notes/:courseId", auth, async (req, res) => {
  try {
    const isEnrolled = await Course.exists({ _id: req.params.courseId, students: req.user.id });
    if (!isEnrolled) return res.status(403).json({ msg: "Not enrolled in this course" });

    const notes = await Note.find({ course: req.params.courseId });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Get assignments for a specific course the student is enrolled in
router.get("/assignments/:courseId", auth, async (req, res) => {
  try {
    const isEnrolled = await Course.exists({ _id: req.params.courseId, students: req.user.id });
    if (!isEnrolled) return res.status(403).json({ msg: "Not enrolled in this course" });

    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Submit assignment
router.post("/assignments/:id/submit", auth, upload.single("file"), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });

    assignment.submissions.push({
      student: req.user.id,
      fileUrl: "/uploads/" + req.file.filename,
    });

    await assignment.save();
    res.json({ msg: "Assignment submitted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
