// Global variables
let isRecording = false;
let recognition = null;
let currentAuthMode = 'login';
let currentDemoMode = 'text';
let voiceAuthStep = 1;
let voiceAuthData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize Web Speech API if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
    }
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Close modal when clicking outside
    document.getElementById('authModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAuthModal();
        }
    });
}

// Navigation functions
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
}

function scrollToDemo() {
    const demoSection = document.querySelector('.demo-widget');
    demoSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Demo functions
function switchDemoMode(mode) {
    currentDemoMode = mode;
    
    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    // Show/hide demo inputs
    document.getElementById('textDemo').style.display = mode === 'text' ? 'block' : 'none';
    document.getElementById('voiceDemo').style.display = mode === 'voice' ? 'block' : 'none';
    
    // Reset demo output
    resetDemoOutput();
}

function toggleVoiceInput() {
    if (!recognition) {
        showNotification('Voice recognition is not supported in your browser', 'error');
        return;
    }
    
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    
    if (!isRecording) {
        startVoiceRecording(voiceBtn, voiceStatus);
    } else {
        stopVoiceRecording(voiceBtn, voiceStatus);
    }
}

function startVoiceRecording(btn, status) {
    isRecording = true;
    btn.classList.add('recording');
    btn.innerHTML = '<i class="fas fa-stop"></i><span>Click to stop</span>';
    status.textContent = 'Listening... Speak now!';
    
    recognition.start();
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('ideaInput').value = transcript;
        status.textContent = `Captured: "${transcript}"`;
        setTimeout(() => {
            generateDemo();
        }, 1000);
    };
    
    recognition.onerror = function(event) {
        showNotification('Voice recognition error. Please try again.', 'error');
        stopVoiceRecording(btn, status);
    };
    
    recognition.onend = function() {
        stopVoiceRecording(btn, status);
    };
}

function stopVoiceRecording(btn, status) {
    isRecording = false;
    btn.classList.remove('recording');
    btn.innerHTML = '<i class="fas fa-microphone"></i><span>Click to speak</span>';
    status.textContent = 'Ready to listen...';
    
    if (recognition) {
        recognition.stop();
    }
}

function generateDemo() {
    const ideaInput = document.getElementById('ideaInput');
    const idea = ideaInput.value.trim();
    
    if (!idea) {
        showNotification('Please enter your business idea first', 'warning');
        return;
    }
    
    showLoadingOverlay();
    
    // Simulate AI processing
    setTimeout(() => {
        hideLoadingOverlay();
        displayDemoResults(idea);
    }, 2000);
}

function displayDemoResults(idea) {
    const output = document.getElementById('demoOutput');
    
    // Generate mock results based on the idea
    const results = generateMockResults(idea);
    
    output.innerHTML = `
        <div class="demo-result">
            <h4><i class="fas fa-lightbulb"></i> Business Concept</h4>
            <p>${results.concept}</p>
        </div>
        <div class="demo-result">
            <h4><i class="fas fa-target"></i> Target Market</h4>
            <p>${results.market}</p>
        </div>
        <div class="demo-result">
            <h4><i class="fas fa-dollar-sign"></i> Revenue Potential</h4>
            <p>${results.revenue}</p>
        </div>
        <div class="demo-result">
            <h4><i class="fas fa-chart-line"></i> Growth Strategy</h4>
            <p>${results.strategy}</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <button class="btn-primary" onclick="showAuthModal('signup')">
                <i class="fas fa-arrow-right"></i>
                Get Full Analysis
            </button>
        </div>
    `;
}

function generateMockResults(idea) {
    // Simple keyword-based mock results
    const lowerIdea = idea.toLowerCase();
    
    let concept = "Innovative business model with strong market potential";
    let market = "Growing demand in emerging markets";
    let revenue = "$50K - $200K projected first-year revenue";
    let strategy = "Multi-channel approach with digital-first strategy";
    
    if (lowerIdea.includes('shoe') || lowerIdea.includes('fashion')) {
        concept = "Fashion-forward footwear brand targeting eco-conscious consumers";
        market = "Sustainable fashion market growing at 15% annually";
        revenue = "$75K - $300K projected first-year revenue";
        strategy = "D2C online sales with pop-up retail experiences";
    } else if (lowerIdea.includes('food') || lowerIdea.includes('restaurant')) {
        concept = "Innovative food service concept with delivery optimization";
        market = "Food delivery market expanding rapidly in urban areas";
        revenue = "$100K - $500K projected first-year revenue";
        strategy = "Cloud kitchen model with multiple brand concepts";
    } else if (lowerIdea.includes('tech') || lowerIdea.includes('app')) {
        concept = "Technology solution addressing specific market inefficiencies";
        market = "SaaS and mobile app markets showing strong growth";
        revenue = "$25K - $150K projected first-year revenue";
        strategy = "Freemium model with enterprise upsell opportunities";
    }
    
    return { concept, market, revenue, strategy };
}

function resetDemoOutput() {
    document.getElementById('demoOutput').innerHTML = `
        <div class="demo-placeholder">
            <i class="fas fa-lightbulb"></i>
            <p>Enter your idea above to see AI-powered insights</p>
        </div>
    `;
}

// Authentication functions
function showAuthModal(mode) {
    currentAuthMode = mode;
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authTitle');
    
    // Update modal title
    title.textContent = mode === 'login' ? 'Welcome Back to BizPilot' : 'Join BizPilot Today';
    
    // Show correct form
    switchAuthMode(mode);
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset forms
    document.querySelectorAll('.auth-form form').forEach(form => form.reset());
    voiceAuthStep = 1;
    voiceAuthData = {};
}

function switchAuthMode(mode) {
    currentAuthMode = mode;
    
    // Hide all forms
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('voiceAuthForm').style.display = 'none';
    
    // Show correct form
    if (mode === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('authTitle').textContent = 'Welcome Back to BizPilot';
    } else if (mode === 'signup') {
        document.getElementById('signupForm').style.display = 'block';
        document.getElementById('authTitle').textContent = 'Join BizPilot Today';
    } else if (mode === 'voice') {
        document.getElementById('voiceAuthForm').style.display = 'block';
        document.getElementById('authTitle').textContent = 'Voice Authentication';
        resetVoiceAuth();
    }
}

function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || event.target.querySelector('input[type="password"]').value;
    
    showLoadingOverlay();
    
    // Simulate login process
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('Login successful! Redirecting to dashboard...', 'success');
        setTimeout(() => {
            closeAuthModal();
            // In a real app, redirect to dashboard
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1500);
}

function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const userData = {
        name: form.querySelector('input[type="text"]').value,
        email: form.querySelector('input[type="email"]').value,
        password: form.querySelector('input[type="password"]').value,
        businessStage: form.querySelector('select').value,
        language: form.querySelectorAll('select')[1].value
    };
    
    showLoadingOverlay();
    
    // Simulate signup process
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('Account created successfully! Welcome to BizPilot!', 'success');
        setTimeout(() => {
            closeAuthModal();
            // In a real app, redirect to onboarding
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 2000);
}

// OAuth functions
function authWithGoogle() {
    showLoadingOverlay();
    
    // Simulate Google OAuth
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('Google authentication successful!', 'success');
        setTimeout(() => {
            closeAuthModal();
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1500);
}

function authWithLinkedIn() {
    showLoadingOverlay();
    
    // Simulate LinkedIn OAuth
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('LinkedIn authentication successful!', 'success');
        setTimeout(() => {
            closeAuthModal();
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1500);
}

function authWithVoice() {
    switchAuthMode('voice');
}

// Voice authentication functions
function startVoiceAuth() {
    if (!recognition) {
        showNotification('Voice recognition is not supported in your browser', 'error');
        return;
    }
    
    const btn = document.getElementById('voiceAuthBtn');
    const status = document.getElementById('voiceAuthStatus');
    
    btn.classList.add('recording');
    btn.innerHTML = '<i class="fas fa-stop"></i>';
    
    updateVoiceAuthStatus('Listening...', 'fas fa-microphone');
    
    recognition.start();
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        processVoiceAuthStep(transcript);
    };
    
    recognition.onerror = function(event) {
        showNotification('Voice recognition error. Please try again.', 'error');
        resetVoiceAuthButton();
    };
    
    recognition.onend = function() {
        resetVoiceAuthButton();
    };
}

function processVoiceAuthStep(transcript) {
    const steps = document.querySelectorAll('.step');
    
    switch(voiceAuthStep) {
        case 1:
            voiceAuthData.name = transcript;
            updateVoiceAuthStatus(`Name captured: ${transcript}`, 'fas fa-check');
            steps[0].classList.remove('active');
            steps[1].classList.add('active');
            voiceAuthStep = 2;
            setTimeout(() => {
                updateVoiceAuthStatus('Now say your email address', 'fas fa-microphone');
            }, 2000);
            break;
            
        case 2:
            voiceAuthData.email = transcript;
            updateVoiceAuthStatus(`Email captured: ${transcript}`, 'fas fa-check');
            steps[1].classList.remove('active');
            steps[2].classList.add('active');
            voiceAuthStep = 3;
            setTimeout(() => {
                updateVoiceAuthStatus('Say "confirm" to complete registration', 'fas fa-microphone');
            }, 2000);
            break;
            
        case 3:
            if (transcript.includes('confirm') || transcript.includes('yes')) {
                completeVoiceAuth();
            } else {
                updateVoiceAuthStatus('Please say "confirm" to complete', 'fas fa-exclamation-triangle');
            }
            break;
    }
}

function completeVoiceAuth() {
    updateVoiceAuthStatus('Processing your registration...', 'fas fa-spinner fa-spin');
    
    setTimeout(() => {
        showNotification('Voice registration successful!', 'success');
        setTimeout(() => {
            closeAuthModal();
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 2000);
}

function updateVoiceAuthStatus(message, iconClass) {
    const status = document.getElementById('voiceAuthStatus');
    status.innerHTML = `
        <i class="${iconClass}"></i>
        <p>${message}</p>
    `;
}

function resetVoiceAuthButton() {
    const btn = document.getElementById('voiceAuthBtn');
    btn.classList.remove('recording');
    btn.innerHTML = '<i class="fas fa-microphone"></i>';
}

function resetVoiceAuth() {
    voiceAuthStep = 1;
    voiceAuthData = {};
    
    // Reset steps
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active');
        if (index === 0) step.classList.add('active');
    });
    
    updateVoiceAuthStatus('Click the microphone to start', 'fas fa-microphone-slash');
    resetVoiceAuthButton();
}

// Utility functions
function showLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'block';
}

function hideLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
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
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
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

// Add some demo interactions for the hackathon
function addDemoInteractions() {
    // Auto-fill demo for presentation
    setTimeout(() => {
        if (window.location.hash === '#demo') {
            document.getElementById('ideaInput').value = 'Eco-friendly shoe brand in Dhaka targeting young professionals';
            generateDemo();
        }
    }, 1000);
}

// Call demo interactions
addDemoInteractions();

// Export functions for global access
window.BizPilot = {
    showAuthModal,
    closeAuthModal,
    switchAuthMode,
    switchDemoMode,
    generateDemo,
    toggleVoiceInput,
    startVoiceAuth,
    authWithGoogle,
    authWithLinkedIn,
    authWithVoice,
    scrollToDemo,
    toggleMobileMenu
};
