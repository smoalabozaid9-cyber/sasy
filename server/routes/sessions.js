const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Case = require('../models/Case');
const { protect } = require('../middleware/auth');

// @route   GET /api/sessions
// @desc    Get all sessions (Admin sees all, Lawyer sees related to their cases)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let sessions;
        if (req.user.role === 'admin') {
            sessions = await Session.find().populate({
                path: 'caseId',
                select: 'caseNumber clientName'
            }).sort({ sessionDate: -1 });
        } else {
            // Get cases assigned to this lawyer
            const cases = await Case.find({ assignedLawyer: req.user._id });
            const caseIds = cases.map(c => c._id);
            sessions = await Session.find({ caseId: { $in: caseIds } }).populate({
                path: 'caseId',
                select: 'caseNumber clientName'
            }).sort({ sessionDate: -1 });
        }
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/sessions
// @desc    Add a session to a case
// @access  Private
router.post('/', protect, async (req, res) => {
    const { caseId, sessionDate, court, outcome, nextSessionDate } = req.body;

    try {
        // Check if case exists and user has access
        const relatedCase = await Case.findById(caseId);
        if (!relatedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        if (req.user.role !== 'admin' && relatedCase.assignedLawyer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized for this case' });
        }

        const session = await Session.create({
            caseId,
            sessionDate,
            court,
            outcome,
            nextSessionDate
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// @route   GET /api/sessions/case/:caseId
// @desc    Get sessions for a specific case
// @access  Private
router.get('/case/:caseId', protect, async (req, res) => {
    try {
        // Check access
        const relatedCase = await Case.findById(req.params.caseId);
        if (!relatedCase) {
            return res.status(404).json({ message: 'Case not found' });
        }
        if (req.user.role !== 'admin' && relatedCase.assignedLawyer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const sessions = await Session.find({ caseId: req.params.caseId }).sort({ sessionDate: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
