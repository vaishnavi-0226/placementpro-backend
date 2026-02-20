const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());            // allow frontend to connect
app.use(express.json());    // read JSON body

// =======================
// Routes
// =======================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/jobs', require('./routes/jobs'));   // ✅ VERY IMPORTANT (your route)

// =======================
// Connect to MongoDB & Start Server
// =======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ DB Error:', err));
  app.get('/test', (req, res) => {
  res.send('Working');
});