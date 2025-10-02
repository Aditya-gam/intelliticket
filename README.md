# AI-Ticket-Assistant - Intelliticket

A smart ticket management system that uses AI to automatically categorize, prioritize, and assign support tickets to the most appropriate moderators.

## 🚀 Features

- **AI-Powered Ticket Processing**

  - Automatic ticket categorization
  - Smart priority assignment
  - Skill-based moderator matching
  - AI-generated helpful notes for moderators

- **Smart Moderator Assignment**

  - Automatic matching of tickets to moderators based on skills
  - Fallback to admin assignment if no matching moderator found
  - Skill-based routing system

- **User Management**

  - Role-based access control (User, Moderator, Admin)
  - Skill management for moderators
  - User authentication with JWT

- **Background Processing**
  - Event-driven architecture using Inngest
  - Automated email notifications
  - Asynchronous ticket processing

- **Production-Ready Architecture**
  - Separate hosting for frontend and backend
  - Scalable background job processing
  - Cloud-native deployment ready

## 🛠️ Tech Stack

- **Frontend**: React 19 with Vite, TailwindCSS, DaisyUI
- **Backend**: Node.js with Express 5
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Background Jobs**: Inngest
- **AI Integration**: Google Gemini API
- **Email**: Nodemailer with Mailtrap
- **Logging**: Pino for high-performance logging
- **Package Manager**: pnpm (monorepo workspace)
- **Build Tool**: Turbo for faster builds
- **Development**: Nodemon with hot-reload, Vite HMR

## 📋 Prerequisites

- Node.js (v14 or higher)
- pnpm (v8.0.0 or higher)
- MongoDB
- Clerk account and application
- Google Gemini API key
- Mailtrap account (for email testing)

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd intelliticket
   ```

2. **Install pnpm** (if not already installed)

   ```bash
   # Using npm
   npm install -g pnpm

   # Or using Corepack (recommended for Node.js 16.9+)
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

   This will install dependencies for all workspaces (root, client, and server).

4. **Clerk Setup**

   This application uses Clerk for authentication. Set up your Clerk account:

   a. **Create Clerk Account**
      - Go to [https://clerk.com](https://clerk.com) and create an account
      - Create a new application
      - Choose "React" as your frontend framework
      - Choose "Node.js" as your backend framework

   b. **Get Your Keys**
      - From your Clerk Dashboard, go to "API Keys"
      - Copy your Publishable Key and Secret Key
      - Set up webhooks (we'll configure this later)

   c. **Configure Environment Variables**
      - Update the `.env` files with your actual Clerk keys (see below)

5. **Environment Setup**

   Create environment files:

   **Root `.env`** (optional, for global configs):
   ```env
   NODE_ENV=development
   LOG_LEVEL=debug
   ```

   **Server `.env`** (`server/.env`):
   ```env
   # MongoDB
   MONGO_URI=your_mongodb_uri

   # JWT (Legacy - will be replaced by Clerk)
   JWT_SECRET=your_jwt_secret

   # Email (Mailtrap)
   MAILTRAP_SMTP_HOST=your_mailtrap_host
   MAILTRAP_SMTP_PORT=your_mailtrap_port
   MAILTRAP_SMTP_USER=your_mailtrap_user
   MAILTRAP_SMTP_PASS=your_mailtrap_password

   # AI (Gemini)
   GEMINI_API_KEY=your_gemini_api_key

   # Application
   APP_URL=http://localhost:3000
   PORT=3000

   # Clerk Authentication
   CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

   **Client `.env`** (`client/.env`):
   ```env
   VITE_SERVER_URL=http://localhost:3000/api
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   ```

## 🚀 Development

### Quick Start

```bash
# Start both client and server in development mode with Inngest (recommended)
pnpm dev

# Start only client and server (without Inngest)
pnpm dev:core

# Alternative: Start with Inngest explicitly
pnpm dev:inngest
```

**⚠️ Critical**: For full functionality, you need **BOTH** the Node.js server AND Inngest running. This is the default and primary way to run this application. Without Inngest, background processing (AI ticket analysis, email notifications, etc.) will not work.

The application will be available at:
- **Client**: http://localhost:5173
- **Server**: http://localhost:3000
- **Inngest Dashboard**: http://localhost:8288 (when using dev:inngest)

### Workspace-Specific Commands

```bash
# Run commands in specific workspace
pnpm --filter client dev    # Start only client
pnpm --filter server dev    # Start only server

# Or use shortcuts
pnpm c dev                  # Start client
pnpm s dev                  # Start server
```

## 🏗️ Production & Hosting

### Build

```bash
# Build both client and server
pnpm build

# Build individual services
pnpm build:client  # Frontend only
pnpm build:server  # Backend only
```

This will:
1. Build the React client (output: `client/dist`)
2. Prepare the server for production

### Start Production Server

```bash
# Start both in production mode
pnpm start

# Start individual services
pnpm start:client   # Frontend only
pnpm start:server   # Backend only
pnpm start:inngest  # Backend with Inngest
```

This runs:
- Server on port 3000
- Client preview on port 5173

## 🌐 Hosting & Deployment

### Recommended Architecture

This application is designed for **separate hosting** of frontend and backend:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Inngest       │
│   (Vercel)      │◄──►│   (Railway)     │◄──►│   (Cloud/Self)  │
│   - React SPA   │    │   - Express API │    │   - Background  │
│   - Static      │    │   - MongoDB     │    │   - Jobs        │
│   - CDN         │    │   - Clerk Auth  │    │   - Functions   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Hosting (Vercel/Netlify)

**Recommended**: Vercel or Netlify for static hosting

1. **Build Command**: `pnpm build:client`
2. **Output Directory**: `client/dist`
3. **Environment Variables**:
   ```env
   VITE_SERVER_URL=https://your-backend-url.com/api
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_key
   ```

### Backend Hosting (Railway/Render/DigitalOcean)

**Recommended**: Railway, Render, or DigitalOcean App Platform

1. **Build Command**: `pnpm build:server`
2. **Start Command**: `pnpm start:server`
3. **Environment Variables**:
   ```env
   NODE_ENV=production
   MONGO_URI=your_mongodb_uri
   CLERK_PUBLISHABLE_KEY=pk_live_your_key
   CLERK_SECRET_KEY=sk_live_your_key
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
   GEMINI_API_KEY=your_gemini_key
   INNGEST_EVENT_KEY=your_inngest_event_key
   ```

### Inngest Hosting Options

#### Option 1: Inngest Cloud (Recommended)
- **Cost**: ~$25/month
- **Setup**: 
  1. Deploy your backend to any platform
  2. Set `INNGEST_EVENT_KEY` environment variable
  3. Inngest automatically discovers functions via `/api/inngest` endpoint
- **Benefits**: Managed service, automatic scaling, monitoring

#### Option 2: Self-hosted Inngest
- **Cost**: Free (your server resources)
- **Setup**: Deploy Inngest dev server alongside your main server
- **Benefits**: Full control, no additional cost

### Deployment Steps

1. **Deploy Backend**:
   ```bash
   # Set up your hosting platform
   # Configure environment variables
   # Deploy with start command: pnpm start:server
   ```

2. **Deploy Frontend**:
   ```bash
   # Set up Vercel/Netlify
   # Configure build command: pnpm build:client
   # Set environment variables for API URL
   ```

3. **Configure Inngest**:
   - If using Inngest Cloud: Set `INNGEST_EVENT_KEY`
   - If self-hosting: Deploy Inngest dev server

4. **Update CORS**:
   - Update backend CORS to allow your frontend domain
   - Update Clerk webhook URLs to point to your backend

### Environment-Specific Configuration

#### Development
```bash
pnpm dev  # Starts all services locally
```

#### Production
```bash
# Frontend (Vercel/Netlify)
pnpm build:client

# Backend (Railway/Render)
pnpm build:server
pnpm start:server

# Inngest (Cloud or Self-hosted)
# Set INNGEST_EVENT_KEY for cloud
# Or run inngest:dev for self-hosted
```

## 📜 Scripts Reference

### Main Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start client, server, and Inngest in development mode (recommended) |
| `pnpm dev:core` | Start only client and server (without Inngest) |
| `pnpm dev:inngest` | Alternative way to start all services with Inngest |
| `pnpm build` | Build both client and server for production |
| `pnpm build:client` | Build only the frontend |
| `pnpm build:server` | Build only the backend |
| `pnpm start` | Start both client and server in production mode |
| `pnpm start:client` | Start only the frontend in production mode |
| `pnpm start:server` | Start only the backend in production mode |
| `pnpm start:inngest` | Start backend with Inngest support |
| `pnpm lint` | Run linters in all workspaces |
| `pnpm lint:fix` | Auto-fix linting issues |
| `pnpm test` | Run tests in all workspaces |
| `pnpm typecheck` | Run TypeScript type checking |

### Utility Scripts

| Script | Description |
|--------|-------------|
| `pnpm c <command>` | Run command in client workspace (e.g., `pnpm c add axios`) |
| `pnpm s <command>` | Run command in server workspace (e.g., `pnpm s add express`) |
| `pnpm install:all` | Install dependencies in all workspaces |
| `pnpm update:all` | Update dependencies recursively |
| `pnpm outdated` | Check for outdated dependencies |
| `pnpm clean` | Remove all node_modules |
| `pnpm clean:build` | Remove build artifacts |

### Workspace-Specific Examples

```bash
# Add a dependency to client
pnpm c add react-query

# Add a dev dependency to server
pnpm s add -D nodemon

# Run specific script in workspace
pnpm --filter client build
pnpm --filter server dev

# Install dependencies only for server
pnpm --filter server install
```

### Health Check

The server includes a health check endpoint for monitoring:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-10-01T12:00:00.000Z",
  "uptime": 123.456
}
```

## 📝 API Endpoints

### Authentication (Clerk-based)

- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update own profile (skills only)
- `GET /api/auth/users` - Get all users (Admin only)
- `PUT /api/auth/update-user` - Update user role & skills (Admin only)

### Webhooks

- `POST /api/webhooks/clerk` - Clerk webhook endpoint for user sync

### Tickets

- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets` - Get all tickets for logged-in user
- `GET /api/tickets/:id` - Get ticket details

### Legacy Endpoints (Deprecated)

- `POST /api/auth/signup` - Register a new user (deprecated)
- `POST /api/auth/login` - Login and get JWT token (deprecated)
- `POST /api/auth/logout` - Logout (deprecated)

## 🔄 Ticket Processing Flow

1. **Ticket Creation**

   - User submits a ticket with title and description
   - System creates initial ticket record

2. **AI Processing**

   - Inngest triggers `on-ticket-created` event
   - AI analyzes ticket content
   - Generates:
     - Required skills
     - Priority level
     - Helpful notes
     - Ticket type

3. **Moderator Assignment**

   - System searches for moderators with matching skills
   - Uses regex-based skill matching
   - Falls back to admin if no match found
   - Updates ticket with assignment

4. **Notification**
   - Sends email to assigned moderator
   - Includes ticket details and AI-generated notes

## 🧪 Testing

1. **Start the application with Inngest**

   ```bash
   pnpm dev:inngest
   ```

   This will start:
   - Client at http://localhost:5173
   - Server at http://localhost:3000
   - Inngest Dashboard at http://localhost:8288

2. **Test Health Check**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Test Ticket Creation**
   ```bash
   curl -X POST http://localhost:3000/api/tickets \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
   -d '{
     "title": "Database Connection Issue",
     "description": "Experiencing intermittent database connection timeouts"
   }'
   ```

4. **Run Tests**
   ```bash
   # Run all tests
   pnpm test

   # Run tests for specific workspace
   pnpm --filter client test
   pnpm --filter server test
   ```

## 🔍 Troubleshooting

### Common Issues

1. **pnpm Not Recognized**
   
   ```bash
   # Install pnpm globally
   npm install -g pnpm
   
   # Or enable Corepack
   corepack enable
   ```

2. **Port Conflicts**
   
   If you see "address already in use" error:

   ```bash
   # Check which ports are in use
   lsof -i :3000   # Server
   lsof -i :5173   # Client
   lsof -i :8288   # Inngest
   
   # Kill the process
   kill -9 <PID>
   ```

3. **Module Resolution Issues**
   
   If you encounter dependency issues:
   
   ```bash
   # Clean install
   pnpm clean
   rm -rf pnpm-lock.yaml
   pnpm install
   ```

4. **AI Processing Errors**

   - Verify `GEMINI_API_KEY` in server/.env
   - Check API quota and limits
   - Validate request format

5. **Email Issues**
   
   - Verify Mailtrap credentials in server/.env
   - Check SMTP settings
   - Monitor email delivery logs

6. **Build Failures**
   
   ```bash
   # Clear build cache
   pnpm clean:build
   
   # Clear Turbo cache
   rm -rf .turbo
   
   # Rebuild
   pnpm build
   ```

## 📁 Project Structure

```
intelliticket/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions (logger, etc.)
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Express middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── inngest/          # Background job definitions
│   ├── package.json
│   └── nodemon.json
├── package.json          # Root package.json with workspace scripts
├── pnpm-workspace.yaml  # pnpm workspace configuration
├── turbo.json           # Turbo build configuration
└── .env                 # Global environment variables
```

## 📚 Key Dependencies

### Server
- **Express** ^5.1.0 - Web framework
- **Mongoose** ^8.15.1 - MongoDB ODM
- **Inngest** ^3.38.0 - Background job processing
- **Pino** ^9.12.0 - High-performance logging
- **Clerk Backend** ^2.17.0 - Authentication & user management
- **Nodemailer** ^7.0.3 - Email sending

### Client
- **React** ^19.1.0 - UI framework
- **React Router** ^7.6.1 - Routing
- **Vite** ^6.3.5 - Build tool
- **TailwindCSS** ^4.1.8 - Styling
- **DaisyUI** ^5.0.42 - Component library
- **Clerk React** ^5.49.1 - Authentication components & hooks

### DevTools
- **Concurrently** ^9.1.2 - Run multiple commands
- **Turbo** ^2.5.8 - Build system
- **Nodemon** ^3.1.10 - Hot reload for server
- **ESLint** ^9.25.0 - Code linting

## ⚡ pnpm Features & Benefits

This project uses **pnpm** as the package manager for several advantages:

- **Disk Efficiency**: Shared dependencies across projects save disk space
- **Speed**: Faster installations with content-addressable storage
- **Strict**: Prevents phantom dependencies by default
- **Monorepo Support**: Built-in workspace support without extra configuration
- **Security**: Better dependency isolation

### Why pnpm?

- **3x faster** than npm for installation
- **Up to 50% less disk space** used
- **Better monorepo handling** with workspace protocol
- **Strict dependency resolution** prevents accidental bugs

## 🤝 Contributing

We don't accept contributions for this project, as this is a part of a video and code files need to be given as is.

## 📄 License

ISC

## 🙏 Acknowledgments

- **pnpm** for efficient package management
- **Turbo** for build optimization
- **Inngest** for background job processing
- **Google Gemini** for AI capabilities
- **Mailtrap** for email testing
- **MongoDB** for database
- **Vite** for blazing fast development
- **React 19** for modern UI development
