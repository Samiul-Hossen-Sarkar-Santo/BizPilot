// Simple curl-like test
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/health',
    method: 'GET',
    headers: {
        'User-Agent': 'Node.js Test Client'
    }
};

console.log('Making request to http://localhost:3000/api/health');

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Response body:', data);
    });
});

req.on('error', (error) => {
    console.error('Request error:', error);
});

req.setTimeout(5000, () => {
    console.log('Request timeout');
    req.destroy();
});

req.end();