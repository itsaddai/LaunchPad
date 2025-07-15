const express = require('express');
const router = express.Router(); // <-- YOU MISSED THIS LINE

const appController = require('../controllers/appController');
const authMiddleware = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// CRUD routes
router.post('/', appController.createApplication);
router.get('/', appController.getApplications);
router.get('/:id', appController.getApplicationById);
router.put('/:id', appController.updateApplication);
router.delete('/:id', appController.deleteApplication);
router.delete('/', appController.deleteAllApplications);

// TODO: Add sankeymatic stats route here if needed

module.exports = router;
