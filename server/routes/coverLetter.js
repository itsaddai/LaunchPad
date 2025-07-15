const express = require('express');
const router = express.Router();
const coverLetter = require('../controllers/coverletterController');
const authenticate = require('../middleware/auth');

router.post('/', authenticate, coverLetter.generateCoverLetter);

module.exports = router;
