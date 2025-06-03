const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const authMiddleware = require('../middleware/auth');

// protect all routes
router.use(authMiddleware);

// create, read, update, delete (CRUD) routes
router.post('/', appController.createApplication);
router.get('/', appController.getApplications);
router.get('/:id', appController.getApplicationById);
router.put('/:id', appController.updateApplication);
router.delete('/:id', appController.deleteApplication);

module.exports = router;
