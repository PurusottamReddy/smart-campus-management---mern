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
    console.log("Faculty courses request - User ID:", req.user.id);
    console.log("Faculty courses request - User role:", req.user.role);

    const courses = await Course.find({ faculty: req.user.id }).populate("students", "name email");
    console.log("Found courses:", courses.length, courses);

    res.json(courses);
  } catch (err) {
    console.error("Error in faculty courses endpoint:", err.message);
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

// ✅ Upload Note (faculty only)
router.post("/upload-note", auth, facultyOnly, upload.single("file"), async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      description: req.body.description,
      fileUrl: "/uploads/" + req.file.filename,
      course: req.body.courseId,
      faculty: req.user.id,
    });
    await note.save();
    res.json({ msg: "Note uploaded successfully", note });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Create Assignment (faculty only)
router.post("/create-assignment", auth, facultyOnly, upload.single("file"), async (req, res) => {
  try {
    const assignment = new Assignment({
      title: req.body.title,
      description: req.body.description,
      fileUrl: "/uploads/" + req.file.filename,
      dueDate: req.body.dueDate,
      faculty: req.user.id,
      course: req.body.courseId,
    });
    await assignment.save();
    res.json({ msg: "Assignment created successfully", assignment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ List notes uploaded by this faculty for a course
router.get("/notes/:courseId", auth, facultyOnly, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, faculty: req.user.id });
    if (!course) return res.status(403).json({ msg: "Not authorized for this course" });

    const notes = await Note.find({ course: req.params.courseId, faculty: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Update a note (title/description only)
router.put("/notes/:id", auth, facultyOnly, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, faculty: req.user.id });
    if (!note) return res.status(404).json({ msg: "Note not found" });

    note.title = req.body.title ?? note.title;
    note.description = req.body.description ?? note.description;
    await note.save();
    res.json({ msg: "Note updated", note });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Delete a note
router.delete("/notes/:id", auth, facultyOnly, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, faculty: req.user.id });
    if (!note) return res.status(404).json({ msg: "Note not found" });
    res.json({ msg: "Note deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Update an assignment (title/description/dueDate)
router.put("/assignments/:id", auth, facultyOnly, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, faculty: req.user.id });
    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });

    assignment.title = req.body.title ?? assignment.title;
    assignment.description = req.body.description ?? assignment.description;
    assignment.dueDate = req.body.dueDate ?? assignment.dueDate;
    await assignment.save();
    res.json({ msg: "Assignment updated", assignment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Delete an assignment
router.delete("/assignments/:id", auth, facultyOnly, async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, faculty: req.user.id });
    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });
    res.json({ msg: "Assignment deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ List grades for a course (that this faculty teaches)
router.get("/grades/:courseId", auth, facultyOnly, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, faculty: req.user.id });
    if (!course) return res.status(403).json({ msg: "Not authorized for this course" });

    const grades = await Grade.find({ course: req.params.courseId }).populate("student", "name email");
    res.json(grades);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Update a grade (marks/maxMarks)
router.put("/grades/:id", auth, facultyOnly, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id).populate("course");
    if (!grade) return res.status(404).json({ msg: "Grade not found" });
    if (String(grade.course.faculty) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Not authorized for this course" });
    }

    grade.marks = req.body.marks ?? grade.marks;
    grade.maxMarks = req.body.maxMarks ?? grade.maxMarks;
    await grade.save();
    res.json({ msg: "Grade updated", grade });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Delete a grade
router.delete("/grades/:id", auth, facultyOnly, async (req, res) => {
  try {
    // Ensure grade belongs to a course taught by this faculty
    const grade = await Grade.findById(req.params.id).populate("course");
    if (!grade) return res.status(404).json({ msg: "Grade not found" });
    if (String(grade.course.faculty) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Not authorized for this course" });
    }

    await Grade.deleteOne({ _id: req.params.id });
    res.json({ msg: "Grade deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Get assignments with submissions for a specific course
router.get("/assignments/:courseId", auth, facultyOnly, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, faculty: req.user.id });
    if (!course) return res.status(403).json({ msg: "Not authorized for this course" });

    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('submissions.student', 'name email');

    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
