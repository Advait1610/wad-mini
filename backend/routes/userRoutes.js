import express from "express";
import {
  authUser,
  forgotPassword,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/forgot-password", forgotPassword);
router.route("/profile").post(protect, updateUserProfile);

export default router;
