const OpenAI = require('openai');
const BusinessPlan = require('../models/BusinessPlan');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

// Mock AI service for development/demo purposes
const mockPlans = {
    conservative: {
        title: "Conservative Growth Plan",
        description: "Steady, low-risk approach focusing on sustainable growth",
        riskLevel: "Low",
        months: [
            {
                month: 1,
                title: "Foundation",
                content: "Market research, business registration, initial setup",
                budget: "15%",
                milestones: ["Market analysis", "Legal setup", "Initial funding"],
                tasks: [
                    { name: "Market research", priority: "high", estimatedHours: 40, cost: 500 },
                    { name: "Business registration", priority: "high", estimatedHours: 8, cost: 300 }
                ]
            },
            {
                month: 2,
                title: "Product Development",
                content: "MVP development, testing, feedback collection",
                budget: "25%",
                milestones: ["MVP completion", "Testing phase", "User feedback"],
                tasks: [
                    { name: "MVP development", priority: "high", estimatedHours: 120, cost: 2000 },
                    { name: "User testing", priority: "medium", estimatedHours: 20, cost: 300 }
                ]
            },
            {
                month: 3,
                title: "Soft Launch",
                content: "Beta testing, limited customer base, refinements",
                budget: "20%",
                milestones: ["Beta release", "Customer feedback", "Product refinement"],
                tasks: [
                    { name: "Beta launch", priority: "high", estimatedHours: 30, cost: 800 },
                    { name: "Customer support setup", priority: "medium", estimatedHours: 15, cost: 400 }
                ]
            },
            {
                month: 4,
                title: "Marketing Strategy",
                content: "Brand development, digital presence, content creation",
                budget: "15%",
                milestones: ["Brand identity", "Website launch", "Content strategy"],
                tasks: [
                    { name: "Brand development", priority: "medium", estimatedHours: 25, cost: 1000 },
                    { name: "Website creation", priority: "high", estimatedHours: 40, cost: 1500 }
                ]
            },
            {
                month: 5,
                title: "Customer Acquisition",
                content: "Sales funnel optimization, customer onboarding",
                budget: "15%",
                milestones: ["Sales process", "Customer onboarding", "Retention strategy"],
                tasks: [
                    { name: "Sales funnel setup", priority: "high", estimatedHours: 30, cost: 600 },
                    { name: "Customer onboarding", priority: "medium", estimatedHours: 20, cost: 400 }
                ]
            },
            {
                month: 6,
                title: "Scale & Optimize",
                content: "Performance analysis, process improvement, growth planning",
                budget: "10%",
                milestones: ["Performance metrics", "Process optimization", "Growth strategy"],
                tasks: [
                    { name: "Analytics setup", priority: "medium", estimatedHours: 15, cost: 300 },
                    { name: "Process optimization", priority: "low", estimatedHours: 25, cost: 500 }
                ]
            }
        ]
    },
    aggressive: {
        title: "Aggressive Expansion Plan",
        description: "Fast-paced growth strategy with higher investment and risk",
        riskLevel: "High",
        months: [
            {
                month: 1,
                title: "Rapid Setup",
                content: "Quick business setup, team hiring, infrastructure",
                budget: "20%",
                milestones: ["Business formation", "Team assembly", "Infrastructure"],
                tasks: [
                    { name: "Business setup", priority: "high", estimatedHours: 20, cost: 1000 },
                    { name: "Team hiring", priority: "high", estimatedHours: 40, cost: 3000 }
                ]
            },
            {
                month: 2,
                title: "Product Launch",
                content: "Full product launch, marketing campaigns, PR",
                budget: "25%",
                milestones: ["Product launch", "Marketing blitz", "PR campaign"],
                tasks: [
                    { name: "Product launch", priority: "high", estimatedHours: 60, cost: 4000 },
                    { name: "Marketing campaign", priority: "high", estimatedHours: 50, cost: 5000 }
                ]
            },
            {
                month: 3,
                title: "Market Penetration",
                content: "Aggressive marketing, partnerships, customer acquisition",
                budget: "20%",
                milestones: ["Market penetration", "Partnerships", "Customer base"],
                tasks: [
                    { name: "Partnership development", priority: "high", estimatedHours: 35, cost: 2000 },
                    { name: "Customer acquisition", priority: "high", estimatedHours: 45, cost: 3500 }
                ]
            },
            {
                month: 4,
                title: "Scaling Operations",
                content: "Team expansion, process automation, quality assurance",
                budget: "15%",
                milestones: ["Team scaling", "Automation", "Quality systems"],
                tasks: [
                    { name: "Process automation", priority: "medium", estimatedHours: 40, cost: 2500 },
                    { name: "Quality assurance", priority: "high", estimatedHours: 30, cost: 1500 }
                ]
            },
            {
                month: 5,
                title: "Market Expansion",
                content: "New markets, product variants, strategic partnerships",
                budget: "15%",
                milestones: ["Market expansion", "Product variants", "Strategic deals"],
                tasks: [
                    { name: "Market research", priority: "medium", estimatedHours: 30, cost: 1800 },
                    { name: "Product development", priority: "high", estimatedHours: 60, cost: 4000 }
                ]
            },
            {
                month: 6,
                title: "Investment Ready",
                content: "Investor pitch, funding rounds, expansion planning",
                budget: "5%",
                milestones: ["Investment deck", "Funding secured", "Expansion plan"],
                tasks: [
                    { name: "Investor pitch prep", priority: "high", estimatedHours: 25, cost: 1000 },
                    { name: "Due diligence", priority: "high", estimatedHours: 40, cost: 2000 }
                ]
            }
        ]
    },
    lean: {
        title: "Lean Startup Plan",
        description: "Minimal viable approach focusing on learning and iteration",
        riskLevel: "Medium",
        months: [
            {
                month: 1,
                title: "Problem Validation",
                content: "Customer interviews, problem identification, solution design",
                budget: "10%",
                milestones: ["Problem validation", "Customer insights", "Solution design"],
                tasks: [
                    { name: "Customer interviews", priority: "high", estimatedHours: 30, cost: 200 },
                    { name: "Problem analysis", priority: "high", estimatedHours: 20, cost: 100 }
                ]
            },
            {
                month: 2,
                title: "Build MVP",
                content: "Minimum viable product, core features, user testing",
                budget: "25%",
                milestones: ["MVP development", "Core features", "Initial testing"],
                tasks: [
                    { name: "MVP development", priority: "high", estimatedHours: 80, cost: 1500 },
                    { name: "User testing", priority: "medium", estimatedHours: 15, cost: 200 }
                ]
            },
            {
                month: 3,
                title: "Test & Learn",
                content: "User feedback, product iterations, market validation",
                budget: "20%",
                milestones: ["User feedback", "Product iterations", "Market validation"],
                tasks: [
                    { name: "Feedback collection", priority: "high", estimatedHours: 25, cost: 300 },
                    { name: "Product iteration", priority: "high", estimatedHours: 40, cost: 800 }
                ]
            },
            {
                month: 4,
                title: "Product-Market Fit",
                content: "Feature refinement, customer satisfaction, retention focus",
                budget: "20%",
                milestones: ["Product refinement", "Customer satisfaction", "Retention metrics"],
                tasks: [
                    { name: "Feature development", priority: "medium", estimatedHours: 35, cost: 700 },
                    { name: "Customer retention", priority: "high", estimatedHours: 20, cost: 400 }
                ]
            },
            {
                month: 5,
                title: "Growth Engine",
                content: "Scalable acquisition channels, viral mechanics, referrals",
                budget: "15%",
                milestones: ["Growth channels", "Viral features", "Referral system"],
                tasks: [
                    { name: "Growth optimization", priority: "high", estimatedHours: 30, cost: 600 },
                    { name: "Referral system", priority: "medium", estimatedHours: 25, cost: 500 }
                ]
            },
            {
                month: 6,
                title: "Sustainable Growth",
                content: "Unit economics optimization, sustainable growth model",
                budget: "10%",
                milestones: ["Unit economics", "Growth model", "Sustainability"],
                tasks: [
                    { name: "Economics analysis", priority: "high", estimatedHours: 20, cost: 300 },
                    { name: "Growth planning", priority: "medium", estimatedHours: 15, cost: 200 }
                ]
            }
        ]
    }
};

// Generate business plans using AI (with fallback to mock data)
async function generateBusinessPlans(businessIdea) {
    try {
        const plans = [];
        
        // If OpenAI API key is available, use real AI generation
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
            plans.push(...await generateAIPlans(businessIdea));
        } else {
            // Use mock plans for development
            console.log('🤖 Using mock AI plans (set OPENAI_API_KEY for real AI generation)');
            plans.push(...await generateMockPlans(businessIdea));
        }

        return plans;
    } catch (error) {
        console.error('Error generating business plans:', error);
        // Fallback to mock plans if AI fails
        return await generateMockPlans(businessIdea);
    }
}

// Generate plans using OpenAI API
async function generateAIPlans(businessIdea) {
    const plans = [];
    const planTypes = ['conservative', 'aggressive', 'lean'];

    for (const type of planTypes) {
        try {
            const prompt = createPrompt(businessIdea, type);
            
            const completion = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert business consultant who creates detailed 6-month business plans.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            });

            const planData = parseAIResponse(completion.choices[0].message.content, type);
            
            const plan = await BusinessPlan.create({
                userId: businessIdea.userId,
                businessIdeaId: businessIdea._id,
                ...planData
            });

            plans.push(plan);
        } catch (error) {
            console.error(`Error generating ${type} plan:`, error);
            // Fallback to mock plan for this type
            const mockPlan = await createMockPlan(businessIdea, type);
            plans.push(mockPlan);
        }
    }

    return plans;
}

// Generate mock plans for development
async function generateMockPlans(businessIdea) {
    const plans = [];
    const planTypes = ['conservative', 'aggressive', 'lean'];

    for (const type of planTypes) {
        const plan = await createCustomizedPlan(businessIdea, type);
        plans.push(plan);
    }

    return plans;
}

// Create customized plan based on user input
async function createCustomizedPlan(businessIdea, type) {
    const customizedPlan = generateCustomizedPlanContent(businessIdea, type);
    
    return await BusinessPlan.create({
        userId: businessIdea.userId,
        businessIdeaId: businessIdea._id,
        title: customizedPlan.title,
        description: customizedPlan.description,
        type: type,
        riskLevel: customizedPlan.riskLevel,
        timeline: '6 months',
        months: customizedPlan.months,
        successMetrics: customizedPlan.successMetrics,
        tags: [businessIdea.category, businessIdea.budget, type]
    });
}

// Generate customized plan content based on business idea
function generateCustomizedPlanContent(businessIdea, type) {
    const { title, description, category, budget } = businessIdea;
    
    // Base plan structures
    const planTemplates = {
        conservative: {
            title: `Conservative Growth Plan for ${title}`,
            description: `Steady, low-risk approach for your ${category.toLowerCase()} business focusing on sustainable growth and market validation`,
            riskLevel: "Low"
        },
        aggressive: {
            title: `Aggressive Expansion Plan for ${title}`,
            description: `Fast-paced growth strategy for your ${category.toLowerCase()} business with higher investment and rapid market penetration`,
            riskLevel: "High"
        },
        lean: {
            title: `Lean Startup Plan for ${title}`,
            description: `Minimal viable approach for your ${category.toLowerCase()} business focusing on learning, iteration, and customer feedback`,
            riskLevel: "Medium"
        }
    };

    const plan = planTemplates[type];
    
    // Generate customized months based on business type and category
    plan.months = generateCustomizedMonths(businessIdea, type);
    plan.successMetrics = generateCustomizedMetrics(businessIdea, type);
    
    return plan;
}

// Generate customized monthly plans
function generateCustomizedMonths(businessIdea, type) {
    const { title, description, category, budget } = businessIdea;
    
    // Budget distribution based on plan type
    const budgetDistribution = {
        conservative: ['15%', '20%', '20%', '15%', '15%', '15%'],
        aggressive: ['30%', '25%', '15%', '10%', '10%', '10%'],
        lean: ['10%', '30%', '20%', '15%', '15%', '10%']
    };

    // Category-specific activities
    const categoryActivities = {
        technology: {
            setup: 'Platform development, technical infrastructure, software licenses',
            development: 'Product development, testing, security implementation',
            launch: 'Beta testing, user feedback, performance optimization',
            growth: 'Feature expansion, scaling infrastructure, user acquisition',
            scale: 'Advanced features, integrations, team expansion',
            optimize: 'Performance optimization, analytics, market expansion'
        },
        food: {
            setup: 'Kitchen setup, equipment purchase, permits and licenses',
            development: 'Menu development, supplier relationships, recipe testing',
            launch: 'Soft opening, customer feedback, quality improvement',
            growth: 'Marketing campaigns, delivery setup, customer base expansion',
            scale: 'Additional locations, catering services, staff training',
            optimize: 'Process optimization, cost reduction, brand building'
        },
        retail: {
            setup: 'Inventory sourcing, store setup, POS system, legal requirements',
            development: 'Product selection, supplier negotiations, pricing strategy',
            launch: 'Grand opening, initial sales, customer service training',
            growth: 'Marketing campaigns, online presence, customer loyalty programs',
            scale: 'Inventory expansion, multiple channels, staff hiring',
            optimize: 'Operations streamlining, customer retention, profit optimization'
        },
        health: {
            setup: 'Facility setup, equipment, certifications, insurance',
            development: 'Service offerings, staff training, compliance procedures',
            launch: 'Soft launch, initial clients, feedback collection',
            growth: 'Marketing outreach, referral programs, service expansion',
            scale: 'Additional services, staff expansion, facility growth',
            optimize: 'Process improvement, client retention, outcome tracking'
        }
    };

    // Use generic activities if category not found
    const activities = categoryActivities[category] || categoryActivities.technology;
    
    const monthTitles = {
        conservative: ['Foundation & Research', 'Planning & Setup', 'Soft Launch', 'Growth Phase', 'Expansion', 'Optimization'],
        aggressive: ['Rapid Setup', 'Full Launch', 'Market Penetration', 'Scaling', 'Expansion', 'Domination'],
        lean: ['Problem Validation', 'MVP Development', 'Market Testing', 'Iteration', 'Growth', 'Scale']
    };

    const months = [];
    const monthNames = monthTitles[type];
    const budgets = budgetDistribution[type];
    const activityKeys = Object.keys(activities);

    for (let i = 0; i < 6; i++) {
        const monthData = {
            month: i + 1,
            title: monthNames[i],
            content: `${activities[activityKeys[i]]} for ${title}. Focus on ${description.substring(0, 50)}...`,
            budget: budgets[i],
            milestones: generateMilestones(category, type, i + 1, title),
            tasks: generateTasks(category, type, i + 1, budget)
        };
        months.push(monthData);
    }

    return months;
}

// Generate customized milestones
function generateMilestones(category, type, month, title) {
    const milestoneTemplates = {
        1: [`Complete ${title} foundation setup`, `Finalize business registration`, `Establish initial ${category} requirements`],
        2: [`Launch ${title} development phase`, `Secure key partnerships`, `Complete initial ${category} implementation`],
        3: [`${title} soft launch completed`, `First customer feedback collected`, `Quality assurance measures in place`],
        4: [`${title} growth metrics established`, `Customer base expansion`, `Optimize ${category} operations`],
        5: [`${title} scaling phase initiated`, `Team expansion completed`, `Advanced ${category} features implemented`],
        6: [`${title} optimization achieved`, `Market position established`, `Future growth plan finalized`]
    };

    return milestoneTemplates[month] || [`Month ${month} objectives for ${title}`, `Progress tracking`, `Quality maintenance`];
}

// Generate customized tasks
function generateTasks(category, type, month, budget) {
    const baseTasks = [
        { name: `${category} specific setup`, priority: 'high', estimatedHours: 40, cost: 800 },
        { name: 'Market research and analysis', priority: 'high', estimatedHours: 20, cost: 400 },
        { name: 'Customer outreach and marketing', priority: 'medium', estimatedHours: 30, cost: 600 },
        { name: 'Operations and logistics', priority: 'medium', estimatedHours: 25, cost: 500 }
    ];

    // Adjust costs based on budget
    const budgetMultiplier = {
        low: 0.5,
        medium: 1.0,
        high: 1.5,
        enterprise: 2.0
    };

    const multiplier = budgetMultiplier[budget] || 1.0;
    
    return baseTasks.map(task => ({
        ...task,
        cost: Math.round(task.cost * multiplier)
    }));
}

// Generate customized success metrics
function generateCustomizedMetrics(businessIdea, type) {
    const { title, category, budget } = businessIdea;
    
    const baseMetrics = {
        conservative: [
            { metric: 'Customer Acquisition', target: '50-100 customers', timeframe: '6 months' },
            { metric: 'Revenue', target: '$5,000-10,000', timeframe: '6 months' },
            { metric: 'Market Validation', target: '80% customer satisfaction', timeframe: '6 months' }
        ],
        aggressive: [
            { metric: 'Customer Acquisition', target: '200-500 customers', timeframe: '6 months' },
            { metric: 'Revenue', target: '$20,000-50,000', timeframe: '6 months' },
            { metric: 'Market Share', target: '10-15% local market', timeframe: '6 months' }
        ],
        lean: [
            { metric: 'Problem Validation', target: '100+ validated problems', timeframe: '6 months' },
            { metric: 'MVP Validation', target: '80% user acceptance', timeframe: '6 months' },
            { metric: 'Learning Velocity', target: '2 validated learnings/month', timeframe: '6 months' }
        ]
    };

    return baseMetrics[type].map(metric => ({
        ...metric,
        metric: `${metric.metric} for ${title}`
    }));
}

// Create AI prompt
function createPrompt(businessIdea, planType) {
    return `
Create a detailed 6-month ${planType} business plan for the following business idea:

Title: ${businessIdea.title}
Description: ${businessIdea.description}
Category: ${businessIdea.category}
Budget Range: ${businessIdea.budget}

Please provide a JSON response with the following structure:
{
    "title": "Plan title",
    "description": "Plan description",
    "riskLevel": "Low|Medium|High",
    "months": [
        {
            "month": 1,
            "title": "Month title",
            "content": "Detailed content",
            "budget": "% of total budget",
            "milestones": ["milestone1", "milestone2"],
            "tasks": [
                {
                    "name": "Task name",
                    "priority": "low|medium|high",
                    "estimatedHours": 10,
                    "cost": 100
                }
            ]
        }
    ]
}

Focus on making the plan ${planType === 'conservative' ? 'low-risk and sustainable' : 
                        planType === 'aggressive' ? 'high-growth and ambitious' : 
                        'lean and iterative with focus on learning'}.
`;
}

// Parse AI response
function parseAIResponse(response, type) {
    try {
        // Try to parse JSON response
        const parsed = JSON.parse(response);
        return {
            title: parsed.title,
            description: parsed.description,
            type: type,
            riskLevel: parsed.riskLevel,
            timeline: '6 months',
            months: parsed.months || []
        };
    } catch (error) {
        console.error('Error parsing AI response:', error);
        // Return mock data if parsing fails
        return {
            ...mockPlans[type],
            type: type
        };
    }
}

module.exports = {
    generateBusinessPlans,
    generateAIPlans,
    generateMockPlans
};