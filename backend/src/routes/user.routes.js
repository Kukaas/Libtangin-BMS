import express from 'express';
import { getAllUsers, getUserById, verifyUserDocument } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id/verify-document', verifyUserDocument);

export default router;
