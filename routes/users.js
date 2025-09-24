const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
    try {
        const User = require('../models/User');
        const BusinessIdea = require('../models/BusinessIdea');
        const BusinessPlan = require('../models/BusinessPlan');

        const userId = req.user.id;

        // Get user stats
        const totalIdeas = await BusinessIdea.countDocuments({ userId });
        const totalPlans = await BusinessPlan.countDocuments({ userId });
        const savedPlans = await BusinessPlan.countDocuments({ userId, status: 'saved' });
        const archivedPlans = await BusinessPlan.countDocuments({ userId, status: 'archived' });

        // Get recent ideas (last 5)
        const recentIdeas = await BusinessIdea.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title category status createdAt');

        // Get recent plans (last 5)
        const recentPlans = await BusinessPlan.find({ userId })
            .populate('businessIdeaId', 'title')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title type status createdAt businessIdeaId');

        res.json({
            success: true,
            data: {
                stats: {
                    totalIdeas,
                    totalPlans,
                    savedPlans,
                    archivedPlans
                },
                recentIdeas,
                recentPlans
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data'
        });
    }
});

module.exports = router;