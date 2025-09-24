// Test the minimal server
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/health',
    method: 'GET',
    headers: {
        'User-Agent': 'Node.js Test Client'
    }
};

console.log('Testing minimal server at http://localhost:3002/api/health');

const req = http.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('✅ Response:', data);
        console.log('🎉 Minimal server is working!');
    });
});

req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
});

req.setTimeout(5000, () => {
    console.log('❌ Request timeout');
    req.destroy();
});

req.end();