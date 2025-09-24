const express = require('express');
const BusinessPlan = require('../models/BusinessPlan');
const { protect } = require('../middleware/auth');
const { generatePDF } = require('../services/pdfService');

const router = express.Router();

// @desc    Get user's business plans
// @route   GET /api/plans
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { userId: req.user.id };
        
        // Add status filter if provided
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Add type filter if provided
        if (req.query.type) {
            filter.type = req.query.type;
        }

        const plans = await BusinessPlan.find(filter)
            .populate('businessIdeaId', 'title category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await BusinessPlan.countDocuments(filter);

        res.json({
            success: true,
            data: {
                plans,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get plans error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch business plans'
        });
    }
});

// @desc    Get single business plan
// @route   GET /api/plans/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const plan = await BusinessPlan.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate('businessIdeaId');

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Business plan not found'
            });
        }

        res.json({
            success: true,
            data: { plan }
        });

    } catch (error) {
        console.error('Get plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch business plan'
        });
    }
});

// @desc    Save business plan to profile
// @route   POST /api/plans/:id/save
// @access  Private
router.post('/:id/save', protect, async (req, res) => {
    try {
        const plan = await BusinessPlan.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                status: 'saved'
            },
            {
                new: true
            }
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Business plan not found'
            });
        }

        // Update user stats
        await req.user.updateOne({
            $inc: { 'stats.totalPlansSaved': 1 }
        });

        res.json({
            success: true,
            message: 'Plan saved to profile successfully',
            data: { plan }
        });

    } catch (error) {
        console.error('Save plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save plan'
        });
    }
});

// @desc    Add business plan to history
// @route   POST /api/plans/:id/archive
// @access  Private
router.post('/:id/archive', protect, async (req, res) => {
    try {
        const plan = await BusinessPlan.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                status: 'archived'
            },
            {
                new: true
            }
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Business plan not found'
            });
        }

        res.json({
            success: true,
            message: 'Plan added to history successfully',
            data: { plan }
        });

    } catch (error) {
        console.error('Archive plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to archive plan'
        });
    }
});

// @desc    Export business plan as PDF
// @route   GET /api/plans/:id/export/pdf
// @access  Private
router.get('/:id/export/pdf', protect, async (req, res) => {
    try {
        const plan = await BusinessPlan.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate('businessIdeaId');

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Business plan not found'
            });
        }

        // Generate PDF
        const pdfBuffer = await generatePDF(plan);

        // Update export record
        plan.exports.push({
            format: 'pdf',
            exportedAt: new Date(),
            downloadCount: 1
        });
        await plan.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${plan.title}.pdf"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Export PDF error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export PDF'
        });
    }
});

// @desc    Share business plan
// @route   POST /api/plans/:id/share
// @access  Private
router.post('/:id/share', protect, async (req, res) => {
    try {
        const { email, message } = req.body;
        
        const plan = await BusinessPlan.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate('businessIdeaId');

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Business plan not found'
            });
        }

        // In a real implementation, you would send email here
        // For now, we'll just return success
        
        res.json({
            success: true,
            message: 'Plan shared successfully',
            data: {
                shareLink: `${process.env.FRONTEND_URL}/plans/${plan._id}`,
                sharedWith: email
            }
        });

    } catch (error) {
        console.error('Share plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to share plan'
        });
    }
});

// @desc    Add feedback to business plan
// @route   POST /api/plans/:id/feedback
// @access  Private
router.post('/:id/feedback', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const plan = await BusinessPlan.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                feedback: {
                    rating,
                    comment,
                    createdAt: new Date()
                }
            },
            {
                new: true
            }
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Business plan not found'
            });
        }

        res.json({
            success: true,
            message: 'Feedback added successfully',
            data: { plan }
        });

    } catch (error) {
        console.error('Add feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add feedback'
        });
    }
});

module.exports = router;