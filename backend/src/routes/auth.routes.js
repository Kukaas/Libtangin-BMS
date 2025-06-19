import express from "express";
import { registerResident, login, logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerResident);

router.post("/login", login)

router.post("/logout", protect, logout);

export default router;
