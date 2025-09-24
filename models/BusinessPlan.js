const mongoose = require('mongoose');

const monthlyPlanSchema = new mongoose.Schema({
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    milestones: [{
        type: String,
        trim: true
    }],
    tasks: [{
        name: String,
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        estimatedHours: Number,
        cost: Number
    }]
});

const businessPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessIdeaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessIdea',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Plan title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Plan description is required']
    },
    type: {
        type: String,
        required: true,
        enum: ['conservative', 'aggressive', 'lean']
    },
    riskLevel: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High']
    },
    timeline: {
        type: String,
        default: '6 months'
    },
    months: [monthlyPlanSchema],
    totalBudgetEstimate: {
        type: Number,
        default: 0
    },
    potentialRevenue: {
        type: Number,
        default: 0
    },
    successMetrics: [{
        metric: String,
        target: String,
        timeframe: String
    }],
    status: {
        type: String,
        enum: ['draft', 'saved', 'archived', 'exported'],
        default: 'draft'
    },
    tags: [{
        type: String,
        trim: true
    }],
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    exports: [{
        format: {
            type: String,
            enum: ['pdf', 'csv', 'json']
        },
        exportedAt: {
            type: Date,
            default: Date.now
        },
        downloadCount: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for plan completion percentage
businessPlanSchema.virtual('completionPercentage').get(function() {
    const completedMonths = this.months.filter(month => month.milestones.length > 0).length;
    return Math.round((completedMonths / 6) * 100);
});

// Calculate total budget estimate before saving
businessPlanSchema.pre('save', function(next) {
    if (this.months && this.months.length > 0) {
        this.totalBudgetEstimate = this.months.reduce((total, month) => {
            return total + (month.tasks?.reduce((taskTotal, task) => taskTotal + (task.cost || 0), 0) || 0);
        }, 0);
    }
    next();
});

// Indexes for better query performance
businessPlanSchema.index({ userId: 1, status: 1, createdAt: -1 });
businessPlanSchema.index({ businessIdeaId: 1 });
businessPlanSchema.index({ type: 1, riskLevel: 1 });

module.exports = mongoose.model('BusinessPlan', businessPlanSchema);