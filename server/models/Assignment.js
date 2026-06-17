const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Programming', 'Web Development', 'Database', 'Aptitude', 'Other'],
  },
  fileUrl: {
    type: String,
    required: [true, 'File upload is required'],
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['PDF', 'DOCX', 'PNG', 'JPG', 'JPEG'],
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
