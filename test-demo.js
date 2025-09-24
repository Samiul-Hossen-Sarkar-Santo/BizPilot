// Test the demo business idea endpoint
const http = require('http');

const businessData = {
    title: 'Chicken Hut',
    description: 'Homemade mini chicken food items. they are budget friendly, clean and homemade',
    category: 'food',
    budget: 'low'
};

const postData = JSON.stringify(businessData);

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/business/ideas/demo',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('🧪 Testing demo business idea endpoint...');
console.log('📋 Data:', businessData);

const req = http.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        try {
            const result = JSON.parse(data);
            console.log('✅ Success:', result.success);
            console.log('📝 Message:', result.message);
            if (result.data && result.data.plans) {
                console.log('📊 Plans generated:', result.data.plans.length);
                if (result.data.plans.length > 0) {
                    console.log('🎯 First plan title:', result.data.plans[0].title);
                    console.log('📅 Timeline:', result.data.plans[0].timeline);
                }
            }
        } catch (e) {
            console.log('❌ Response (not JSON):', data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
});

req.setTimeout(30000, () => {
    console.log('❌ Request timeout');
    req.destroy();
});

req.write(postData);
req.end();