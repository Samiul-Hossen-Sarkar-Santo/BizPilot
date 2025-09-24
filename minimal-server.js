// Minimal server to test API endpoints
const express = require('express');
const app = express();

app.use(express.json());

// Health endpoint (should come before static files)
app.get('/api/health', (req, res) => {
    console.log('Health endpoint hit');
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({
        message: 'API is working correctly!',
        timestamp: new Date().toISOString()
    });
});

// Static files (should come after API routes)
app.use(express.static('.'));

// Catch-all for frontend routes
app.get('*', (req, res) => {
    console.log('Catch-all hit for:', req.url);
    res.sendFile(__dirname + '/index.html');
});

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`🚀 Minimal server running on http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
});

module.exports = app;