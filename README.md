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

## 🛠️ Tech Stack

- **Frontend**: React 19 with Vite, TailwindCSS, DaisyUI
- **Backend**: Node.js with Express 5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
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

4. **Environment Setup**

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

   # JWT
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
   ```

   **Client `.env`** (`client/.env`) - if needed:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

## 🚀 Development

### Quick Start

```bash
# Start both client and server in development mode
pnpm dev

# Start with Inngest dev server (recommended for full functionality)
pnpm dev:inngest
```

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

## 🏗️ Production

### Build

```bash
# Build both client and server
pnpm build
```

This will:
1. Build the React client (output: `client/dist`)
2. Prepare the server for production

### Start Production Server

```bash
# Start both in production mode
pnpm start
```

This runs:
- Server on port 3000
- Client preview on port 5173

## 📜 Scripts Reference

### Main Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start client and server in development mode with hot-reload |
| `pnpm dev:inngest` | Start client, server, and Inngest dev server |
| `pnpm build` | Build both client and server for production |
| `pnpm start` | Start production build |
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

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Tickets

- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets` - Get all tickets for logged-in user
- `GET /api/tickets/:id` - Get ticket details

### Admin

- `GET /api/auth/users` - Get all users (Admin only)
- `POST /api/auth/update-user` - Update user role & skills (Admin only)

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
- **JWT** ^9.0.2 - Authentication
- **Bcrypt** ^6.0.0 - Password hashing
- **Nodemailer** ^7.0.3 - Email sending

### Client
- **React** ^19.1.0 - UI framework
- **React Router** ^7.6.1 - Routing
- **Vite** ^6.3.5 - Build tool
- **TailwindCSS** ^4.1.8 - Styling
- **DaisyUI** ^5.0.42 - Component library

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
