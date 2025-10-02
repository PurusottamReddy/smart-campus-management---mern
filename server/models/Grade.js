const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  marks: { type: Number, required: true },
  maxMarks: { type: Number, required: true }
});


module.exports = mongoose.model("Grade", gradeSchema);
