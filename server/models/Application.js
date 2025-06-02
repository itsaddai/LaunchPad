const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Ghosted'],
    default: 'Applied'
  },
  dateApplied: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Application', applicationSchema);
