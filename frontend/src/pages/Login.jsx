import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import Form from '../components/custom/Form';
import FormInput from '../components/custom/FormInput';
import ResponsiveCard from '../components/custom/ResponsiveCard';
import ResponsiveDialog from '../components/custom/ResponsiveDialog';
import Alert from '../components/custom/Alert';
import { loginSchema } from '../lib/validation';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'sonner';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');
    const [showVerificationAlert, setShowVerificationAlert] = useState(
        location.state?.fromSignup || false
    );

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
            loginSchema.parse(formData);
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

        setIsLoading(true);

        try {
            await login(formData);
            toast.success('Login successful!');

            // Redirect to the page they were trying to access, or dashboard
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                email: error.message || 'Invalid email or password'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!forgotPasswordEmail) {
            setForgotPasswordError('Email is required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
            setForgotPasswordError('Please enter a valid email address');
            return;
        }

        try {
            // TODO: Implement forgot password API call
            console.log('Forgot password for:', forgotPasswordEmail);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setShowForgotPassword(false);
            setForgotPasswordEmail('');
            setForgotPasswordError('');

            toast.success('Password reset link sent to your email');
        } catch (error) {
            console.error('Forgot password error:', error);
            setForgotPasswordError('Failed to send reset link. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-16 px-4">
                <div className="w-full max-w-md">
                    <ResponsiveCard
                        title="Welcome Back"
                        description="Sign in to your account to access barangay services"
                    >
                        {/* Email Verification Alert */}
                        {showVerificationAlert && (
                            <Alert
                                variant="info"
                                title="Email Verification Required"
                                className="mb-6"
                                showCloseButton
                                onClose={() => setShowVerificationAlert(false)}
                            >
                                Please check your email and click the verification link to activate your account before signing in.
                            </Alert>
                        )}
                        <Form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <FormInput
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={errors.email}
                                    icon={Mail}
                                />

                                <FormInput
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={errors.password}
                                    icon={Lock}
                                    endIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Sign In
                                        <ArrowRight size={16} />
                                    </div>
                                )}
                            </Button>
                        </Form>

                        <div className="mt-6">
                            <Separator className="my-4" />
                            <div className="text-center">
                                <p className="text-slate-600 text-sm">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/signup"
                                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                    >
                                        Sign up here
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">
                                        Secure Login
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Your information is protected with industry-standard encryption
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ResponsiveCard>
                </div>
            </main>

            {/* Forgot Password Dialog */}
            <ResponsiveDialog
                open={showForgotPassword}
                onOpenChange={setShowForgotPassword}
                title="Reset Password"
                description="Enter your email address and we'll send you a link to reset your password"
            >
                <Form onSubmit={handleForgotPassword}>
                    <FormInput
                        label="Email Address"
                        type="email"
                        name="forgotPasswordEmail"
                        id="forgotPasswordEmail"
                        placeholder="Enter your email"
                        value={forgotPasswordEmail}
                        onChange={(e) => {
                            setForgotPasswordEmail(e.target.value);
                            if (forgotPasswordError) setForgotPasswordError('');
                        }}
                        error={forgotPasswordError}
                    />

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowForgotPassword(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                            Send Reset Link
                        </Button>
                    </div>
                </Form>
            </ResponsiveDialog>

            <Footer />
        </div>
    );
};

export default Login;
