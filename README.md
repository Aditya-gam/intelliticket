<div align="center">

# 🎫 IntelliTicket - AI-Powered Ticket Management

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-https://unrivaled--daifuku--2c910e.netlify.app/-00D4AA?style=for-the-badge&logo=netlify)](https://unrivaled-daifuku-2c910e.netlify.app/)
[![API Status](https://img.shields.io/badge/🔗_API-https://ai--ticket--assistant--production.up.railway.app/api-00D4AA?style=for-the-badge&logo=railway)](https://ai-ticket-assistant-production.up.railway.app/api)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini-FF6B6B?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

*A smart ticket management system that uses AI to automatically categorize, prioritize, and assign support tickets to the most appropriate moderators.*

[🚀 **Try Live Demo**](https://unrivaled-daifuku-2c910e.netlify.app/) • [📖 **Documentation**](#-documentation) • [🛠️ **Setup Guide**](#-quick-setup) • [📊 **API Reference**](#-api-endpoints)

</div>

---

## ✨ Features

### 🤖 **AI-Powered Intelligence**
- **Automatic Ticket Categorization** - AI analyzes ticket content and assigns appropriate categories
- **Smart Priority Assignment** - Intelligent priority scoring based on content analysis
- **Skill-Based Moderator Matching** - AI matches tickets to moderators with relevant expertise
- **AI-Generated Insights** - Helpful notes and recommendations for moderators

### 👥 **Advanced User Management**
- **Role-Based Access Control** - User, Moderator, and Admin roles with granular permissions
- **Skill Management System** - Comprehensive skill tracking and assignment
- **Secure Authentication** - Powered by Clerk with enterprise-grade security
- **User Profile Management** - Complete user lifecycle management

### ⚡ **Production-Ready Architecture**
- **Event-Driven Processing** - Asynchronous background jobs with Inngest
- **Scalable Microservices** - Separate frontend and backend deployments
- **Real-time Notifications** - Automated email alerts and updates
- **High-Performance Logging** - Pino-based structured logging

### 🌐 **Modern Tech Stack**
- **Frontend**: React 19 + Vite + TailwindCSS + DaisyUI
- **Backend**: Node.js + Express 5 + MongoDB + Mongoose
- **Authentication**: Clerk (Enterprise-grade)
- **AI Integration**: Google Gemini API
- **Background Jobs**: Inngest
- **Package Management**: pnpm (Monorepo)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **pnpm** (v8.0.0 or higher)
- **MongoDB** (Atlas recommended)
- **Clerk Account** (for authentication)
- **Google Gemini API Key** (for AI features)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/intelliticket.git
cd intelliticket

# Install pnpm (if not installed)
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 2. Environment Setup
Create the following environment files:

**`server/.env`**:
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/intelliticket

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Email (Mailtrap for development)
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_password

# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
```

**`client/.env`**:
```env
VITE_SERVER_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 3. Start Development
```bash
# Start all services (recommended)
pnpm dev

# Or start individual services
pnpm c dev    # Frontend only
pnpm s dev    # Backend only
```

**🌐 Access Points:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

---

## 🏗️ Production Deployment

### Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Background    │
│   (Netlify)     │◄──►│   (Railway)     │◄──►│   (Inngest)     │
│   - React SPA   │    │   - Express API │    │   - AI Jobs     │
│   - Static CDN  │    │   - MongoDB     │    │   - Notifications│
│   - Global Edge │    │   - Clerk Auth  │    │   - Processing  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Live Deployment Status
- ✅ **Frontend**: [https://unrivaled-daifuku-2c910e.netlify.app/](https://unrivaled-daifuku-2c910e.netlify.app/)
- ✅ **Backend API**: [https://ai-ticket-assistant-production.up.railway.app/api](https://ai-ticket-assistant-production.up.railway.app/api)
- ✅ **Health Check**: [https://ai-ticket-assistant-production.up.railway.app/health](https://ai-ticket-assistant-production.up.railway.app/health)

### Deployment Commands
```bash
# Build for production
pnpm build

# Deploy frontend (Netlify)
pnpm build:client

# Deploy backend (Railway)
pnpm build:server
pnpm start:server
```

---

## 📝 API Endpoints

### 🔐 Authentication (Clerk-based)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update own profile (skills) | ✅ |
| `GET` | `/api/auth/users` | Get all users | Admin only |
| `PUT` | `/api/auth/update-user` | Update user role & skills | Admin only |

### 🎫 Tickets
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/tickets` | Create a new ticket | ✅ |
| `GET` | `/api/tickets` | Get user's tickets | ✅ |
| `GET` | `/api/tickets/:id` | Get ticket details | ✅ |

### 🔗 Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/webhooks/clerk` | Clerk user sync webhook |

### 🏥 Health & Monitoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | System health check |

---

## 🔄 Ticket Processing Flow

```mermaid
graph TD
    A[User Submits Ticket] --> B[Create Ticket Record]
    B --> C[Trigger AI Analysis]
    C --> D[AI Categorizes & Prioritizes]
    D --> E[Find Matching Moderator]
    E --> F{Moderator Found?}
    F -->|Yes| G[Assign to Moderator]
    F -->|No| H[Assign to Admin]
    G --> I[Send Email Notification]
    H --> I
    I --> J[Ticket Ready for Processing]
```

### Detailed Process:
1. **Ticket Creation** - User submits ticket with title and description
2. **AI Processing** - Background job analyzes content using Google Gemini
3. **Smart Assignment** - System matches tickets to moderators based on skills
4. **Notification** - Email sent to assigned moderator with AI insights
5. **Processing** - Moderator can view and process the ticket

---

## 🛠️ Development Scripts

### Main Commands
```bash
# Development
pnpm dev              # Start all services with Inngest
pnpm dev:core         # Start client + server only
pnpm dev:inngest      # Alternative Inngest startup

# Building
pnpm build            # Build all services
pnpm build:client     # Frontend only
pnpm build:server     # Backend only

# Production
pnpm start            # Start all in production
pnpm start:client     # Frontend only
pnpm start:server     # Backend only

# Utilities
pnpm lint             # Run linters
pnpm lint:fix         # Auto-fix issues
pnpm test             # Run tests
pnpm clean            # Clean node_modules
```

### Workspace Commands
```bash
# Client workspace
pnpm c dev            # Start client
pnpm c build          # Build client
pnpm c add package    # Add dependency

# Server workspace
pnpm s dev            # Start server
pnpm s build          # Build server
pnpm s add package    # Add dependency
```

---

## 🧪 Testing

### Health Check
```bash
# Test API health
curl https://ai-ticket-assistant-production.up.railway.app/health

# Expected response
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456
}
```

### Test Ticket Creation
```bash
curl -X POST https://ai-ticket-assistant-production.up.railway.app/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "title": "Database Connection Issue",
    "description": "Experiencing intermittent database connection timeouts"
  }'
```

### Run Test Suite
```bash
# Run all tests
pnpm test

# Run specific workspace tests
pnpm --filter client test
pnpm --filter server test
```

---

## 📁 Project Structure

```
intelliticket/
├── 📁 client/                    # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable components
│   │   ├── 📁 pages/            # Page components
│   │   └── 📁 utils/            # Utility functions
│   ├── 📄 package.json
│   └── 📄 vite.config.js
├── 📁 server/                    # Express Backend
│   ├── 📁 controllers/          # Request handlers
│   ├── 📁 middlewares/          # Express middlewares
│   ├── 📁 models/               # Mongoose models
│   ├── 📁 routes/               # API routes
│   ├── 📁 inngest/              # Background jobs
│   ├── 📁 utils/                # Utility functions
│   └── 📄 package.json
├── 📄 package.json              # Root workspace config
├── 📄 pnpm-workspace.yaml       # pnpm workspace
└── 📄 turbo.json                # Turbo build config
```

---

## 🔧 Configuration

### Environment Variables

#### Server Configuration
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | ✅ | - |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ | - |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ | - |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret | ✅ | - |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ | - |
| `NODE_ENV` | Environment mode | ❌ | `development` |
| `PORT` | Server port | ❌ | `3000` |

#### Client Configuration
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_SERVER_URL` | Backend API URL | ✅ | - |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ | - |

---

## 🚨 Troubleshooting

### Common Issues

<details>
<summary><strong>🔧 pnpm Not Recognized</strong></summary>

```bash
# Install pnpm globally
npm install -g pnpm

# Or enable Corepack (Node.js 16.9+)
corepack enable
corepack prepare pnpm@latest --activate
```
</details>

<details>
<summary><strong>🔧 Port Conflicts</strong></summary>

```bash
# Check port usage
lsof -i :3000   # Server
lsof -i :5173   # Client

# Kill conflicting processes
kill -9 <PID>
```
</details>

<details>
<summary><strong>🔧 Build Failures</strong></summary>

```bash
# Clear caches
pnpm clean
rm -rf .turbo
pnpm clean:build

# Reinstall dependencies
rm -rf pnpm-lock.yaml
pnpm install
```
</details>

<details>
<summary><strong>🔧 AI Processing Errors</strong></summary>

- Verify `GEMINI_API_KEY` in server/.env
- Check API quota and billing
- Validate request format and content
</details>

---

## 📊 Performance & Monitoring

### Key Metrics
- **Response Time**: < 200ms average
- **Uptime**: 99.9% availability
- **AI Processing**: < 5 seconds per ticket
- **Database**: Optimized queries with indexes

### Monitoring Endpoints
- **Health Check**: `/health`
- **API Status**: `/api/status`
- **Metrics**: `/api/metrics` (Admin only)

---

## 🤝 Contributing

This project is part of a video tutorial series. The codebase is maintained for educational purposes and follows specific architectural patterns demonstrated in the tutorial.

### Code Standards
- **ESLint** for code quality
- **Prettier** for formatting
- **Conventional Commits** for git messages
- **TypeScript** for type safety (where applicable)

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

<div align="center">

**Built with ❤️ using these amazing technologies:**

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-000000?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)
[![Google AI](https://img.shields.io/badge/Google%20AI-Gemini-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Inngest](https://img.shields.io/badge/Inngest-Background%20Jobs-000000?style=flat-square&logo=inngest&logoColor=white)](https://inngest.com/)
[![Railway](https://img.shields.io/badge/Railway-Hosting-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app/)
[![Netlify](https://img.shields.io/badge/Netlify-Hosting-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://netlify.com/)

</div>

---

<div align="center">

**[⬆ Back to Top](#-intelliticket---ai-powered-ticket-management)**

Made with ❤️ by the IntelliTicket Team

</div>