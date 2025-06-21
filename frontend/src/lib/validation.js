import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

// Signup validation schema (updated for resident search flow)
export const signupSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Legacy signup schema (for reference)
export const legacySignupSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
    phoneNumber: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^(\+63|0)9\d{9}$/, 'Please enter a valid Philippine phone number'),
    address: z
        .string()
        .min(1, 'Address is required')
        .min(10, 'Address must be at least 10 characters'),
    barangay: z
        .string()
        .min(1, 'Barangay is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
});

// Reset password validation schema
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Contact form validation schema
export const contactSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    message: z
        .string()
        .min(1, 'Message is required')
        .min(10, 'Message must be at least 10 characters'),
});
