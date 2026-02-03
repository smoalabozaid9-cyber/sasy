const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB Connection Failed:', err);
        process.exit(1);
    });

const resetAdmin = async () => {
    try {
        // Check if admin exists
        const existing = await User.findOne({ email: 'admin@legaltech.com' });
        if (existing) {
            console.log('Deleting existing admin...');
            await User.deleteOne({ email: 'admin@legaltech.com' });
        }

        // Create new admin
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@legaltech.com',
            password: 'password123', // This will be hashed by the pre-save hook
            role: 'admin'
        });

        await adminUser.save();

        console.log('SUCCESS: Admin user created/reset.');
        console.log('Email: admin@legaltech.com');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error('Error resetting admin:', error);
        process.exit(1);
    }
};

resetAdmin();
