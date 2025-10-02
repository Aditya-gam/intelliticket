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
    'https://*.netlify.app', // Netlify deployments
    'https://*.vercel.app', // Vercel deployments (backup)
    process.env.FRONTEND_URL, // Custom frontend URL if set
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    mongodb: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy'
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
