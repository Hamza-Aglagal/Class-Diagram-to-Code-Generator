const socketIO = require('socket.io');
const Session = require('./models/Session');

function initializeSocketServer(server) {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Event when a client joins a session
    socket.on('joinSession', async (sessionId) => {
      console.log(`Socket ${socket.id} joining session ${sessionId}`);
      socket.join(sessionId);

      // Load session data from database
      try {
        const session = await Session.findOne({ sessionId });
        if (session && session.diagramData) {
          socket.emit('initializeSession', session.diagramData);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    });

    // Event for receiving diagram updates from clients
    socket.on('diagramUpdate', async ({ sessionId, action, data }) => {
      try {
        // Broadcast the update to other clients in the session
        socket.to(sessionId).emit('diagramUpdated', { action, data });

        // Optionally, save the update to the database
        // You can implement this based on your requirements
      } catch (error) {
        console.error('Error in diagramUpdate:', error);
      }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = initializeSocketServer;
