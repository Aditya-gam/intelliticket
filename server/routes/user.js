import express from "express";
import {
  getUsers,
  getProfile,
  updateUser,
  updateProfile,
} from "../controllers/user.js";

import { authenticate } from "../middlewares/auth.js";
const router = express.Router();

// Clerk-based endpoints
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.get("/users", authenticate, getUsers);
router.put("/update-user", authenticate, updateUser);

export default router;
