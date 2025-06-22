import express from 'express';
import { protect, secretaryOrAdmin } from '../middleware/authMiddleware.js';
import {
    getAllResidents,
    createResident,
    updateResident,
    deleteResident
} from '../controllers/resident.controller.js';

const router = express.Router();

router.get("/", protect, secretaryOrAdmin, getAllResidents);
router.post("/", protect, secretaryOrAdmin, createResident);
router.put("/:id", protect, secretaryOrAdmin, updateResident);
router.delete("/:id", protect, secretaryOrAdmin, deleteResident);

export default router;
