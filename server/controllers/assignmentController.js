const Assignment = require('../models/Assignment');
const path = require('path');

// @desc    Upload new assignment
// @route   POST /api/assignments/upload
// @access  Private/Admin
const uploadAssignment = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please provide title, description and category' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Determine fileType
    const ext = path.extname(req.file.originalname).toLowerCase();
    let fileType;
    if (ext === '.pdf') fileType = 'PDF';
    else if (ext === '.docx') fileType = 'DOCX';
    else if (ext === '.png') fileType = 'PNG';
    else if (ext === '.jpg') fileType = 'JPG';
    else if (ext === '.jpeg') fileType = 'JPEG';
    else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    // File URL (relative path for serving, client can prefix with base URL)
    const fileUrl = `/uploads/${req.file.filename}`;

    const assignment = await Assignment.create({
      title,
      description,
      category,
      fileUrl,
      fileType,
      uploadedBy: req.user._id,
    });

    // Populate uploadedBy with name
    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('uploadedBy', 'name email');

    // Get socket io instance from app
    const io = req.app.get('io');
    if (io) {
      // Broadcast to all connected clients
      io.emit('assignmentUploaded', populatedAssignment);
    }

    res.status(201).json(populatedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments and summary statistics
// @route   GET /api/assignments
// @access  Private (Admin & Student)
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({})
      .populate('uploadedBy', 'name email')
      .sort({ uploadDate: -1 });

    // Calculate stats
    const stats = {
      total: assignments.length,
      pdf: assignments.filter(a => a.fileType === 'PDF').length,
      docx: assignments.filter(a => a.fileType === 'DOCX').length,
      image: assignments.filter(a => ['PNG', 'JPG', 'JPEG'].includes(a.fileType)).length,
    };

    res.json({
      assignments,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stats only
// @route   GET /api/assignments/stats
// @access  Private
const getAssignmentStats = async (req, res) => {
  try {
    const assignments = await Assignment.find({});
    const stats = {
      total: assignments.length,
      pdf: assignments.filter(a => a.fileType === 'PDF').length,
      docx: assignments.filter(a => a.fileType === 'DOCX').length,
      image: assignments.filter(a => ['PNG', 'JPG', 'JPEG'].includes(a.fileType)).length,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadAssignment,
  getAssignments,
  getAssignmentStats,
};
