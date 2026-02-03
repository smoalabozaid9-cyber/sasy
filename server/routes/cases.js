const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/cases
// @desc    Get all cases (Admin sees all, Lawyer sees assigned)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let cases;
        if (req.user.role === 'admin') {
            cases = await Case.find().populate('assignedLawyer', 'name email');
        } else {
            cases = await Case.find({ assignedLawyer: req.user._id });
        }
        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/cases
// @desc    Create a new case
// @access  Private (Lawyer/Admin)
router.post('/', protect, async (req, res) => {
    const {
        caseNumber,
        clientName,
        caseType,
        court,
        status,
        notes,
        assignedLawyer
    } = req.body;

    try {
        // If lawyer, they assign to themselves usually, or admin assigns
        let lawyerId = req.user._id;
        if (req.user.role === 'admin' && assignedLawyer) {
            lawyerId = assignedLawyer;
        }

        const newCase = new Case({
            caseNumber,
            clientName,
            caseType,
            court,
            status,
            notes,
            assignedLawyer: lawyerId
        });

        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// @route   GET /api/cases/:id
// @desc    Get single case by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const singleCase = await Case.findById(req.params.id).populate('assignedLawyer', 'name');

        if (!singleCase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        // Access control
        if (req.user.role !== 'admin' && singleCase.assignedLawyer._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this case' });
        }

        res.json(singleCase);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
