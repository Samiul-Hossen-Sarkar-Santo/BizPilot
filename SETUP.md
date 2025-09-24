# BizPilot Setup Instructions

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment
```bash
node setup.js
```

### 3. Configure Environment Variables
Edit the `.env` file with your settings:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database (Required)
MONGODB_URI=mongodb://localhost:27017/bizpilot

# Authentication (Required)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_EXPIRES_IN=7d

# OpenAI (Optional - uses mock data if not provided)
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS
FRONTEND_URL=http://localhost:3000
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod
```

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux (systemd):**
```bash
sudo systemctl start mongod
```

### 5. Start the Application
```bash
npm start
```

## Access Points

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

## Development Mode

For development with auto-restart:
```bash
npm run dev
```

## MongoDB Installation

### Local Installation

**Windows:**
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Install and start the service
3. Use connection string: `mongodb://localhost:27017/bizpilot`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)

1. Create account at https://mongodb.com/atlas
2. Create a new cluster
3. Create database user and whitelist IP
4. Get connection string and update `MONGODB_URI` in `.env`

## OpenAI API Setup (Optional)

1. Create account at https://openai.com
2. Go to API section and create API key
3. Add key to `.env` as `OPENAI_API_KEY`

**Note**: If no OpenAI key is provided, the app will use mock data for plan generation.

## File Structure After Setup

```
bizpilot/
├── config/
│   └── database.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── BusinessIdea.js
│   ├── BusinessPlan.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── business.js
│   ├── plans.js
│   ├── upload.js
│   └── users.js
├── services/
│   ├── aiService.js
│   └── pdfService.js
├── validators/
│   ├── authValidator.js
│   ├── businessValidator.js
│   └── planValidator.js
├── uploads/          # Created automatically
├── node_modules/     # Created by npm install
├── .env             # Created by setup.js
├── .env.example     # Template file
├── api-service.js   # Frontend API client
├── index.html       # Main frontend
├── manifest.json    # PWA manifest
├── package.json     # Dependencies
├── README.md        # Documentation
├── script.js        # Frontend logic
├── server.js        # Express server
├── service-worker.js # PWA service worker
├── setup.js         # Setup script
└── styles.css       # Frontend styles
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP is whitelisted

### Port Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# Kill the process or use different port
set PORT=3001  # Windows
export PORT=3001  # macOS/Linux
```

### File Upload Issues
- Ensure `uploads/` directory exists (created automatically)
- Check file size limits in `.env`
- Verify write permissions

### JWT Secret Issues
- Must be at least 32 characters long
- Use complex, random string for production
- Never commit secrets to version control

## API Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret-at-least-32-chars
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://yourdomain.com
```

### Security Checklist
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable MongoDB authentication
- [ ] Set up HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Monitor logs
- [ ] Regular security updates

## Getting Help

1. Check this setup guide
2. Review the main README.md
3. Check server logs for errors
4. Test API endpoints individually
5. Verify environment variables
6. Ensure all services are running

---

**BizPilot Setup Complete!** 🚀

Visit http://localhost:3000 to start using the application.