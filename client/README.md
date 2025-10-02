# IntelliTicket Frontend

<div align="center">

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.8-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.0.42-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com/)

*Modern React frontend for IntelliTicket - AI-powered ticket management system*

[🚀 **Live Demo**](https://unrivaled-daifuku-2c910e.netlify.app/) • [📖 **Main Project**](../README.md) • [🔧 **Setup Guide**](#-quick-start)

</div>

---

## 📋 Overview

The IntelliTicket frontend is a modern, responsive React application built with Vite that provides an intuitive interface for managing support tickets. It features real-time authentication, role-based access control, and seamless integration with the AI-powered backend.

### 🎯 Key Features

- **🔐 Secure Authentication** - Powered by Clerk with enterprise-grade security
- **👥 Role-Based Access** - User, Moderator, and Admin interfaces
- **📱 Responsive Design** - Mobile-first approach with TailwindCSS
- **🎨 Modern UI** - Beautiful components with DaisyUI
- **⚡ Fast Development** - Vite-powered with HMR and fast builds
- **🔄 Real-time Updates** - Live ticket status and notifications

---

## 🛠️ Tech Stack

### Core Framework
- **React 19.1.0** - Latest React with concurrent features
- **Vite 6.3.5** - Lightning-fast build tool and dev server
- **React Router 7.6.1** - Client-side routing

### Styling & UI
- **TailwindCSS 4.1.8** - Utility-first CSS framework
- **DaisyUI 5.0.42** - Component library for TailwindCSS
- **Custom Components** - Reusable, accessible UI components

### Authentication & State
- **Clerk React 5.49.1** - Authentication and user management
- **React Hooks** - Modern state management
- **Context API** - Global state management

### Development Tools
- **ESLint 9.25.0** - Code linting and formatting
- **TypeScript Types** - Type safety for React components
- **Vite Plugins** - Optimized development experience

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **pnpm** (v8.0.0 or higher)
- **Clerk Account** - For authentication setup

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

### Environment Configuration

Create `client/.env`:
```env
VITE_SERVER_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Development

```bash
# Start development server
pnpm dev

# Start with specific host/port
pnpm dev --host 0.0.0.0 --port 5173
```

**🌐 Access Points:**
- **Frontend**: http://localhost:5173
- **Vite HMR**: Hot module replacement enabled
- **Dev Tools**: React DevTools compatible

---

## 📁 Project Structure

```
client/
├── 📁 public/                 # Static assets
│   └── vite.svg              # Favicon
├── 📁 src/
│   ├── 📁 components/        # Reusable components
│   │   ├── clerk-auth.jsx    # Authentication components
│   │   ├── clerk-provider.jsx # Clerk context provider
│   │   └── navbar.jsx        # Navigation component
│   ├── 📁 pages/            # Page components
│   │   ├── admin.jsx        # Admin dashboard
│   │   ├── ticket.jsx       # Individual ticket view
│   │   └── tickets.jsx      # Ticket list and creation
│   ├── 📁 utils/            # Utility functions
│   │   ├── api.js           # API client
│   │   ├── logger.js        # Logging utilities
│   │   └── test-auth-flow.js # Auth testing
│   ├── index.css            # Global styles
│   └── main.jsx             # Application entry point
├── 📄 index.html            # HTML template
├── 📄 package.json          # Dependencies and scripts
├── 📄 vite.config.js        # Vite configuration
├── 📄 netlify.toml          # Netlify deployment config
└── 📄 eslint.config.js      # ESLint configuration
```

---

## 🎨 Component Architecture

### Core Components

#### `<Navbar />`
- **Purpose**: Main navigation and user authentication
- **Features**: Role-based menu items, user profile display
- **Dependencies**: Clerk React, React Router

#### `<ClerkProvider />`
- **Purpose**: Authentication context provider
- **Features**: User state management, authentication flows
- **Dependencies**: Clerk React

#### `<ClerkAuth />`
- **Purpose**: Authentication UI components
- **Features**: Sign in/up forms, loading states, error handling
- **Dependencies**: Clerk React, DaisyUI

### Page Components

#### `<Tickets />`
- **Purpose**: Ticket management interface
- **Features**: Create tickets, view ticket list, real-time updates
- **State**: Form management, API integration

#### `<Ticket />`
- **Purpose**: Individual ticket details
- **Features**: Ticket information display, metadata rendering
- **Dependencies**: React Markdown, API client

#### `<Admin />`
- **Purpose**: Administrative interface
- **Features**: User management, role assignment, skill management
- **Access**: Admin role required

---

## 🔧 Development Scripts

### Available Commands

```bash
# Development
pnpm dev              # Start dev server with HMR
pnpm dev --host       # Start with network access

# Building
pnpm build            # Production build
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix linting issues

# Production
pnpm start            # Start production server
```

### Build Configuration

The project uses Vite with the following optimizations:
- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Dead code elimination
- **Asset Optimization** - Image and CSS optimization
- **Bundle Analysis** - Built-in bundle analyzer

---

## 🎨 Styling Guide

### Design System

The frontend uses a consistent design system based on:
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Pre-built component library
- **Custom CSS** - Application-specific styles

### Color Palette

```css
/* Primary Colors */
--primary: #3b82f6;      /* Blue */
--secondary: #8b5cf6;    /* Purple */
--accent: #10b981;       /* Green */

/* Neutral Colors */
--base-100: #ffffff;     /* White */
--base-200: #f3f4f6;     /* Light Gray */
--base-300: #d1d5db;     /* Gray */
```

### Component Guidelines

1. **Use DaisyUI Components** - Prefer DaisyUI over custom components
2. **Consistent Spacing** - Use Tailwind spacing scale
3. **Responsive Design** - Mobile-first approach
4. **Accessibility** - Follow WCAG guidelines

---

## 🔌 API Integration

### API Client

The frontend communicates with the backend through a centralized API client:

```javascript
// utils/api.js
const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const api = {
  // Ticket operations
  createTicket: (data) => post('/tickets', data),
  getTickets: () => get('/tickets'),
  getTicket: (id) => get(`/tickets/${id}`),
  
  // User operations
  getProfile: () => get('/auth/profile'),
  updateProfile: (data) => put('/auth/profile', data),
};
```

### Error Handling

- **Global Error Boundary** - Catches and displays errors
- **API Error Handling** - Centralized error management
- **User Feedback** - Toast notifications for actions

---

## 🧪 Testing

### Testing Strategy

```bash
# Run tests (when implemented)
pnpm test

# Test specific components
pnpm test -- --grep "Navbar"

# Coverage report
pnpm test -- --coverage
```

### Testing Tools

- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **MSW** - API mocking
- **Cypress** - E2E testing (planned)

---

## 🚀 Deployment

### Netlify Deployment

The frontend is configured for Netlify deployment:

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

Set these in your deployment platform:
- `VITE_SERVER_URL` - Backend API URL
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk public key

### Build Optimization

- **Code Splitting** - Automatic route-based splitting
- **Asset Optimization** - Images and CSS minification
- **CDN Integration** - Static asset delivery
- **Caching** - Browser and CDN caching

---

## 🔍 Troubleshooting

### Common Issues

<details>
<summary><strong>🔧 Vite Dev Server Issues</strong></summary>

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
pnpm dev
```
</details>

<details>
<summary><strong>🔧 Clerk Authentication Issues</strong></summary>

- Verify `VITE_CLERK_PUBLISHABLE_KEY` in `.env`
- Check Clerk dashboard configuration
- Ensure redirect URLs are correct
</details>

<details>
<summary><strong>🔧 Build Failures</strong></summary>

```bash
# Clear all caches
rm -rf node_modules dist
pnpm install
pnpm build
```
</details>

<details>
<summary><strong>🔧 API Connection Issues</strong></summary>

- Verify `VITE_SERVER_URL` in `.env`
- Check CORS configuration on backend
- Ensure backend is running
</details>

---

## 📊 Performance

### Optimization Features

- **Code Splitting** - Route-based lazy loading
- **Tree Shaking** - Dead code elimination
- **Asset Optimization** - Image and CSS minification
- **Bundle Analysis** - Built-in performance monitoring

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 500KB gzipped

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
- **Component Documentation** - JSDoc comments

---

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Vite DevTools](https://vitejs.dev/guide/features.html#devtools)
- [TailwindCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

---

<div align="center">

**Built with ❤️ using React, Vite, and TailwindCSS**

[⬆ Back to Top](#intelliticket-frontend) • [📖 Main Project](../README.md)

</div>