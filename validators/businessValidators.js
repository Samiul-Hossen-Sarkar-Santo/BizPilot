const Joi = require('joi');
const { validate } = require('./authValidators');

// Business idea validation schema
const businessIdeaSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'Business title must be at least 3 characters long',
            'string.max': 'Business title cannot exceed 100 characters',
            'any.required': 'Business title is required'
        }),
    description: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.min': 'Description must be at least 10 characters long',
            'string.max': 'Description cannot exceed 1000 characters',
            'any.required': 'Business description is required'
        }),
    category: Joi.string()
        .valid('technology', 'retail', 'food', 'health', 'education', 'finance', 'entertainment', 'travel', 'real-estate', 'automotive', 'other')
        .required()
        .messages({
            'any.only': 'Please select a valid category',
            'any.required': 'Category is required'
        }),
    budget: Joi.string()
        .valid('low', 'medium', 'high', 'enterprise')
        .required()
        .messages({
            'any.only': 'Please select a valid budget range',
            'any.required': 'Budget range is required'
        })
});

// Export validation middleware
const validateBusinessIdea = validate(businessIdeaSchema);

module.exports = {
    validateBusinessIdea
};