const express = require('express');
const BusinessIdea = require('../models/BusinessIdea');
const { protect } = require('../middleware/auth');
const { validateBusinessIdea } = require('../validators/businessValidators');
const { generateBusinessPlans } = require('../services/aiService');

const router = express.Router();

// @desc    Create business idea
// @route   POST /api/business/ideas
// @access  Private
router.post('/ideas', protect, validateBusinessIdea, async (req, res) => {
    try {
        const { title, description, category, budget } = req.body;

        const businessIdea = await BusinessIdea.create({
            userId: req.user.id,
            title,
            description,
            category,
            budget,
            status: 'processing',
            metadata: {
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                aiModel: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
            }
        });

        // Generate AI business plans
        const plans = await generateBusinessPlans(businessIdea);

        // Update business idea status
        businessIdea.status = 'completed';
        businessIdea.metadata.processingTime = Date.now() - businessIdea.createdAt.getTime();
        await businessIdea.save();

        res.status(201).json({
            success: true,
            message: 'Business idea created and plans generated successfully',
            data: {
                businessIdea,
                plans
            }
        });

    } catch (error) {
        console.error('Business idea creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create business idea',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @desc    Create business idea (Demo/Public)
// @route   POST /api/business/ideas/demo
// @access  Public
router.post('/ideas/demo', validateBusinessIdea, async (req, res) => {
    try {
        const { title, description, category, budget } = req.body;

        // Create temporary business idea object for plan generation
        const businessIdea = {
            title,
            description,
            category,
            budget,
            status: 'processing',
            createdAt: new Date(),
            metadata: {
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                aiModel: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                demo: true
            }
        };

        try {
            // Generate AI business plans
            const plans = await generateBusinessPlans(businessIdea);

            res.status(201).json({
                success: true,
                message: 'Demo business plans generated successfully',
                data: {
                    businessIdea: {
                        ...businessIdea,
                        status: 'completed'
                    },
                    plans
                }
            });

        } catch (planError) {
            console.error('❌ Plan generation error:', planError);
            
            // Fallback to basic response for demo
            res.status(201).json({
                success: true,
                message: 'Demo mode - using fallback plan generation',
                data: {
                    businessIdea: {
                        ...businessIdea,
                        status: 'completed'
                    },
                    plans: []
                },
                fallback: true
            });
        }

    } catch (error) {
        console.error('❌ Demo business idea error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate demo business plans',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @desc    Get user's business ideas
// @route   GET /api/business/ideas
// @access  Private
router.get('/ideas', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { userId: req.user.id };
        
        // Add category filter if provided
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Add status filter if provided
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const businessIdeas = await BusinessIdea.find(filter)
            .populate('plans')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await BusinessIdea.countDocuments(filter);

        res.json({
            success: true,
            data: {
                businessIdeas,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get business ideas error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch business ideas'
        });
    }
});

// @desc    Get single business idea
// @route   GET /api/business/ideas/:id
// @access  Private
router.get('/ideas/:id', protect, async (req, res) => {
    try {
        const businessIdea = await BusinessIdea.findOne({
            _id: req.params.id,
            userId: req.user.id
        }).populate('plans');

        if (!businessIdea) {
            return res.status(404).json({
                success: false,
                message: 'Business idea not found'
            });
        }

        res.json({
            success: true,
            data: { businessIdea }
        });

    } catch (error) {
        console.error('Get business idea error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch business idea'
        });
    }
});

// @desc    Update business idea
// @route   PUT /api/business/ideas/:id
// @access  Private
router.put('/ideas/:id', protect, async (req, res) => {
    try {
        const { title, description, category, budget, status } = req.body;

        const businessIdea = await BusinessIdea.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                title,
                description,
                category,
                budget,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!businessIdea) {
            return res.status(404).json({
                success: false,
                message: 'Business idea not found'
            });
        }

        res.json({
            success: true,
            message: 'Business idea updated successfully',
            data: { businessIdea }
        });

    } catch (error) {
        console.error('Update business idea error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update business idea'
        });
    }
});

// @desc    Delete business idea
// @route   DELETE /api/business/ideas/:id
// @access  Private
router.delete('/ideas/:id', protect, async (req, res) => {
    try {
        const businessIdea = await BusinessIdea.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!businessIdea) {
            return res.status(404).json({
                success: false,
                message: 'Business idea not found'
            });
        }

        res.json({
            success: true,
            message: 'Business idea deleted successfully'
        });

    } catch (error) {
        console.error('Delete business idea error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete business idea'
        });
    }
});

// @desc    Get business ideas analytics
// @route   GET /api/business/analytics
// @access  Private
router.get('/analytics', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get ideas by category
        const categoriesData = await BusinessIdea.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get ideas by budget
        const budgetData = await BusinessIdea.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: '$budget', count: { $sum: 1 } } }
        ]);

        // Get monthly creation trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await BusinessIdea.aggregate([
            { 
                $match: { 
                    userId: userId,
                    createdAt: { $gte: sixMonthsAgo }
                } 
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.json({
            success: true,
            data: {
                categories: categoriesData,
                budgets: budgetData,
                monthlyTrend
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics data'
        });
    }
});

module.exports = router;