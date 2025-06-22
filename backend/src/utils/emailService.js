import nodemailer from "nodemailer";
import { ENV } from "../config/env.js"

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_APP_PASSWORD
    },
});

// Verify transporter connection
const verifyConnection = async () => {
    try {
        await transporter.verify();
        console.log("Email service is ready");
        return true;
    } catch (error) {
        console.error("Email service configuration error:", error);
        return false;
    }
};

// Call verify on startup
verifyConnection();

// Modern, minimalist email template
const createEmailTemplate = ({ firstName, verificationLink }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Modern, minimalist styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #22c55e;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Libtangin BMS</div>
        </div>

        <p>Hello ${firstName},</p>

        <p>Welcome to Libtangin Barangay Management System! Please verify your email address to complete your registration.</p>

        <p style="text-align: center;">
            <a href="${verificationLink}" class="button" style="color: #ffffff; text-decoration: none;">Verify Email Address</a>
        </p>

        <p>This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>

        <div class="footer">
            <p>© ${new Date().getFullYear()} Libtangin BMS. All rights reserved.</p>
            <p>Barangay Libtangin, Philippines</p>
        </div>
    </div>
</body>
</html>
`;

// Modern, minimalist email template for password reset
const createPasswordResetTemplate = ({ firstName, resetCode, resetToken }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Modern, minimalist styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 10px;
        }
        .reset-code {
            background-color: #f3f4f6;
            border: 2px solid #22c55e;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            font-size: 32px;
            font-weight: bold;
            color: #22c55e;
            letter-spacing: 4px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #22c55e;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Libtangin BMS</div>
        </div>

        <p>Hello ${firstName},</p>

        <p>We received a request to reset your password for your Libtangin BMS account. Use the following 6-digit code to reset your password:</p>

        <div class="reset-code">${resetCode}</div>

        <p style="text-align: center;">
            <a href="${ENV.FRONTEND_URL}/reset-password?token=${resetToken}" class="button" style="color: #ffffff; text-decoration: none;">Reset Password</a>
        </p>

        <p>This code and link will expire in 10 minutes. If you didn't request a password reset, you can safely ignore this email.</p>

        <div class="footer">
            <p>© ${new Date().getFullYear()} Libtangin BMS. All rights reserved.</p>
            <p>Barangay Libtangin, Philippines</p>
        </div>
    </div>
</body>
</html>
`;

// Send verification email
export const sendVerificationEmail = async ({ email, firstName, verificationToken }) => {
    try {
        // Check if email configuration is valid
        if (!ENV.EMAIL_USER || !ENV.EMAIL_APP_PASSWORD) {
            throw new Error("Email configuration is missing. Please check your environment variables.");
        }

        const verificationLink = `${ENV.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: `"Libtangin BMS" <${ENV.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Email Address",
            html: createEmailTemplate({ firstName, verificationLink }),
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending verification email:", error.message);
        return {
            success: false,
            error: error.message,
            details: "Please check your email configuration (EMAIL_USER and EMAIL_APP_PASSWORD)"
        };
    }
};

// Send password reset email
export const sendPasswordResetEmail = async ({ email, firstName, resetCode, resetToken }) => {
    try {
        // Check if email configuration is valid
        if (!ENV.EMAIL_USER || !ENV.EMAIL_APP_PASSWORD) {
            throw new Error("Email configuration is missing. Please check your environment variables.");
        }

        const mailOptions = {
            from: `"Libtangin BMS" <${ENV.EMAIL_USER}>`,
            to: email,
            subject: "Reset Your Password",
            html: createPasswordResetTemplate({ firstName, resetCode, resetToken }),
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending password reset email:", error.message);
        return {
            success: false,
            error: error.message,
            details: "Please check your email configuration (EMAIL_USER and EMAIL_APP_PASSWORD)"
        };
    }
};
