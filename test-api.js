// Test API connectivity using Node.js built-in modules
const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedBody = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsedBody });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testAPI() {
    console.log('🧪 Testing BizPilot API endpoints...\n');
    
    // Test health endpoint
    try {
        const health = await testEndpoint('/api/health');
        console.log('✅ Health endpoint:', health.status === 200 ? 'Working' : 'Failed');
        console.log('   Response:', health.data);
    } catch (error) {
        console.log('❌ Health endpoint failed:', error.message);
    }

    console.log('\n');

    // Test business idea creation without auth (should fail with 401)
    try {
        const businessData = {
            title: 'Test Chicken Hut',
            description: 'Homemade mini chicken food items. they are budget friendly, clean and homemade',
            category: 'food',
            budget: 'low'
        };
        
        const create = await testEndpoint('/api/business/ideas', 'POST', businessData);
        console.log('📝 Business idea creation (no auth):', create.status === 401 ? 'Protected (Good)' : 'Unexpected');
        console.log('   Response:', create.data);
    } catch (error) {
        console.log('❌ Business idea creation test failed:', error.message);
    }

    console.log('\n🎯 API tests completed!');
}

testAPI();