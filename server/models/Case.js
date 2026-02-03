const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    caseNumber: {
        type: String,
        required: true,
        unique: true
    },
    clientName: {
        type: String,
        required: true
    },
    caseType: {
        type: String,
        required: true
    },
    court: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'ongoing', 'finished'],
        default: 'new'
    },
    assignedLawyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: {
        type: String
    },
    // Simple array of strings for proof of concept attachments (urls)
    attachments: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Case', CaseSchema);
