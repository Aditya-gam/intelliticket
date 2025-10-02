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
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
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
  .catch((err) => logger.error("❌ MongoDB error: ", err));
