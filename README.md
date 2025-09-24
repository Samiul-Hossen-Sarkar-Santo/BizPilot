# BizPilot - AI Business Idea Generator

A comprehensive web application that helps entrepreneurs generate AI-powered business plans with detailed 6-month strategies.

## 🚀 Features

### Frontend
- **Interactive Business Idea Form**: Complete form with title, description, category, budget selection, and image upload
- **3-Step Wizard Interface**: Input → Preview → Generated Plans
- **AI-Powered Plan Generation**: Three plan types (Conservative, Aggressive, Lean) with detailed monthly breakdowns
- **Progressive Web App (PWA)**: Installable, offline-capable application
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Glass morphism effects, smooth animations, and intuitive interface

### Backend
- **RESTful API**: Complete backend API with authentication and business logic
- **JWT Authentication**: Secure user authentication and authorization
- **MongoDB Integration**: Robust database with optimized schemas
- **AI Integration**: OpenAI API integration with fallback to mock data
- **File Upload**: Image upload with optimization using Sharp
- **PDF Export**: Business plan export functionality
- **Rate Limiting**: API protection and security measures

## �️ Tech Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with custom properties and CSS Grid
- **JavaScript ES6+**: Class-based architecture with modern APIs
- **Bootstrap 5**: Responsive framework
- **Font Awesome**: Icon system
- **Service Worker**: PWA functionality and offline support

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **OpenAI API**: AI-powered plan generation
- **Multer**: File upload handling
- **Sharp**: Image processing
- **Joi**: Input validation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bizpilot.git
   cd bizpilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   node setup.js
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api
   - Health Check: http://localhost:3000/api/health

### Development Mode

```bash
npm run dev
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/bizpilot

# Authentication
JWT_SECRET=your-super-secret-jwt-key
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

### MongoDB Setup

**Local MongoDB:**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use default connection string: `mongodb://localhost:27017/bizpilot`

**MongoDB Atlas (Cloud):**
1. Create account at https://mongodb.com/atlas
2. Create cluster and database
3. Update `MONGODB_URI` in `.env`

## 📡 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile
POST /api/auth/logout
```

### Business Ideas Endpoints

```http
POST   /api/business/ideas
GET    /api/business/ideas
GET    /api/business/ideas/:id
PUT    /api/business/ideas/:id
DELETE /api/business/ideas/:id
GET    /api/business/analytics
```

### Business Plans Endpoints

```http
GET  /api/plans
GET  /api/plans/:id
POST /api/plans/:id/save
POST /api/plans/:id/archive
GET  /api/plans/:id/export/pdf
POST /api/plans/:id/share
POST /api/plans/:id/feedback
```

### File Upload Endpoints

```http
POST /api/upload/business-image
GET  /api/upload/:filename
```

## 🎨 Frontend Architecture

### Class Structure
```javascript
class BizPilot {
    constructor()           // Initialize application
    init()                 // Setup event listeners
    setupEventListeners()  // Bind UI events
    generatePlans()        // AI plan generation
    savePlan()            // Save to profile
    discardPlan()         // Archive plan
    exportPlan()          // PDF export
    sharePlan()           // Share functionality
}
```

### PWA Features
- **Manifest**: App installation metadata
- **Service Worker**: Offline functionality and caching
- **Responsive**: Mobile-first design
- **Fast**: Optimized performance

## 🔒 Security Features

- JWT authentication with secure headers
- Request rate limiting
- Input validation and sanitization
- File upload restrictions
- CORS configuration
- Helmet.js security headers
- Password hashing with bcrypt

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📱 PWA Installation

Users can install BizPilot as a Progressive Web App:

1. **Desktop**: Click the install button in the address bar
2. **Mobile**: Use "Add to Home Screen" from browser menu
3. **Offline**: Works offline with cached content

## 🚀 Deployment

### Production Build

```bash
NODE_ENV=production npm start
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://yourdomain.com
```

## � Features Overview

### Business Idea Generation
- **Form Validation**: Real-time validation with helpful messages
- **Budget Selection**: Visual budget range selection with icons
- **Category Selection**: 11 business categories
- **Image Upload**: Drag & drop image upload with preview
- **Auto-save**: Automatic form data persistence

### AI Plan Generation
- **Three Plan Types**: Conservative, Aggressive, and Lean approaches
- **6-Month Timeline**: Detailed monthly breakdown with milestones
- **Budget Allocation**: Smart budget distribution across months
- **Task Management**: Detailed tasks with priority and cost estimates
- **Success Metrics**: Key performance indicators for each plan

### User Management
- **Authentication**: Secure login/register system
- **Profile Management**: User preferences and statistics
- **Dashboard**: Personal analytics and plan history
- **Plan Library**: Saved and archived plans

## 🔧 Development

### Project Structure
```
bizpilot/
├── config/          # Database and app configuration
├── middleware/      # Express middleware
├── models/          # MongoDB schemas
├── routes/          # API route handlers
├── services/        # Business logic services
├── validators/      # Input validation schemas
├── uploads/         # File upload directory
├── index.html       # Frontend entry point
├── script.js        # Main frontend application
├── styles.css       # Application styles
├── api-service.js   # Frontend API client
├── service-worker.js # PWA service worker
├── manifest.json    # PWA manifest
└── server.js        # Express server
```

### Code Style
- ES6+ JavaScript with async/await
- Modern CSS with custom properties
- RESTful API design
- MVC architecture pattern
- Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Support

- **Documentation**: See this README
- **Issues**: GitHub Issues tracker
- **Discussions**: GitHub Discussions
- **Email**: support@bizpilot.com

## 🎯 Roadmap

### Version 2.0
- [ ] Advanced AI models integration
- [ ] Team collaboration features
- [ ] Financial projections calculator
- [ ] Market research integration
- [ ] Mobile native apps
- [ ] Multi-language support

### Version 1.1
- [ ] Email notifications
- [ ] Plan templates
- [ ] Export to Word/Excel
- [ ] Social sharing
- [ ] Analytics dashboard

## 🙏 Acknowledgments

- OpenAI for AI integration
- Bootstrap team for UI components
- Font Awesome for icons
- MongoDB team for database
- Express.js community
- All contributors and users

---

**BizPilot** - Transform Your Ideas Into Reality 🚀