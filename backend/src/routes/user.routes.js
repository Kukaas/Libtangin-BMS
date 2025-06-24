import express from 'express';
import { getAllUsers, getUserById, verifyUserDocument, getAllOfficials, getOfficialById, createOfficial, updateOfficial, deleteOfficial } from '../controllers/user.controller.js';

const router = express.Router();

// Officials management (admin) - must come before /:id
router.get('/officials', getAllOfficials);
router.get('/officials/:id', getOfficialById);
router.post('/officials', createOfficial);
router.put('/officials/:id', updateOfficial);
router.delete('/officials/:id', deleteOfficial);

// Regular user routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id/verify-document', verifyUserDocument);

export default router;
