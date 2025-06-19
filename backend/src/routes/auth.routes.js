import express from "express";
import { registerResident } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerResident);

export default router;
