const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'lawyer'],
        default: 'lawyer'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed successfully for:', this.email);
        next();
    } catch (error) {
        next(error);
    }
});

// Match user entered password to hashed password in database
// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    console.log('Checking password for:', this.email);
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('Password Match Result:', isMatch);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
