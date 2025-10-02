import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Clerk user ID - primary identifier
  clerkUserId: { type: String, required: true, unique: true, index: true },
  
  // Basic user info (synced from Clerk)
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  
  // Application-specific fields
  role: { type: String, default: "user", enum: ["user", "moderator", "admin"] },
  skills: [String],
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Clerk sync status
  lastSyncedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("User", userSchema);
