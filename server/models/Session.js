const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    sessionDate: {
        type: Date,
        required: true
    },
    court: {
        type: String, // Can differ from case court if moved
        required: true
    },
    outcome: {
        type: String
    },
    nextSessionDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session', SessionSchema);
