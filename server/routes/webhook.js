import express from "express";
import { Webhook } from "svix";
import User from "../models/user.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Clerk webhook handler
router.post("/clerk", async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      logger.error("CLERK_WEBHOOK_SECRET is not set");
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    // Get headers
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      logger.error("Missing svix headers");
      return res.status(400).json({ error: "Missing svix headers" });
    }

    // Get the body
    const payload = JSON.stringify(req.body);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      logger.error("Webhook verification failed:", err);
      return res.status(400).json({ error: "Webhook verification failed" });
    }

    const { type, data } = evt;
    logger.info(`Received Clerk webhook: ${type}`);

    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;
      case "user.updated":
        await handleUserUpdated(data);
        break;
      case "user.deleted":
        await handleUserDeleted(data);
        break;
      default:
        logger.info(`Unhandled webhook type: ${type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error("Webhook handler error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// Handle user creation
async function handleUserCreated(data) {
  try {
    const { id, email_addresses, first_name, last_name, public_metadata } = data;
    
    // Check if user already exists
    const existingUser = await User.findOne({ clerkUserId: id });
    if (existingUser) {
      logger.info(`User already exists: ${id}`);
      return;
    }

    // Create new user
    const user = await User.create({
      clerkUserId: id,
      email: email_addresses?.[0]?.email_address || "",
      firstName: first_name || "",
      lastName: last_name || "",
      role: public_metadata?.role || "user",
      skills: public_metadata?.skills || [],
      lastSyncedAt: new Date(),
    });

    logger.info(`Created user from webhook: ${user.clerkUserId}`);
  } catch (error) {
    logger.error("Error creating user from webhook:", error);
  }
}

// Handle user updates
async function handleUserUpdated(data) {
  try {
    const { id, email_addresses, first_name, last_name, public_metadata } = data;
    
    const user = await User.findOne({ clerkUserId: id });
    if (!user) {
      logger.warn(`User not found for update: ${id}`);
      return;
    }

    // Update user info
    user.email = email_addresses?.[0]?.email_address || user.email;
    user.firstName = first_name || user.firstName;
    user.lastName = last_name || user.lastName;
    user.role = public_metadata?.role || user.role;
    user.skills = public_metadata?.skills || user.skills;
    user.lastSyncedAt = new Date();

    await user.save();
    logger.info(`Updated user from webhook: ${user.clerkUserId}`);
  } catch (error) {
    logger.error("Error updating user from webhook:", error);
  }
}

// Handle user deletion
async function handleUserDeleted(data) {
  try {
    const { id } = data;
    
    const user = await User.findOne({ clerkUserId: id });
    if (!user) {
      logger.warn(`User not found for deletion: ${id}`);
      return;
    }

    // Soft delete or hard delete based on your needs
    // For now, we'll just log it
    logger.info(`User deleted from Clerk: ${id}`);
    
    // Optionally, you can mark the user as deleted or remove them
    // await User.deleteOne({ clerkUserId: id });
  } catch (error) {
    logger.error("Error handling user deletion:", error);
  }
}

export default router;