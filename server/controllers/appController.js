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

// fetch all applications for a user
exports.getApplications = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id });
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get applications' });
  }
};

// get a single application by id
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, user: req.user.id });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json(app);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get application' });
  }
};

// update an application
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
