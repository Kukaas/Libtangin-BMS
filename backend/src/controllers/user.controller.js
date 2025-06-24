import User from '../models/user.model.js';
import Resident from '../models/residents.model.js';
import bcrypt from 'bcryptjs';

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

// Get all officials (secretary, treasurer, barangay captain)
export const getAllOfficials = async (req, res) => {
    try {
        const officials = await User.find({ role: { $in: ['secretary', 'treasurer', 'barangay_captain'] } }).lean();
        officials.forEach(o => { if (o.password) delete o.password; });
        res.status(200).json({ success: true, data: officials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch officials', error });
    }
};

// Get official by ID
export const getOfficialById = async (req, res) => {
    try {
        const official = await User.findById(req.params.id).lean();
        if (!official || !['secretary', 'treasurer', 'barangay_captain'].includes(official.role)) {
            return res.status(404).json({ success: false, message: 'Official not found' });
        }
        if (official.password) delete official.password;
        res.status(200).json({ success: true, data: official });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch official', error });
    }
};

// Create official
export const createOfficial = async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, password, role } = req.body;
        if (!['secretary', 'treasurer', 'barangay_captain'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            middleName,
            lastName,
            email,
            password: hashedPassword,
            role,
            isEmailVerified: true,
        });
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json({ success: true, data: userObj });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create official', error });
    }
};

// Update official
export const updateOfficial = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, middleName, lastName, email, password, role } = req.body;
        const official = await User.findById(id);
        if (!official || !['secretary', 'treasurer', 'barangay_captain'].includes(official.role)) {
            return res.status(404).json({ success: false, message: 'Official not found' });
        }
        if (role && !['secretary', 'treasurer', 'barangay_captain'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        if (firstName) official.firstName = firstName;
        if (middleName !== undefined) official.middleName = middleName;
        if (lastName) official.lastName = lastName;
        if (email) official.email = email;
        if (role) official.role = role;
        if (password) official.password = await bcrypt.hash(password, 10);
        await official.save();
        const userObj = official.toObject();
        delete userObj.password;
        res.status(200).json({ success: true, data: userObj });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update official', error });
    }
};

// Delete official
export const deleteOfficial = async (req, res) => {
    try {
        const { id } = req.params;
        const official = await User.findById(id);
        if (!official || !['secretary', 'treasurer', 'barangay_captain'].includes(official.role)) {
            return res.status(404).json({ success: false, message: 'Official not found' });
        }
        await official.deleteOne();
        res.status(200).json({ success: true, message: 'Official deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete official', error });
    }
};
