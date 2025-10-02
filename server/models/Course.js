const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },       // e.g. "Computer Science 101"
  code: { type: String, required: true, unique: true }, // e.g. "CS101"
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who teaches
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // enrolled students
});

module.exports = mongoose.model("Course", CourseSchema);
