const Application = require('../models/Application');

// Create a new application
exports.createApplication = async (req, res) => {
  try {
    const { company, position, status, appliedDate, notes } = req.body;
    const newApp = new Application({
      user: req.user.id,
      company,
      position,
      status,
      appliedDate,
      notes
    });
    await newApp.save();
    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create application', error: error.message });
  }
};

// Get all applications for a user
exports.getApplications = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id });
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get applications' });
  }
};

// Update an application
exports.updateApplication = async (req, res) => {
  try {
    const updated = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update application' });
  }
};

// Delete an application
exports.deleteApplication = async (req, res) => {
  try {
    await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.status(200).json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete application' });
  }
};
