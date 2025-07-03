const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authenticate = require('../middleware/auth');

router.post('/generate', authenticate, resumeController.generateResume);

module.exports = router;
