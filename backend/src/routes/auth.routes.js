import express from "express";
import { registerResident, login, logout, verifyEmail } from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerResident);

router.post("/login", login)

router.post("/logout", protect, logout);

router.get("/verify-email", verifyEmail);

export default router;
