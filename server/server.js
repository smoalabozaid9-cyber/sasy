const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Exit process with failure
    });

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('LegalTech SaaS API is running');
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
