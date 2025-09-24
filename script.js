// BizPilot - Business Idea Generator JavaScript

class BizPilot {
    constructor() {
        this.currentBudget = '';
        this.uploadedFile = null;
        this.currentStep = 1;
        this.formData = {};
        this.generatedPlans = [];
        this.savedPlans = [];
        this.historyPlans = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFileUpload();
        this.setupFormValidation();
        this.loadUserData();
        this.setupKeyboardNavigation();
        this.setupProgressTracking();
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Budget selection
        document.querySelectorAll('.budget-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectBudget(e));
        });

        // Form submission
        document.getElementById('businessIdeaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.showTemplate();
        });

        // Modal events
        document.getElementById('ideaModal').addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Auto-save form data
        document.querySelectorAll('#businessIdeaForm input, #businessIdeaForm textarea, #businessIdeaForm select').forEach(field => {
            field.addEventListener('input', () => this.autoSaveFormData());
        });
    }

    // Enhanced File Upload
    setupFileUpload() {
        const fileInput = document.getElementById('fileInput');
        const fileUploadArea = document.querySelector('.file-upload-area');
        
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Enhanced drag and drop
        fileUploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        fileUploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        fileUploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));
        
        // Click to upload
        fileUploadArea.addEventListener('click', () => fileInput.click());
    }

    // Form Validation
    setupFormValidation() {
        const form = document.getElementById('businessIdeaForm');
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.querySelector('.modal.show')) {
                bootstrap.Modal.getInstance(document.getElementById('ideaModal')).hide();
            }
        });
    }

    // Progress Tracking
    setupProgressTracking() {
        this.updateProgressBar();
    }

    // Budget Selection with Enhanced Animation
    selectBudget(event) {
        const clickedOption = event.currentTarget;
        const budget = clickedOption.getAttribute('onclick').match(/'([^']+)'/)[1];
        
        // Remove selected class from all options
        document.querySelectorAll('.budget-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selected class with animation
        clickedOption.classList.add('selected');
        clickedOption.style.transform = 'scale(1.05)';
        setTimeout(() => {
            clickedOption.style.transform = '';
        }, 200);
        
        // Set the radio button
        const radioId = 'budget' + budget.charAt(0).toUpperCase() + budget.slice(1);
        document.getElementById(radioId).checked = true;
        this.currentBudget = budget;
        
        this.updateProgressBar();
        this.autoSaveFormData();
    }

    // Enhanced File Handling
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        event.currentTarget.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
    }

    handleFileDrop(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (this.validateFile(file)) {
                this.processFile(file);
            }
        }
    }

    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!allowedTypes.includes(file.type)) {
            this.showError('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
            return false;
        }
        
        if (file.size > maxSize) {
            this.showError('File size must be less than 10MB');
            return false;
        }
        
        return true;
    }

    processFile(file) {
        this.uploadedFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('filePreview').classList.remove('hidden');
            
            // Add fade-in animation
            const preview = document.getElementById('filePreview');
            preview.style.opacity = '0';
            preview.style.transform = 'translateY(10px)';
            setTimeout(() => {
                preview.style.transition = 'all 0.3s ease';
                preview.style.opacity = '1';
                preview.style.transform = 'translateY(0)';
            }, 50);
        };
        
        reader.readAsDataURL(file);
        this.autoSaveFormData();
    }

    removeFile() {
        this.uploadedFile = null;
        document.getElementById('filePreview').classList.add('hidden');
        document.getElementById('fileInput').value = '';
        this.autoSaveFormData();
    }

    // Enhanced Form Validation
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.id === 'businessTitle' && value.length < 3) {
            isValid = false;
            errorMessage = 'Business title must be at least 3 characters';
        } else if (field.id === 'businessDescription' && value.length < 20) {
            isValid = false;
            errorMessage = 'Description must be at least 20 characters';
        }

        this.displayFieldError(field, isValid, errorMessage);
        return isValid;
    }

    displayFieldError(field, isValid, errorMessage) {
        const existingError = field.parentNode.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }

        if (!isValid) {
            field.classList.add('is-invalid');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error text-danger mt-1';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Enhanced Navigation
    showTemplate() {
        if (!this.validateForm()) return;
        
        this.collectFormData();
        this.updateStepIndicator(2);
        this.showStep('templatePreview');
        this.populateTemplate();
        this.updateProgressBar();
    }

    showInputForm() {
        this.updateStepIndicator(1);
        this.showStep('inputForm');
        this.updateProgressBar();
    }

    showStep(stepId) {
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.add('hidden');
        });
        
        const targetStep = document.getElementById(stepId);
        targetStep.classList.remove('hidden');
        targetStep.classList.add('animate-fade-in-up');
        
        setTimeout(() => {
            targetStep.classList.remove('animate-fade-in-up');
        }, 600);
    }

    // Enhanced Form Data Collection
    collectFormData() {
        this.formData = {
            title: document.getElementById('businessTitle').value.trim(),
            description: document.getElementById('businessDescription').value.trim(),
            category: document.getElementById('businessCategory').value,
            budget: this.currentBudget,
            file: this.uploadedFile,
            timestamp: new Date().toISOString(),
            id: this.generateId()
        };
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Enhanced Form Validation
    validateForm() {
        const requiredFields = ['businessTitle', 'businessDescription', 'businessCategory'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!this.currentBudget) {
            this.showError('Please select a budget range');
            isValid = false;
        }
        
        if (!isValid) {
            this.showError('Please fill in all required fields correctly');
        }
        
        return isValid;
    }

    // Enhanced Template Population
    populateTemplate() {
        const { title, description, category, budget } = this.formData;
        const budgetText = this.getBudgetText(budget);
        const categoryText = this.getCategoryText(category);
        
        const templateHTML = `
            <div class="template-item animate-slide-in-right" style="animation-delay: 0.1s">
                <div class="template-label">
                    <i class="fas fa-tag me-2 text-primary"></i>Business Title:
                </div>
                <div class="template-value">${title}</div>
            </div>
            <div class="template-item animate-slide-in-right" style="animation-delay: 0.2s">
                <div class="template-label">
                    <i class="fas fa-list me-2 text-primary"></i>Category:
                </div>
                <div class="template-value">${categoryText}</div>
            </div>
            <div class="template-item animate-slide-in-right" style="animation-delay: 0.3s">
                <div class="template-label">
                    <i class="fas fa-dollar-sign me-2 text-primary"></i>Budget Range:
                </div>
                <div class="template-value">${budgetText}</div>
            </div>
            <div class="template-item animate-slide-in-right" style="animation-delay: 0.4s">
                <div class="template-label">
                    <i class="fas fa-file-alt me-2 text-primary"></i>Description:
                </div>
                <div class="template-value" style="text-align: left; margin-top: 0.5rem;">${description}</div>
            </div>
            ${this.uploadedFile ? `
            <div class="template-item animate-slide-in-right" style="animation-delay: 0.5s">
                <div class="template-label">
                    <i class="fas fa-image me-2 text-primary"></i>Reference Photo:
                </div>
                <div class="template-value" style="text-align: left; margin-top: 0.5rem;">
                    <img src="${document.getElementById('previewImage').src}" alt="Reference" 
                         class="img-thumbnail" style="max-height: 150px; border-radius: 10px;">
                </div>
            </div>
            ` : ''}
        `;
        
        document.getElementById('templateContent').innerHTML = templateHTML;
    }

    // Enhanced Plan Generation with Backend Integration
    async generatePlans() {
        this.updateStepIndicator(3);
        this.showStep('generatedPlans');
        this.showLoadingSpinner();
        
        try {
            // Try to use backend API first (works with or without authentication)
            if (window.apiService) {
                await this.generatePlansFromAPI();
            } else {
                // Fallback to frontend generation
                await this.simulateAIGeneration();
                this.generatedPlans = this.createPersonalizedPlans();
            }
            
            this.hideLoadingSpinner();
            this.displayPlans();
            this.updateProgressBar();
            
        } catch (error) {
            this.hideLoadingSpinner();
            this.showError('Failed to generate plans. Please try again.');
            console.error('Plan generation error:', error);
        }
    }

    async generatePlansFromAPI() {
        const businessIdeaData = {
            title: this.formData.title,
            description: this.formData.description,
            category: this.formData.category,
            budget: this.formData.budget
        };

        const messages = [
            'Analyzing your business idea...',
            'Generating AI-powered plans...',
            'Optimizing for your budget...',
            'Creating personalized strategies...',
            'Finalizing recommendations...'
        ];
        
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            if (messageIndex < messages.length) {
                document.querySelector('.loading-text').textContent = messages[messageIndex];
                messageIndex++;
            }
        }, 1000);

        try {
            const response = await window.apiService.createBusinessIdea(businessIdeaData);
            
            clearInterval(messageInterval);
            
            if (response.success) {
                this.currentBusinessIdea = response.data.businessIdea;
                this.generatedPlans = response.data.plans.map(plan => ({
                    title: plan.title,
                    description: plan.description,
                    type: plan.type,
                    riskLevel: plan.riskLevel,
                    timeline: plan.timeline,
                    months: plan.months
                }));
                
                this.showToast('AI-powered business plans generated!', 'success');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            clearInterval(messageInterval);
            console.warn('API generation failed, using fallback:', error);
            
            // Fallback to frontend generation
            await this.simulateAIGeneration();
            this.generatedPlans = this.createPersonalizedPlans();
            this.showToast('Using sample plans (login for AI generation)', 'info');
        }
    }

    async simulateAIGeneration() {
        const messages = [
            'Analyzing your business idea...',
            'Researching market trends...',
            'Creating personalized strategies...',
            'Optimizing financial projections...',
            'Finalizing your business plans...'
        ];
        
        for (let i = 0; i < messages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            document.querySelector('.loading-text').textContent = messages[i];
        }
    }

    showLoadingSpinner() {
        document.getElementById('loadingSpinner').style.display = 'block';
        document.getElementById('plansContainer').classList.add('hidden');
    }

    hideLoadingSpinner() {
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('plansContainer').classList.remove('hidden');
    }

    // Enhanced Plan Creation
    createPersonalizedPlans() {
        const { title, category, budget } = this.formData;
        const baseStrategies = this.getBaseStrategies(category, budget);
        
        return [
            this.createConservativePlan(baseStrategies),
            this.createAggressivePlan(baseStrategies),
            this.createLeanPlan(baseStrategies)
        ];
    }

    getBaseStrategies(category, budget) {
        const strategies = {
            technology: {
                focus: 'Software development and tech innovation',
                channels: 'Digital marketing, tech communities, partnerships',
                challenges: 'Technical complexity, competition, rapid changes'
            },
            retail: {
                focus: 'Product sourcing and customer experience',
                channels: 'E-commerce, social media, local marketing',
                challenges: 'Inventory management, competition, margins'
            },
            food: {
                focus: 'Quality ingredients and customer satisfaction',
                channels: 'Local advertising, food delivery apps, social media',
                challenges: 'Health regulations, perishables, seasonal demand'
            },
            // Add more categories as needed
        };
        
        return strategies[category] || strategies.technology;
    }

    createConservativePlan(strategies) {
        return {
            title: "Conservative Growth Plan",
            description: "Steady, low-risk approach focusing on sustainable growth and market validation",
            type: "conservative",
            riskLevel: "Low",
            timeline: "6 months",
            months: [
                {
                    month: 1,
                    title: "Market Research & Foundation",
                    content: `Conduct thorough market analysis, competitor research, and business registration. Focus on ${strategies.focus}. Establish legal structure and basic infrastructure.`,
                    budget: "15%",
                    milestones: ["Market research report", "Business registration", "Basic website"]
                },
                {
                    month: 2,
                    title: "Product Development & Testing",
                    content: `Develop minimum viable product (MVP) with core features. Start testing with focus groups and gather initial feedback.`,
                    budget: "25%",
                    milestones: ["MVP completion", "User testing", "Feature refinement"]
                },
                {
                    month: 3,
                    title: "Soft Launch & Validation",
                    content: `Launch beta version to limited audience. Collect feedback and iterate on product. Build initial customer base.`,
                    budget: "20%",
                    milestones: ["Beta launch", "First customers", "Product improvements"]
                },
                {
                    month: 4,
                    title: "Brand Development & Marketing",
                    content: `Develop brand identity, create marketing materials, and establish online presence through ${strategies.channels}.`,
                    budget: "15%",
                    milestones: ["Brand guidelines", "Marketing website", "Social media presence"]
                },
                {
                    month: 5,
                    title: "Customer Acquisition & Growth",
                    content: `Implement customer acquisition strategies, optimize conversion funnel, and focus on retention.`,
                    budget: "15%",
                    milestones: ["Customer acquisition system", "Retention strategy", "Analytics setup"]
                },
                {
                    month: 6,
                    title: "Scale & Optimize",
                    content: `Analyze performance metrics, optimize operations, and plan for next phase of growth. Address ${strategies.challenges}.`,
                    budget: "10%",
                    milestones: ["Performance analysis", "Process optimization", "Growth plan"]
                }
            ]
        };
    }

    createAggressivePlan(strategies) {
        return {
            title: "Aggressive Expansion Plan",
            description: "Fast-paced growth strategy with higher investment and market penetration focus",
            type: "aggressive",
            riskLevel: "High",
            timeline: "6 months",
            months: [
                {
                    month: 1,
                    title: "Rapid Setup & Team Building",
                    content: `Quick business setup, hire key team members, and establish operational infrastructure. Secure initial funding and partnerships.`,
                    budget: "30%",
                    milestones: ["Team hiring", "Infrastructure setup", "Funding secured"]
                },
                {
                    month: 2,
                    title: "Full Product Launch",
                    content: `Launch complete product with comprehensive feature set. Implement aggressive marketing campaigns and PR strategies.`,
                    budget: "25%",
                    milestones: ["Product launch", "Marketing campaign", "PR coverage"]
                },
                {
                    month: 3,
                    title: "Market Penetration",
                    content: `Aggressive customer acquisition through ${strategies.channels}. Form strategic partnerships and explore new markets.`,
                    budget: "20%",
                    milestones: ["Customer base growth", "Strategic partnerships", "Market expansion"]
                },
                {
                    month: 4,
                    title: "Scaling Operations",
                    content: `Expand team, automate processes, and ensure quality assurance. Scale infrastructure to handle growth.`,
                    budget: "15%",
                    milestones: ["Team expansion", "Process automation", "Quality systems"]
                },
                {
                    month: 5,
                    title: "Market Expansion",
                    content: `Enter new markets, develop product variants, and establish additional revenue streams.`,
                    budget: "7%",
                    milestones: ["New markets", "Product variants", "Revenue diversification"]
                },
                {
                    month: 6,
                    title: "Investment & Future Planning",
                    content: `Prepare for investment rounds, develop expansion strategy, and build sustainable growth model.`,
                    budget: "3%",
                    milestones: ["Investment pitch", "Expansion plan", "Sustainable model"]
                }
            ]
        };
    }

    createLeanPlan(strategies) {
        return {
            title: "Lean Startup Plan",
            description: "Minimal viable approach focusing on learning, iteration, and customer feedback",
            type: "lean",
            riskLevel: "Medium",
            timeline: "6 months",
            months: [
                {
                    month: 1,
                    title: "Problem Validation",
                    content: `Conduct customer interviews, validate problem-solution fit, and refine business hypothesis through direct customer engagement.`,
                    budget: "10%",
                    milestones: ["Customer interviews", "Problem validation", "Solution design"]
                },
                {
                    month: 2,
                    title: "Build MVP",
                    content: `Develop minimum viable product with essential features only. Focus on core value proposition and user experience.`,
                    budget: "30%",
                    milestones: ["MVP development", "Core features", "User testing"]
                },
                {
                    month: 3,
                    title: "Test & Learn",
                    content: `Launch MVP to early adopters, collect detailed user feedback, and iterate based on real usage data.`,
                    budget: "20%",
                    milestones: ["MVP launch", "User feedback", "Product iterations"]
                },
                {
                    month: 4,
                    title: "Product-Market Fit",
                    content: `Refine product features based on feedback, focus on customer satisfaction and retention metrics.`,
                    budget: "20%",
                    milestones: ["Feature refinement", "Customer satisfaction", "Retention focus"]
                },
                {
                    month: 5,
                    title: "Growth Engine",
                    content: `Develop scalable acquisition channels, implement viral mechanics, and create referral systems.`,
                    budget: "15%",
                    milestones: ["Acquisition channels", "Viral mechanics", "Referral system"]
                },
                {
                    month: 6,
                    title: "Sustainable Growth",
                    content: `Optimize unit economics, establish sustainable growth model, and prepare for scaling phase.`,
                    budget: "5%",
                    milestones: ["Unit economics", "Growth model", "Scale preparation"]
                }
            ]
        };
    }

    // Enhanced Plan Display
    displayPlans() {
        const plansHTML = this.generatedPlans.map((plan, index) => this.createPlanHTML(plan, index)).join('');
        document.getElementById('plansContent').innerHTML = plansHTML;
        
        // Add staggered animation
        document.querySelectorAll('.plan-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    createPlanHTML(plan, index) {
        return `
            <div class="plan-card" data-plan-index="${index}">
                <div class="plan-header">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div class="plan-title">${plan.title}</div>
                        <span class="badge bg-${this.getRiskBadgeColor(plan.riskLevel)} ms-2">${plan.riskLevel} Risk</span>
                    </div>
                    <div class="plan-description">${plan.description}</div>
                    <div class="mt-2 text-muted small">
                        <i class="fas fa-clock me-1"></i>${plan.timeline} • 
                        <i class="fas fa-chart-line me-1"></i>${plan.type.charAt(0).toUpperCase() + plan.type.slice(1)} Strategy
                    </div>
                </div>
                    
                    ${plan.months.map(month => `
                        <div class="month-section">
                            <div class="month-title">
                                Month ${month.month}: ${month.title}
                                <span class="badge bg-light text-dark ms-2">${month.budget} budget</span>
                            </div>
                            <div class="month-content">
                                ${month.content}
                                <div class="mt-2">
                                    <strong>Key Milestones:</strong>
                                    <ul class="mb-0 mt-1">
                                        ${month.milestones.map(milestone => `<li>${milestone}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    
                    <div class="plan-actions">
                        <button type="button" class="btn btn-save" onclick="bizPilot.savePlan(${index})">
                            <i class="fas fa-bookmark me-2"></i>Save to Profile
                        </button>
                        <button type="button" class="btn btn-discard" onclick="bizPilot.discardPlan(${index})">
                            <i class="fas fa-archive me-2"></i>Add to History
                        </button>
                    </div>
                    
                    <div class="mt-3 text-center">
                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="bizPilot.exportPlan(${index})">
                            <i class="fas fa-download me-1"></i>Export PDF
                        </button>
                        <button type="button" class="btn btn-outline-secondary btn-sm ms-2" onclick="bizPilot.sharePlan(${index})">
                            <i class="fas fa-share me-1"></i>Share
                        </button>
                    </div>
            </div>
        `;
    }

    getRiskBadgeColor(riskLevel) {
        const colors = {
            'Low': 'success',
            'Medium': 'warning',
            'High': 'danger'
        };
        return colors[riskLevel] || 'secondary';
    }

    // Enhanced Plan Actions with Backend Integration
    async savePlan(planIndex) {
        const plan = this.generatedPlans[planIndex];
        
        try {
            // Try to save via API if authenticated
            if (window.apiService && window.apiService.token && plan._id) {
                const response = await window.apiService.savePlan(plan._id);
                if (response.success) {
                    this.showToast('Plan saved to your profile dashboard!', 'success');
                    this.animatePlanAction(planIndex, 'saved');
                    return;
                }
            }
            
            // Fallback to local storage
            plan.savedAt = new Date().toISOString();
            plan.status = 'saved';
            this.savedPlans.push(plan);
            this.saveToLocalStorage();
            
            this.showToast('Plan saved locally (login to sync to profile)', 'info');
            this.animatePlanAction(planIndex, 'saved');
            
        } catch (error) {
            console.error('Save plan error:', error);
            this.showToast('Failed to save plan. Please try again.', 'error');
        }
    }

    async discardPlan(planIndex) {
        const plan = this.generatedPlans[planIndex];
        
        try {
            // Try to archive via API if authenticated
            if (window.apiService && window.apiService.token && plan._id) {
                const response = await window.apiService.archivePlan(plan._id);
                if (response.success) {
                    this.showToast('Plan added to history for future reference.', 'success');
                    this.animatePlanAction(planIndex, 'discarded');
                    return;
                }
            }
            
            // Fallback to local storage
            plan.discardedAt = new Date().toISOString();
            plan.status = 'history';
            this.historyPlans.push(plan);
            this.saveToLocalStorage();
            
            this.showToast('Plan added to local history (login to sync)', 'info');
            this.animatePlanAction(planIndex, 'discarded');
            
        } catch (error) {
            console.error('Discard plan error:', error);
            this.showToast('Failed to archive plan. Please try again.', 'error');
        }
    }

    animatePlanAction(planIndex, action) {
        const planCard = document.querySelector(`[data-plan-index="${planIndex}"]`);
        const actionButtons = planCard.querySelector('.plan-actions');
        
        actionButtons.style.opacity = '0.5';
        actionButtons.style.pointerEvents = 'none';
        
        const badge = document.createElement('div');
        badge.className = `badge bg-${action === 'saved' ? 'success' : 'warning'} position-absolute top-0 end-0 m-3`;
        badge.textContent = action === 'saved' ? 'Saved!' : 'In History';
        badge.style.opacity = '0';
        badge.style.transform = 'scale(0.8)';
        
        planCard.style.position = 'relative';
        planCard.appendChild(badge);
        
        setTimeout(() => {
            badge.style.transition = 'all 0.3s ease';
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';
        }, 100);
    }

    // Export and Share Features
    async exportPlan(planIndex) {
        const plan = this.generatedPlans[planIndex];
        
        try {
            // Create PDF content
            const pdfContent = this.generatePDFContent(plan);
            
            // Use browser's print functionality for PDF
            const printWindow = window.open('', '_blank');
            printWindow.document.write(pdfContent);
            printWindow.document.close();
            printWindow.print();
            
            this.showSuccess('Plan export initiated!');
        } catch (error) {
            this.showError('Failed to export plan. Please try again.');
            console.error('Export error:', error);
        }
    }

    generatePDFContent(plan) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${plan.title} - Business Plan</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .month { margin-bottom: 20px; page-break-inside: avoid; }
                    .month-title { font-weight: bold; color: #2563eb; }
                    .month-content { margin: 10px 0; }
                    .milestones { margin-top: 10px; }
                    @media print { body { margin: 20px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${plan.title}</h1>
                    <h2>${this.formData.title}</h2>
                    <p>${plan.description}</p>
                </div>
                ${plan.months.map(month => `
                    <div class="month">
                        <div class="month-title">Month ${month.month}: ${month.title}</div>
                        <div class="month-content">${month.content}</div>
                        <div class="milestones">
                            <strong>Key Milestones:</strong>
                            <ul>${month.milestones.map(m => `<li>${m}</li>`).join('')}</ul>
                        </div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;
    }

    async sharePlan(planIndex) {
        const plan = this.generatedPlans[planIndex];
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${plan.title} - Business Plan`,
                    text: plan.description,
                    url: window.location.href
                });
                this.showSuccess('Plan shared successfully!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    this.fallbackShare(plan);
                }
            }
        } else {
            this.fallbackShare(plan);
        }
    }

    fallbackShare(plan) {
        const shareText = `Check out this business plan: ${plan.title}\n\n${plan.description}\n\nGenerated with BizPilot`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText);
            this.showSuccess('Plan details copied to clipboard!');
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showSuccess('Plan details copied to clipboard!');
        }
    }

    // Enhanced Utility Functions
    getBudgetText(budget) {
        const budgetMap = {
            'low': 'Startup ($0 - $5,000)',
            'medium': 'Growth ($5,000 - $25,000)',
            'high': 'Scale ($25,000 - $100,000)',
            'enterprise': 'Enterprise ($100,000+)'
        };
        return budgetMap[budget] || 'Not specified';
    }

    getCategoryText(category) {
        const categoryMap = {
            'technology': 'Technology & Software',
            'retail': 'Retail & E-commerce',
            'food': 'Food & Beverage',
            'health': 'Health & Wellness',
            'education': 'Education & Training',
            'finance': 'Finance & Consulting',
            'entertainment': 'Entertainment & Media',
            'travel': 'Travel & Tourism',
            'real-estate': 'Real Estate',
            'automotive': 'Automotive',
            'other': 'Other'
        };
        return categoryMap[category] || category;
    }

    // Progress and Step Management
    updateStepIndicator(currentStep) {
        this.currentStep = currentStep;
        
        for (let i = 1; i <= 3; i++) {
            const step = document.getElementById(`step${i}`);
            const line = document.getElementById(`line${i}`);
            
            step.classList.remove('active', 'completed');
            if (line) line.classList.remove('completed');
            
            if (i < currentStep) {
                step.classList.add('completed');
                if (line) line.classList.add('completed');
            } else if (i === currentStep) {
                step.classList.add('active');
            }
        }
    }

    updateProgressBar() {
        const progressBars = document.querySelectorAll('.progress-bar');
        let progress = 0;
        
        // Calculate progress based on form completion
        const totalFields = 4; // title, description, category, budget
        let completedFields = 0;
        
        if (document.getElementById('businessTitle').value.trim()) completedFields++;
        if (document.getElementById('businessDescription').value.trim()) completedFields++;
        if (document.getElementById('businessCategory').value) completedFields++;
        if (this.currentBudget) completedFields++;
        
        progress = (completedFields / totalFields) * 100;
        
        progressBars.forEach(bar => {
            bar.style.width = `${progress}%`;
        });
    }

    // Data Persistence
    autoSaveFormData() {
        const formData = {
            title: document.getElementById('businessTitle').value,
            description: document.getElementById('businessDescription').value,
            category: document.getElementById('businessCategory').value,
            budget: this.currentBudget,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('bizpilot_draft', JSON.stringify(formData));
    }

    loadUserData() {
        // Load draft data
        const draft = localStorage.getItem('bizpilot_draft');
        if (draft) {
            try {
                const data = JSON.parse(draft);
                document.getElementById('businessTitle').value = data.title || '';
                document.getElementById('businessDescription').value = data.description || '';
                document.getElementById('businessCategory').value = data.category || '';
                
                if (data.budget) {
                    this.currentBudget = data.budget;
                    const budgetId = 'budget' + data.budget.charAt(0).toUpperCase() + data.budget.slice(1);
                    const budgetElement = document.getElementById(budgetId);
                    if (budgetElement) {
                        budgetElement.checked = true;
                        budgetElement.closest('.budget-option').classList.add('selected');
                    }
                }
            } catch (error) {
                console.error('Failed to load draft data:', error);
            }
        }
        
        // Load saved plans
        const saved = localStorage.getItem('bizpilot_saved');
        if (saved) {
            try {
                this.savedPlans = JSON.parse(saved);
            } catch (error) {
                console.error('Failed to load saved plans:', error);
            }
        }
        
        // Load history
        const history = localStorage.getItem('bizpilot_history');
        if (history) {
            try {
                this.historyPlans = JSON.parse(history);
            } catch (error) {
                console.error('Failed to load history:', error);
            }
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('bizpilot_saved', JSON.stringify(this.savedPlans));
            localStorage.setItem('bizpilot_history', JSON.stringify(this.historyPlans));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            this.showError('Failed to save locally. Please check your browser storage.');
        }
    }

    // Backend Integration (Simulation)
    async sendPlanToBackend(plan, action) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true, id: plan.id });
                } else {
                    reject(new Error('Network error'));
                }
            }, 500);
        });
    }

    // Enhanced Error Handling and Notifications
    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'success') {
        const toastContainer = document.querySelector('.toast-container');
        const toastId = 'toast-' + Date.now();
        
        const toastHTML = `
            <div id="${toastId}" class="toast" role="alert">
                <div class="toast-header">
                    <i class="fas fa-${type === 'success' ? 'check-circle text-success' : 'exclamation-circle text-danger'} me-2"></i>
                    <strong class="me-auto">${type === 'success' ? 'Success' : 'Error'}</strong>
                    <small class="text-muted">just now</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">${message}</div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toast = new bootstrap.Toast(document.getElementById(toastId));
        toast.show();
        
        // Remove toast element after hiding
        document.getElementById(toastId).addEventListener('hidden.bs.toast', function() {
            this.remove();
        });
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 's':
                    event.preventDefault();
                    this.autoSaveFormData();
                    this.showSuccess('Draft saved!');
                    break;
                case 'Enter':
                    if (this.currentStep === 1 && this.validateForm()) {
                        event.preventDefault();
                        this.showTemplate();
                    } else if (this.currentStep === 2) {
                        event.preventDefault();
                        this.generatePlans();
                    }
                    break;
            }
        }
    }

    // Form Reset
    resetForm() {
        document.getElementById('businessIdeaForm').reset();
        document.querySelectorAll('.budget-option').forEach(option => {
            option.classList.remove('selected');
        });
        this.removeFile();
        this.currentBudget = '';
        this.currentStep = 1;
        this.updateStepIndicator(1);
        this.showStep('inputForm');
        
        // Clear validation states
        document.querySelectorAll('.is-invalid, .is-valid').forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
        });
        document.querySelectorAll('.field-error').forEach(error => {
            error.remove();
        });
        
        // Clear draft
        localStorage.removeItem('bizpilot_draft');
    }
}

// Global functions for onclick handlers
window.selectBudget = function(budget) {
    if (window.bizPilot) {
        // Find the clicked element and trigger the method
        const option = event.currentTarget;
        window.bizPilot.selectBudget({ currentTarget: option });
    }
};

window.removeFile = function() {
    if (window.bizPilot) {
        window.bizPilot.removeFile();
    }
};

window.showTemplate = function() {
    if (window.bizPilot) {
        window.bizPilot.showTemplate();
    }
};

window.showInputForm = function() {
    if (window.bizPilot) {
        window.bizPilot.showInputForm();
    }
};

window.editTemplate = function() {
    if (window.bizPilot) {
        window.bizPilot.showInputForm();
    }
};

window.generatePlans = function() {
    if (window.bizPilot) {
        window.bizPilot.generatePlans();
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.bizPilot = new BizPilot();
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}