import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Eye, EyeOff, Lock, ArrowLeft, Shield, Mail } from 'lucide-react';
import Form from '../components/custom/Form';
import FormInput from '../components/custom/FormInput';
import ResponsiveCard from '../components/custom/ResponsiveCard';
import Alert from '../components/custom/Alert';
import { resetPasswordSchema } from '../lib/validation';
import { authAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'sonner';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [userEmail, setUserEmail] = useState('');
    const [otpValue, setOtpValue] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                toast.error('Invalid reset link');
                navigate('/login');
                return;
            }

            try {
                const response = await authAPI.verifyResetToken(token);

                if (response && response.success && response.email) {
                    setUserEmail(response.email);
                    setIsVerifying(false);
                } else {
                    throw new Error('Invalid response structure');
                }
            } catch (error) {
                console.error('Token verification error:', error);
                toast.error('Invalid or expired reset link');
                navigate('/login');
            }
        };

        verifyToken();
    }, [token, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        try {
            resetPasswordSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            const newErrors = {};
            if (error && error.errors && Array.isArray(error.errors)) {
                error.errors.forEach(err => {
                    if (err.path && err.path[0]) {
                        newErrors[err.path[0]] = err.message;
                    }
                });
            }
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!otpValue || otpValue.length !== 6) {
            setErrors(prev => ({
                ...prev,
                otp: 'Please enter the 6-digit code from your email'
            }));
            return;
        }

        setIsLoading(true);

        try {
            await authAPI.resetPassword({
                email: userEmail,
                resetCode: otpValue,
                resetToken: token,
                newPassword: formData.password
            });

            setIsSuccess(true);
            toast.success('Password reset successfully!');
        } catch (error) {
            console.error('Reset password error:', error);
            setErrors({
                password: error.message || 'Failed to reset password. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-16 px-4">
                    <div className="w-full max-w-md">
                        <ResponsiveCard
                            title="Verifying Reset Link"
                            description="Please wait while we verify your reset link..."
                        >
                            <div className="flex items-center justify-center py-8">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        </ResponsiveCard>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-16 px-4">
                    <div className="w-full max-w-md">
                        <ResponsiveCard
                            title="Password Reset Successful"
                            description="Your password has been reset successfully"
                        >
                            <Alert
                                variant="success"
                                title="Password Updated"
                                className="mb-6"
                            >
                                Your password has been successfully reset. You can now sign in with your new password.
                            </Alert>

                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                            >
                                Sign In
                            </Button>
                        </ResponsiveCard>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-16 px-4">
                <div className="w-full max-w-md">
                    <ResponsiveCard
                        title="Reset Password"
                        description="Enter the 6-digit code from your email and create a new password"
                    >
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">
                                        Reset Code Sent
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        We sent a 6-digit code to {userEmail}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* OTP Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Enter 6-digit Code
                                    </label>
                                    <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
                                        {Array.from({ length: 6 }, (_, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength={1}
                                                className="w-10 h-12 sm:w-12 sm:h-12 text-center border border-slate-300 rounded-md focus:border-blue-500 focus:ring-blue-500 text-lg font-semibold flex-1 max-w-[60px] sm:max-w-none"
                                                value={otpValue[index] || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length <= 1) {
                                                        const newOtp = otpValue.split('');
                                                        newOtp[index] = value;
                                                        const newOtpValue = newOtp.join('');
                                                        setOtpValue(newOtpValue);

                                                        // Auto-focus next input
                                                        if (value && index < 5) {
                                                            const nextInput = e.target.parentNode.children[index + 1];
                                                            if (nextInput) nextInput.focus();
                                                        }

                                                        // Clear error when typing
                                                        if (errors.otp) {
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                otp: ''
                                                            }));
                                                        }
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    // Handle backspace
                                                    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
                                                        const prevInput = e.target.parentNode.children[index - 1];
                                                        if (prevInput) prevInput.focus();
                                                    }
                                                }}
                                                onPaste={(e) => {
                                                    e.preventDefault();
                                                    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
                                                    if (/^\d{6}$/.test(pastedData)) {
                                                        setOtpValue(pastedData);
                                                        if (errors.otp) {
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                otp: ''
                                                            }));
                                                        }
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {errors.otp && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                                            {errors.otp}
                                        </p>
                                    )}
                                </div>

                                {/* Password Input */}
                                <FormInput
                                    label="New Password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="Enter your new password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={errors.password}
                                    icon={Lock}
                                    endIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    }
                                />

                                {/* Confirm Password Input */}
                                <FormInput
                                    label="Confirm New Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="Confirm your new password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    error={errors.confirmPassword}
                                    icon={Lock}
                                    endIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    }
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-6"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Resetting Password...
                                    </div>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </Form>

                        <div className="mt-6">
                            <Separator className="my-4" />
                            <div className="text-center">
                                <p className="text-slate-600 text-sm">
                                    Remember your password?{' '}
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                    >
                                        Sign in here
                                    </button>
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">
                                        Secure Reset
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Your new password is protected with industry-standard encryption
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ResponsiveCard>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ResetPassword;
