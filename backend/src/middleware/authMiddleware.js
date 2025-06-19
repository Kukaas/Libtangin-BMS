import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import User from "../models/user.model.js";

// @desc Verify JWT token and check if user is authenticated
// @access Private
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in cookies (safely)
        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        // Check for token in Authorization header (Bearer token)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, please login"
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, ENV.JWT_SECRET);

            // Get user from token
            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized, user not found"
                });
            }

            // Check if email is verified
            if (!user.isEmailVerified) {
                return res.status(401).json({
                    success: false,
                    message: "Please verify your email before accessing this resource"
                });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token expired"
                });
            }
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed"
            });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error in authentication"
        });
    }
};

// @desc Check if user has specific role
// @access Private
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no user found"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }

        next();
    };
};
