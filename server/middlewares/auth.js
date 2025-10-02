import { verifyToken } from "@clerk/backend";
import User from "../models/user.js";
import { logger } from "../utils/logger.js";

// Clerk authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    // Get the session token from Authorization header
    const sessionToken = req.headers.authorization?.replace("Bearer ", "");
    
    if (!sessionToken) {
      return res.status(401).json({ error: "No session token provided" });
    }

    // Verify the session token with Clerk
    const payload = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload) {
      return res.status(401).json({ error: "Invalid session token" });
    }

    // Get or create user in our database
    let user = await User.findOne({ clerkUserId: payload.sub });
    
    if (!user) {
      // Create new user if they don't exist in our database
      user = await User.create({
        clerkUserId: payload.sub,
        email: payload.email_addresses?.[0]?.email_address || "",
        firstName: payload.first_name || "",
        lastName: payload.last_name || "",
        role: payload.public_metadata?.role || "user",
        skills: payload.public_metadata?.skills || [],
        lastSyncedAt: new Date(),
      });
      
      logger.info(`Created new user from Clerk: ${user.clerkUserId}`);
    } else {
      // Update user info from Clerk if needed
      const needsUpdate = 
        user.email !== payload.email_addresses?.[0]?.email_address ||
        user.firstName !== payload.first_name ||
        user.lastName !== payload.last_name;

      if (needsUpdate) {
        user.email = payload.email_addresses?.[0]?.email_address || user.email;
        user.firstName = payload.first_name || user.firstName;
        user.lastName = payload.last_name || user.lastName;
        user.lastSyncedAt = new Date();
        await user.save();
        
        logger.info(`Updated user from Clerk: ${user.clerkUserId}`);
      }
    }

    // Attach user info to request
    req.user = {
      _id: user._id,
      clerkUserId: user.clerkUserId,
      email: user.email,
      role: user.role,
      skills: user.skills,
    };

    next();
  } catch (error) {
    logger.error("Clerk authentication error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

// Export the Clerk authentication middleware
export { authenticate as default };
