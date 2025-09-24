// Simple test for debugging server routes
const express = require('express');
const app = express();

// Test endpoint to verify server is working
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Test endpoint working!',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// Catch all for debugging
app.get('*', (req, res) => {
    res.json({
        message: 'Route not found',
        requestedUrl: req.url,
        method: req.method
    });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`🧪 Test server running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
});