import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/user.model.js";
import Resident from "../models/residents.model.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/emailService.js";
import {
    generateAccessToken,
    generateRefreshToken
} from "../middleware/generateToken.js";

// @desc Register a resident
// @route POST /api/auth/register
// @access Public
export const registerResident = async (req, res) => {
    try {
        const { firstName, middleName, lastName, birthDate, email, password } = req.body;

        // 1. Find resident by name and birthDate
        const resident = await Resident.findOne({
            firstName,
            lastName,
            birthDate: new Date(birthDate),
        });

        if (!resident) {
            return res.status(404).json({ message: "Resident not found. Please contact barangay staff." });
        }

        // 2. Check if resident already has a user
        if (resident.userId) {
            return res.status(400).json({ message: "Resident already has an account." });
        }

        // 3. Check if email is already used
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // 4. Create user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString("hex");

        // Expires in 24 hrs
        const emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = await User.create({
            firstName,
            middleName,
            lastName,
            email,
            password: hashedPassword,
            role: "resident",
            emailVerificationToken,
            emailVerificationTokenExpires,
        });

        // 5. Link user to resident
        resident.userId = user._id;
        resident.isVerified = true;
        await resident.save();

        // 6. Send verification email
        const emailResult = await sendVerificationEmail({
            email,
            firstName,
            verificationToken: emailVerificationToken,
        });

        if (!emailResult.success) {
            console.error("Failed to send verification email:", emailResult.error);
            // Don't return error to client, continue with registration
        }

        // 7. Generate tokens
        generateAccessToken(res, user._id);
        generateRefreshToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            residentId: resident._id,
            emailVerificationToken,
            message: "Registration successful! Please check your email to verify your account.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Registration failed." });
    }
};


// @desc Login to the system
// @route POST /api/auth/login
// @access Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2. Find user and populate resident data
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email before logging in"
            });
        }

        // 4. Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 5. Get resident data if user is a resident
        let residentData = null;
        if (user.role === "resident") {
            residentData = await Resident.findOne({ userId: user._id });
        }

        // 6. Generate tokens
        generateAccessToken(res, user._id);
        generateRefreshToken(res, user._id);

        // 7. Send response without password
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                resident: residentData
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login. Please try again."
        });
    }
};


// @desc Logout of the system
// @route POST /api/auth/logout
// @access Private
export const logout = async (req, res) => {
    try {
        // Clear cookies
        res.cookie('accessToken', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV !== "development",
        });

        res.cookie('refreshToken', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV !== "development",
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during logout"
        });
    }
};

// @desc Verify email
// @route GET /api/auth/verify-email
// @access Public
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required"
            });
        }

        // Find user with matching token and token not expired
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
        }

        // Update user
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during email verification"
        });
    }
};

// @desc Forgot password - send reset code
// @route POST /api/auth/forgot-password
// @access Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists or not for security
            return res.status(200).json({
                success: true,
                message: "This email doesn't exist, please check your email and try again"
            });
        }

        // Generate 6-digit reset code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiration to 10 minutes
        const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Save reset code to user
        user.passwordResetCode = resetCode;
        user.passwordResetCodeExpires = resetCodeExpires;
        await user.save();

        // Send reset email
        const emailResult = await sendPasswordResetEmail({
            email: user.email,
            firstName: user.firstName,
            resetCode: resetCode,
        });

        if (!emailResult.success) {
            console.error("Failed to send password reset email:", emailResult.error);
            return res.status(500).json({
                success: false,
                message: "Failed to send password reset email. Please try again."
            });
        }

        res.status(200).json({
            success: true,
            message: "A code has been sent to you email!"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred. Please try again."
        });
    }
};

// @desc Reset password with code
// @route POST /api/auth/reset-password
// @access Public
export const resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;

        if (!email || !resetCode || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, reset code, and new password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or reset code"
            });
        }

        // Check if reset code matches and is not expired
        if (user.passwordResetCode !== resetCode ||
            user.passwordResetCodeExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset code"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear reset code
        user.password = hashedPassword;
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred. Please try again."
        });
    }
};


