import User from "../models/user.js";
import { inngest } from "../inngest/client.js";
import { logger } from "../utils/logger.js";

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-__v");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      id: user._id,
      clerkUserId: user.clerkUserId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      skills: user.skills,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    logger.error("Error getting user profile:", error);
    res.status(500).json({ error: "Failed to get profile", details: error.message });
  }
};

// Update user profile (skills, role - for admins)
export const updateUser = async (req, res) => {
  const { skills = [], role, clerkUserId } = req.body;
  
  try {
    // Only admins can update other users
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Find user by clerkUserId or email
    const user = await User.findOne(
      clerkUserId ? { clerkUserId } : { email: req.body.email }
    );
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user
    const updateData = {};
    if (skills.length > 0) updateData.skills = skills;
    if (role) updateData.role = role;

    await User.updateOne(
      { _id: user._id },
      updateData
    );

    logger.info(`Updated user ${user.clerkUserId} by admin ${req.user.clerkUserId}`);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    logger.error("Error updating user:", error);
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};

// Get all users (admin only)
export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const users = await User.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    const formattedUsers = users.map(user => ({
      id: user._id,
      clerkUserId: user.clerkUserId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      skills: user.skills,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastSyncedAt: user.lastSyncedAt,
    }));

    res.json(formattedUsers);
  } catch (error) {
    logger.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to get users", details: error.message });
  }
};

// Update own profile (skills only for non-admins)
export const updateProfile = async (req, res) => {
  const { skills = [] } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Users can only update their own skills
    user.skills = skills;
    await user.save();

    logger.info(`Updated profile for user ${user.clerkUserId}`);
    res.json({ 
      message: "Profile updated successfully",
      skills: user.skills 
    });
  } catch (error) {
    logger.error("Error updating profile:", error);
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};
