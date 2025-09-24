// API Service for BizPilot Frontend
class ApiService {
    constructor() {
        this.baseURL = window.location.origin + '/api';
        this.token = localStorage.getItem('bizpilot_token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('bizpilot_token', token);
        } else {
            localStorage.removeItem('bizpilot_token');
        }
    }

    // Get authentication headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }

        return response;
    }

    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } finally {
            this.setToken(null);
        }
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    // Business Ideas methods
    async createBusinessIdea(ideaData) {
        // Use demo endpoint if not authenticated
        const endpoint = this.token ? '/business/ideas' : '/business/ideas/demo';
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(ideaData)
        });
    }

    async getBusinessIdeas(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/business/ideas${queryString ? '?' + queryString : ''}`);
    }

    async getBusinessIdea(id) {
        return this.request(`/business/ideas/${id}`);
    }

    // Business Plans methods
    async getBusinessPlans(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/plans${queryString ? '?' + queryString : ''}`);
    }

    async getBusinessPlan(id) {
        return this.request(`/plans/${id}`);
    }

    async savePlan(id) {
        return this.request(`/plans/${id}/save`, { method: 'POST' });
    }

    async archivePlan(id) {
        return this.request(`/plans/${id}/archive`, { method: 'POST' });
    }

    async exportPlanPDF(id) {
        const url = `${this.baseURL}/plans/${id}/export/pdf`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${this.token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to export PDF');
        }

        return response.blob();
    }

    async sharePlan(id, shareData) {
        return this.request(`/plans/${id}/share`, {
            method: 'POST',
            body: JSON.stringify(shareData)
        });
    }

    // File upload method
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        const url = `${this.baseURL}/upload/business-image`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }

        return data;
    }

    // Dashboard data
    async getDashboardData() {
        return this.request('/users/dashboard');
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Create global API instance
window.apiService = new ApiService();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}