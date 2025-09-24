const mongoose = require('mongoose');

const businessIdeaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Business title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Business description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'technology',
            'retail',
            'food',
            'health',
            'education',
            'finance',
            'entertainment',
            'travel',
            'real-estate',
            'automotive',
            'other'
        ]
    },
    budget: {
        type: String,
        required: [true, 'Budget range is required'],
        enum: ['low', 'medium', 'high', 'enterprise']
    },
    image: {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        url: String
    },
    status: {
        type: String,
        enum: ['draft', 'processing', 'completed', 'archived'],
        default: 'draft'
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        processingTime: Number,
        aiModel: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for associated plans
businessIdeaSchema.virtual('plans', {
    ref: 'BusinessPlan',
    localField: '_id',
    foreignField: 'businessIdeaId'
});

// Indexes for better query performance
businessIdeaSchema.index({ userId: 1, createdAt: -1 });
businessIdeaSchema.index({ category: 1, budget: 1 });
businessIdeaSchema.index({ status: 1 });

module.exports = mongoose.model('BusinessIdea', businessIdeaSchema);