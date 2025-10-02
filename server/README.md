# IntelliTicket Backend

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Inngest](https://img.shields.io/badge/Inngest-3.38.0-000000?style=for-the-badge&logo=inngest&logoColor=white)](https://inngest.com/)

*High-performance backend API for IntelliTicket - AI-powered ticket management system*

[🚀 **Live API**](https://ai-ticket-assistant-production.up.railway.app/api) • [📖 **Main Project**](../README.md) • [🔧 **Setup Guide**](#-quick-start)

</div>

---

## 📋 Overview

The IntelliTicket backend is a robust, scalable API built with Node.js and Express that powers the AI-driven ticket management system. It features real-time AI processing, background job management, and enterprise-grade authentication.

### 🎯 Key Features

- **🤖 AI-Powered Processing** - Google Gemini integration for ticket analysis
- **⚡ Background Jobs** - Inngest-powered asynchronous processing
- **🔐 Enterprise Auth** - Clerk-based authentication and authorization
- **📊 High Performance** - Pino logging and optimized database queries
- **📧 Email Notifications** - Automated ticket assignment notifications
- **🔄 Event-Driven** - Scalable microservices architecture

---

## 🛠️ Tech Stack

### Core Framework
- **Node.js 18+** - JavaScript runtime
- **Express 5.1.0** - Web application framework
- **MongoDB 8.15.1** - NoSQL database with Mongoose ODM

### Authentication & Security
- **Clerk Backend 2.17.0** - Enterprise authentication
- **CORS 2.8.5** - Cross-origin resource sharing
- **SVix 1.76.1** - Webhook signature verification

### AI & Background Processing
- **Inngest 3.38.0** - Background job processing
- **Agent Kit 0.8.0** - AI agent framework
- **Google Gemini API** - AI ticket analysis

### Email & Notifications
- **Nodemailer 7.0.3** - Email sending
- **Mailtrap** - Email testing and delivery

### Development & Monitoring
- **Pino 9.12.0** - High-performance logging
- **Nodemon 3.1.10** - Development hot reload
- **Inngest CLI** - Background job development

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **pnpm** (v8.0.0 or higher)
- **MongoDB** (Atlas recommended)
- **Clerk Account** - For authentication
- **Google Gemini API Key** - For AI features

### Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

### Environment Configuration

Create `server/.env`:
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/intelliticket

# Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_password

# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
```

### Development

```bash
# Start development server
pnpm dev

# Start with Inngest (recommended)
pnpm inngest:dev

# Start production server
pnpm start
```

**🌐 Access Points:**
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health
- **Inngest Dashboard**: http://localhost:8288 (dev mode)

---

## 📁 Project Structure

```
server/
├── 📁 controllers/          # Request handlers
│   ├── ticket.js           # Ticket CRUD operations
│   └── user.js             # User management
├── 📁 middlewares/         # Express middlewares
│   ├── auth.js             # Authentication middleware
│   └── error-handler.js    # Global error handling
├── 📁 models/              # Mongoose models
│   ├── ticket.js           # Ticket schema
│   └── user.js             # User schema
├── 📁 routes/              # API routes
│   ├── ticket.js           # Ticket endpoints
│   ├── user.js             # User endpoints
│   └── webhook.js          # Webhook handlers
├── 📁 inngest/             # Background job definitions
│   ├── client.js           # Inngest client configuration
│   └── functions/          # Background job functions
│       ├── on-signup.js    # User signup handler
│       └── on-ticket-create.js # Ticket processing
├── 📁 scripts/             # Utility scripts
│   ├── migrate-users.js    # User migration
│   ├── test-clerk-auth.js  # Auth testing
│   └── test-complete-flow.js # End-to-end testing
├── 📁 utils/               # Utility functions
│   ├── ai.js               # AI integration
│   ├── logger.js           # Logging utilities
│   └── mailer.js           # Email utilities
├── 📄 index.js             # Application entry point
├── 📄 package.json         # Dependencies and scripts
└── 📄 nodemon.json         # Development configuration
```

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update user profile | ✅ |
| `GET` | `/api/auth/users` | Get all users | Admin only |
| `PUT` | `/api/auth/update-user` | Update user role/skills | Admin only |

### Ticket Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/tickets` | Create new ticket | ✅ |
| `GET` | `/api/tickets` | Get user's tickets | ✅ |
| `GET` | `/api/tickets/:id` | Get ticket details | ✅ |

### Webhook Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/webhooks/clerk` | Clerk user sync webhook |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/inngest` | Inngest function discovery |

---

## 🤖 AI Integration

### Ticket Analysis Pipeline

The backend uses Google Gemini AI to automatically analyze tickets:

```javascript
// utils/ai.js
const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-2.5-flash-lite",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "IntelliTicket AI Assistant",
    system: `You are an expert AI assistant that processes technical support tickets...`
  });
  
  return await supportAgent.run(/* ticket analysis prompt */);
};
```

### AI Processing Features

- **Automatic Categorization** - AI determines ticket type and category
- **Priority Assignment** - Smart priority scoring based on content
- **Skill Matching** - Identifies required technical skills
- **Helpful Notes** - Generates moderator guidance and resources

---

## ⚡ Background Processing

### Inngest Functions

The backend uses Inngest for reliable background job processing:

#### `on-ticket-create`
- **Trigger**: New ticket created
- **Process**: AI analysis, moderator assignment, notifications
- **Retry**: Automatic retry on failure
- **Timeout**: 5 minutes

#### `on-signup`
- **Trigger**: New user registration
- **Process**: User profile setup, welcome email
- **Retry**: 3 attempts with exponential backoff

### Job Configuration

```javascript
// inngest/functions/on-ticket-create.js
export const onTicketCreate = inngest.createFunction(
  { id: "ticket-created" },
  { event: "ticket.created" },
  async ({ event, step }) => {
    // AI analysis
    const analysis = await step.run("analyze-ticket", async () => {
      return await analyzeTicket(event.data.ticket);
    });
    
    // Assign moderator
    await step.run("assign-moderator", async () => {
      return await assignModerator(event.data.ticket, analysis);
    });
  }
);
```

---

## 📊 Database Schema

### User Model

```javascript
// models/user.js
const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'moderator', 'admin'], 
    default: 'user' 
  },
  skills: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Ticket Model

```javascript
// models/ticket.js
const ticketSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'resolved', 'closed'], 
    default: 'open' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  category: { type: String },
  aiAnalysis: {
    summary: String,
    helpfulNotes: String,
    relatedSkills: [String],
    confidence: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

---

## 🔧 Development Scripts

### Available Commands

```bash
# Development
pnpm dev              # Start with nodemon
pnpm inngest:dev      # Start with Inngest dashboard

# Production
pnpm start            # Start production server
pnpm start:inngest    # Start with Inngest support

# Testing
pnpm test:clerk       # Test Clerk authentication
pnpm test:complete    # End-to-end flow test

# Database
pnpm migrate:users    # Run user migration
pnpm migrate:apply    # Apply migration changes
```

### Development Tools

- **Nodemon** - Automatic server restart on changes
- **Inngest CLI** - Background job development and debugging
- **Pino Pretty** - Human-readable log formatting

---

## 📧 Email System

### Email Configuration

The backend uses Nodemailer with Mailtrap for email delivery:

```javascript
// utils/mailer.js
const transporter = nodemailer.createTransporter({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: process.env.MAILTRAP_SMTP_PORT,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS
  }
});
```

### Email Templates

- **Ticket Assignment** - Notify moderators of new assignments
- **Welcome Email** - New user onboarding
- **Status Updates** - Ticket status change notifications

---

## 📊 Logging & Monitoring

### Pino Logging

The backend uses Pino for high-performance structured logging:

```javascript
// utils/logger.js
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  }
});
```

### Log Levels

- **ERROR** - System errors and exceptions
- **WARN** - Warning conditions
- **INFO** - General information
- **DEBUG** - Detailed debugging information

### Health Monitoring

```bash
# Health check endpoint
curl http://localhost:3000/health

# Response
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456,
  "memory": {
    "used": "45.2 MB",
    "total": "128.0 MB"
  }
}
```

---

## 🚀 Deployment

### Railway Deployment

The backend is configured for Railway deployment:

```json
// railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd server && pnpm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Environment Variables

Set these in your deployment platform:
- `MONGO_URI` - MongoDB connection string
- `CLERK_SECRET_KEY` - Clerk secret key
- `GEMINI_API_KEY` - Google Gemini API key
- `NODE_ENV=production` - Production environment

### Production Optimizations

- **PM2** - Process management (optional)
- **Nginx** - Reverse proxy (optional)
- **MongoDB Atlas** - Managed database
- **Inngest Cloud** - Managed background jobs

---

## 🔍 Troubleshooting

### Common Issues

<details>
<summary><strong>🔧 Database Connection Issues</strong></summary>

```bash
# Check MongoDB connection
node -e "console.log(process.env.MONGO_URI)"

# Test connection
pnpm test:complete
```
</details>

<details>
<summary><strong>🔧 Clerk Authentication Issues</strong></summary>

- Verify `CLERK_SECRET_KEY` in `.env`
- Check webhook configuration in Clerk dashboard
- Ensure webhook secret matches `CLERK_WEBHOOK_SECRET`
</details>

<details>
<summary><strong>🔧 AI Processing Errors</strong></summary>

- Verify `GEMINI_API_KEY` in `.env`
- Check API quota and billing
- Monitor Inngest function logs
</details>

<details>
<summary><strong>🔧 Inngest Background Jobs</strong></summary>

```bash
# Check Inngest dashboard
http://localhost:8288

# View function logs
pnpm inngest:dev --log-level debug
```
</details>

---

## 📊 Performance

### Optimization Features

- **Connection Pooling** - MongoDB connection optimization
- **Query Optimization** - Indexed database queries
- **Caching** - In-memory caching for frequent data
- **Compression** - Gzip response compression

### Performance Metrics

- **Response Time**: < 200ms average
- **Throughput**: 1000+ requests/minute
- **Memory Usage**: < 100MB typical
- **Database Queries**: < 50ms average

---

## 🧪 Testing

### Testing Strategy

```bash
# Test authentication flow
pnpm test:clerk

# Test complete application flow
pnpm test:complete

# Test specific components
node scripts/test-specific.js
```

### Test Coverage

- **Unit Tests** - Individual function testing
- **Integration Tests** - API endpoint testing
- **End-to-End Tests** - Complete workflow testing
- **Load Tests** - Performance and scalability testing

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Run tests and linting**
5. **Submit a pull request**

### Code Standards

- **ESLint** - Enforced code quality
- **Prettier** - Consistent formatting
- **Conventional Commits** - Standardized commit messages
- **JSDoc** - Function documentation

---

## 📚 Resources

### Documentation
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [Inngest Docs](https://www.inngest.com/docs)
- [Clerk Backend SDK](https://clerk.com/docs/backend-requests)

### Tools
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Postman](https://www.postman.com/) - API testing
- [Inngest Dashboard](https://app.inngest.com/) - Background job monitoring

---

<div align="center">

**Built with ❤️ using Node.js, Express, and MongoDB**

[⬆ Back to Top](#intelliticket-backend) • [📖 Main Project](../README.md)

</div>
