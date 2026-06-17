const express = require('express');
const router = express.Router();
const {
  uploadAssignment,
  getAssignments,
  getAssignmentStats,
} = require('../controllers/assignmentController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, admin, upload.single('file'), uploadAssignment);
router.get('/', protect, getAssignments);
router.get('/stats', protect, getAssignmentStats);

module.exports = router;
