// Dashboard specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Add interactive features to dashboard
    addCardInteractions();
    updateUserStats();
    loadRecentActivity();
    
    // Initialize tooltips or help texts if needed
    initializeHelpSystem();
}

// New Idea Modal Functions
function createNewIdea() {
    document.getElementById('newIdeaModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeNewIdeaModal() {
    document.getElementById('newIdeaModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.querySelector('.idea-form').reset();
}

function submitNewIdea(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const ideaData = {
        title: event.target.querySelector('input[type="text"]').value,
        description: event.target.querySelector('textarea').value,
        category: event.target.querySelector('select').value,
        location: event.target.querySelectorAll('input[type="text"]')[1].value,
        budget: event.target.querySelectorAll('select')[1].value
    };
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    submitBtn.disabled = true;
    
    // Simulate AI processing
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        closeNewIdeaModal();
        
        // Show success notification
        showNotification('New idea created! AI analysis is being generated...', 'success');
        
        // Add new idea card to the grid (in a real app, this would come from the server)
        addNewIdeaCard(ideaData);
        
        // Update stats
        updateIdeaStats();
        
    }, 3000);
}

function addNewIdeaCard(ideaData) {
    const ideasGrid = document.querySelector('.ideas-grid');
    const newCard = document.createElement('div');
    newCard.className = 'idea-card';
    newCard.innerHTML = `
        <div class="idea-header">
            <h3>${ideaData.title}</h3>
            <span class="idea-status draft">Analyzing</span>
        </div>
        <p class="idea-description">${ideaData.description}</p>
        <div class="idea-metrics">
            <div class="metric">
                <span class="metric-label">Market Score</span>
                <span class="metric-value">--</span>
            </div>
            <div class="metric">
                <span class="metric-label">Revenue Potential</span>
                <span class="metric-value">--</span>
            </div>
        </div>
        <div class="idea-actions">
            <button class="btn-secondary btn-small">Edit</button>
            <button class="btn-primary btn-small">View Progress</button>
        </div>
    `;
    
    // Add with animation
    newCard.style.opacity = '0';
    newCard.style.transform = 'translateY(20px)';
    ideasGrid.insertBefore(newCard, ideasGrid.firstChild);
    
    setTimeout(() => {
        newCard.style.transition = 'all 0.3s ease';
        newCard.style.opacity = '1';
        newCard.style.transform = 'translateY(0)';
    }, 100);
    
    // Simulate analysis completion
    setTimeout(() => {
        const status = newCard.querySelector('.idea-status');
        const metrics = newCard.querySelectorAll('.metric-value');
        
        status.textContent = 'Validated';
        status.className = 'idea-status success';
        metrics[0].textContent = '84%';
        metrics[1].textContent = '$180K';
        
        showNotification('Analysis complete! Your idea shows strong potential.', 'success');
    }, 8000);
}

function updateIdeaStats() {
    const ideaCountElement = document.querySelector('.stat-card .stat-info h3');
    const currentCount = parseInt(ideaCountElement.textContent);
    ideaCountElement.textContent = currentCount + 1;
}

// Card Interactions
function addCardInteractions() {
    // Add hover effects and click handlers
    const ideaCards = document.querySelectorAll('.idea-card');
    ideaCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-primary') && !e.target.classList.contains('btn-secondary')) {
                // Show idea details modal or navigate to idea page
                showIdeaDetails(card);
            }
        });
    });
    
    // Add click handlers for action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.querySelector('h4').textContent;
            handleQuickAction(action);
        });
    });
}

function showIdeaDetails(card) {
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('.idea-description').textContent;
    const status = card.querySelector('.idea-status').textContent;
    
    // Create a simple details modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="idea-detail">
                    <div class="detail-section">
                        <h4>Status</h4>
                        <span class="idea-status ${status.toLowerCase()}">${status}</span>
                    </div>
                    <div class="detail-section">
                        <h4>Description</h4>
                        <p>${description}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Next Steps</h4>
                        <ul>
                            <li>Complete market research survey</li>
                            <li>Identify target customer segments</li>
                            <li>Develop MVP wireframes</li>
                            <li>Calculate funding requirements</li>
                        </ul>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                        <button class="btn-primary">Continue Working</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function handleQuickAction(action) {
    switch(action) {
        case 'New Business Idea':
            createNewIdea();
            break;
        case 'Market Analysis':
            showNotification('Market Analysis tool coming soon!', 'info');
            break;
        case 'Find Partners':
            showNotification('Partner matching feature coming soon!', 'info');
            break;
        case 'Learning Resources':
            showNotification('Learning center coming soon!', 'info');
            break;
        default:
            showNotification('Feature coming soon!', 'info');
    }
}

// Update User Stats
function updateUserStats() {
    // Simulate dynamic stats updates
    const stats = [
        { element: '.stat-card:nth-child(2) .stat-info h3', value: '87%' },
        { element: '.stat-card:nth-child(3) .stat-info h3', value: '15' },
    ];
    
    setTimeout(() => {
        stats.forEach(stat => {
            const element = document.querySelector(stat.element);
            if (element) {
                animateValue(element, element.textContent, stat.value);
            }
        });
    }, 1000);
}

function animateValue(element, start, end) {
    const startValue = parseInt(start.replace(/\D/g, ''));
    const endValue = parseInt(end.replace(/\D/g, ''));
    const duration = 1000;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(startValue + (endValue - startValue) * progress);
        
        element.textContent = end.includes('%') ? current + '%' : current.toString();
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Load Recent Activity
function loadRecentActivity() {
    // Simulate loading recent activities or notifications
    setTimeout(() => {
        addActivityNotification('Market research completed for Eco-Friendly Shoe Brand', 'success');
    }, 2000);
    
    setTimeout(() => {
        addActivityNotification('New trend alert: Sustainable packaging gaining 30% more interest', 'info');
    }, 5000);
}

function addActivityNotification(message, type) {
    // Add subtle notifications to the insights section
    const insightsGrid = document.querySelector('.insights-grid');
    const notification = document.createElement('div');
    notification.className = 'insight-card activity-notification';
    notification.innerHTML = `
        <div class="insight-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        </div>
        <div class="insight-content">
            <h4>Recent Activity</h4>
            <p>${message}</p>
        </div>
    `;
    
    // Add with animation
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-20px)';
    insightsGrid.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after some time
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 10000);
}

// Help System
function initializeHelpSystem() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'n':
                    e.preventDefault();
                    createNewIdea();
                    break;
                case 'k':
                    e.preventDefault();
                    focusSearch();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            // Close any open modals
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
    
    // Add helpful tooltips
    addTooltips();
}

function focusSearch() {
    // If there was a search input, focus it
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
        searchInput.focus();
    }
}

function addTooltips() {
    // Add helpful tooltips to various elements
    const tooltipElements = [
        { selector: '.stat-card:first-child', text: 'Track your total business ideas' },
        { selector: '.stat-card:nth-child(2)', text: 'Average market validation score' },
        { selector: '.stat-card:nth-child(3)', text: 'Days since you joined BizPilot' },
        { selector: '.stat-card:last-child', text: 'Your achievement level based on activity' }
    ];
    
    tooltipElements.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.title = item.text;
        }
    });
}

// Mobile Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    sidebar.classList.toggle('active');
}

// Real-time Updates Simulation
function startRealTimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
        // Update metrics occasionally
        if (Math.random() > 0.8) {
            updateRandomMetric();
        }
    }, 30000); // Every 30 seconds
}

function updateRandomMetric() {
    const metrics = document.querySelectorAll('.metric-value');
    const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
    
    if (randomMetric && randomMetric.textContent !== '--') {
        const currentValue = parseInt(randomMetric.textContent);
        const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
        const newValue = Math.max(0, Math.min(100, currentValue + change));
        
        if (randomMetric.textContent.includes('%')) {
            animateValue(randomMetric, currentValue + '%', newValue + '%');
        }
    }
}

// Initialize real-time updates
startRealTimeUpdates();

// Utility function for showing notifications (reuse from main.js)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 4000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
    
    function getNotificationColor(type) {
        switch(type) {
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            case 'warning': return '#ffc107';
            default: return '#17a2b8';
        }
    }
}

// Export dashboard functions
window.Dashboard = {
    createNewIdea,
    closeNewIdeaModal,
    submitNewIdea,
    toggleSidebar,
    showIdeaDetails,
    handleQuickAction
};
