import User from '../models/user.model.js';
import Resident from '../models/residents.model.js';

// Get all users with resident info
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('residentId').lean();
        // Map residentId to 'resident' for frontend compatibility
        // Frontend should use: user.resident ? user.resident.firstName : user.firstName
        const usersWithResident = users.map(user => ({
            ...user,
            resident: user.residentId || null,
        }));
        res.status(200).json({ success: true, data: usersWithResident });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users', error });
    }
};

// Get user by ID with resident info
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('residentId').lean();
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        // Frontend should use: user.resident ? user.resident.firstName : user.firstName
        res.status(200).json({ success: true, data: { ...user, resident: user.residentId || null } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch user', error });
    }
};

// Verify user document (for secretary)
export const verifyUserDocument = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.documentVerified = true;
        await user.save();
        res.status(200).json({ success: true, message: 'User document verified' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to verify document', error });
    }
};
