const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { v4: uuidv4 } = require('uuid');

// Create new session
router.post('/create', async (req, res) => {
  try {
    const sessionId = uuidv4();
    const session = new Session({
      sessionId,
      createdBy: req.body.userId,
      name: req.body.name || `Session ${sessionId.slice(0, 8)}`,
      diagramData: {
        classes: {},
        relationships: {}
      }
    });

    await session.save();
    res.json({ sessionId: session.sessionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all sessions for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { createdBy: req.params.userId },
        { participants: req.params.userId }
      ]
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join session
router.post('/join', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.body.sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (!session.participants.includes(req.body.userId)) {
      session.participants.push(req.body.userId);
      await session.save();
    }

    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route to your existing session.js file
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
