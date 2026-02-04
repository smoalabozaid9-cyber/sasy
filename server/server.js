const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
// Middleware
app.use(cors({
    origin: '*', // For debugging, allow all. In production, set this to the Vercel Client URL
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
let dbError = null;
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        dbError = err.message;
        // process.exit(1); // Don't exit on Vercel, let us see the error
    });

// Routes Placeholder
app.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.status(200).json({
        message: 'LegalTech SaaS API is running',
        dbStatus: dbStatus,
        dbError: dbError, // Show the error if any
        envCheck: process.env.MONGO_URI ? 'MONGO_URI is set' : 'MONGO_URI is MISSING',
        timestamp: new Date().toISOString()
    });
});

// Import Routes
const authRoutes = require('./routes/auth');
const lawyerRoutes = require('./routes/lawyers');
const caseRoutes = require('./routes/cases');
const sessionRoutes = require('./routes/sessions');

app.use('/api/auth', authRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/sessions', sessionRoutes);

const PORT = process.env.PORT || 5000;

// Export the app for Vercel
module.exports = app;

// Only listen if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
