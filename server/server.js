const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const initializeSocketServer = require('./socketServer');
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/session');

const app = express();
const server = http.createServer(app);
const io = initializeSocketServer(server);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());    

// Routes
app.use('/', authRoutes);
app.use('/api/session', sessionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message 
  });
});

// mongoose.connect('mongodb://127.0.0.1:27017/uml-editor', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

mongoose.connect('mongodb://127.0.0.1:27017/uml-editor')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
