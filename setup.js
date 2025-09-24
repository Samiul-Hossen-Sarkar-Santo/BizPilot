#!/usr/bin/env node

// BizPilot Backend Setup Script
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up BizPilot Backend...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
    console.log('📝 Creating .env file from template...');
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ .env file created. Please update the values as needed.\n');
} else {
    console.log('✅ .env file already exists.\n');
}

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    console.log('📁 Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created.\n');
} else {
    console.log('✅ Uploads directory already exists.\n');
}

// Create logs directory
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    console.log('📄 Creating logs directory...');
    fs.mkdirSync(logsDir, { recursive: true });
    console.log('✅ Logs directory created.\n');
} else {
    console.log('✅ Logs directory already exists.\n');
}

console.log('🎉 BizPilot Backend setup complete!\n');
console.log('Next steps:');
console.log('1. Update .env file with your configuration');
console.log('2. Install MongoDB and start the service');
console.log('3. Run: npm install');
console.log('4. Run: npm start');
console.log('\n📚 Documentation: https://github.com/your-repo/bizpilot');
console.log('🐛 Issues: https://github.com/your-repo/bizpilot/issues');
console.log('\n🚀 Happy coding!');