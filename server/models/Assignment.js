const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,          // faculty uploads question file
  dueDate: Date,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  // Use the unified User model for both faculty and student references
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      fileUrl: String,
      submittedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Assignment', assignmentSchema);
