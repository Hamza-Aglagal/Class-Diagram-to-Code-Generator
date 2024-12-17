const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  diagramData: {
    classes: {
      byId: { type: Object, default: {} },
      allIds: [String]
    },
    relationships: {
      byId: { type: Object, default: {} },
      allIds: [String]
    }
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: { type: Date, default: Date.now }
}, {
  // This ensures Mongoose doesn't try to enforce strict schema on diagramData
  strict: false
});

module.exports = mongoose.model('Session', sessionSchema);
