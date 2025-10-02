import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { serve } from "inngest/express";
import pinoHttp from "pino-http";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import webhookRoutes from "./routes/webhook.js";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middlewares/error-handler.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(pinoHttp({ logger }));
// Configure CORS for Netlify frontend
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
    'https://unrivaled-daifuku-2c910e.netlify.app', // Your specific Netlify URL
    'https://*.netlify.app', // All Netlify deployments
    'https://*.vercel.app', // Vercel deployments (backup)
    process.env.FRONTEND_URL, // Custom frontend URL if set
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

// Add CORS debugging middleware
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    logger.info(`CORS preflight request from: ${req.headers.origin}`);
    logger.info(`Requested method: ${req.headers['access-control-request-method']}`);
    logger.info(`Requested headers: ${req.headers['access-control-request-headers']}`);
  }
  next();
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    mongodb: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
    environment: {
      gemini_api_key: !!process.env.GEMINI_API_KEY,
      inngest_event_key: !!process.env.INNGEST_EVENT_KEY,
      inngest_signing_key: !!process.env.INNGEST_SIGNING_KEY,
      node_env: process.env.NODE_ENV
    }
  });
});

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/webhooks", webhookRoutes);

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreated],
  })
);

// Error handler middleware (must be last)
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected ✅");
    app.listen(PORT, () => logger.info(`🚀 Server at http://localhost:${PORT}`));
  })
  .catch((err) => {
    logger.error("❌ MongoDB connection failed:", err.message);
    logger.error("Make sure MONGO_URI environment variable is set correctly");
    
    // Start server anyway for health checks, but log the error
    app.listen(PORT, () => {
      logger.warn(`🚀 Server started at http://localhost:${PORT} but MongoDB connection failed`);
    });
  });
