const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);
