require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json()); 

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
const authRoutes = require('./routes/auth.js');
const studentRoutes = require('./routes/student.js');
const facultyRoutes = require('./routes/faculty.js');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
