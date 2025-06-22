import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, CheckCircle, User } from 'lucide-react';
import Form from '../components/custom/Form';
import FormInput from '../components/custom/FormInput';
import ResponsiveCard from '../components/custom/ResponsiveCard';
import { signupSchema } from '../lib/validation';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { residentAPI, authAPI } from '../services/api';
import { toast } from 'sonner';

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [residentQuery, setResidentQuery] = useState('');
    const [residentOptions, setResidentOptions] = useState([]);
    const [residentSearchLoading, setResidentSearchLoading] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [isUpdatingFromSelection, setIsUpdatingFromSelection] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Debounced search effect
    useEffect(() => {
        // Don't search if we're updating from selection
        if (isUpdatingFromSelection) {
            setIsUpdatingFromSelection(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            if (residentQuery.length >= 2) {
                handleResidentSearch(residentQuery);
            } else {
                setResidentOptions([]);
                setHasSearched(false);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [residentQuery]);

    // Resident search handler
    const handleResidentSearch = async (query) => {
        setResidentSearchLoading(true);
        setHasSearched(true);
        try {
            const res = await residentAPI.searchResidents({ firstName: query });
            setResidentOptions(res.data || []);
        } catch (e) {
            setResidentOptions([]);
        } finally {
            setResidentSearchLoading(false);
        }
    };

    const handleResidentSelect = (resident) => {
        setSelectedResident(resident);
        setIsUpdatingFromSelection(true); // Set flag before updating query
        setResidentQuery(`${resident.firstName} ${resident.lastName}`);
        setResidentOptions([]);
        setHasSearched(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleResidentQueryChange = (e) => {
        setResidentQuery(e.target.value);
        setSelectedResident(null);
    };

    const validateForm = () => {
        const { email, password, confirmPassword } = formData;

        // Simple validation as fallback
        const simpleErrors = {};
        if (!email) simpleErrors.email = 'Email is required';
        if (!password) simpleErrors.password = 'Password is required';
        if (!confirmPassword) simpleErrors.confirmPassword = 'Please confirm your password';
        if (password !== confirmPassword) simpleErrors.confirmPassword = "Passwords don't match";

        if (Object.keys(simpleErrors).length > 0) {
            setErrors(simpleErrors);
            return false;
        }

        try {
            signupSchema.parse({ email, password, confirmPassword });
            setErrors({});
            return true;
        } catch (error) {
            const newErrors = {};
            // Check if error is a Zod error and has the errors property
            if (error && error.errors && Array.isArray(error.errors)) {
                error.errors.forEach(err => {
                    if (err.path && err.path[0]) {
                        newErrors[err.path[0]] = err.message;
                    }
                });
            } else {
                // Fallback for other types of errors
                newErrors.general = 'Validation failed. Please check your input.';
            }
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedResident) {
            setErrors({ resident: 'Please select your name from the list.' });
            return;
        }
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            await register({
                residentId: selectedResident._id,
                email: formData.email,
                password: formData.password,
            });
            toast.success("Please verify your email")
            navigate('/login', { state: { fromSignup: true } });
        } catch (error) {
            setErrors({ email: error.message || 'Registration failed.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-16 px-4">
                <div className="w-full max-w-2xl">
                    <ResponsiveCard
                        title="Sign Up"
                        description="Search for your name to begin registration."
                    >
                        <Form onSubmit={handleSubmit}>
                            {/* General Error Display */}
                            {errors.general && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                                    <p className="text-sm text-red-600">{errors.general}</p>
                                </div>
                            )}

                            {/* Resident Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Search Your Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.resident ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                                        placeholder="Type your first name..."
                                        value={residentQuery}
                                        onChange={handleResidentQueryChange}
                                        autoComplete="off"
                                    />
                                    {residentSearchLoading && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                        </div>
                                    )}
                                    {residentOptions.length > 0 && (
                                        <ul className="absolute z-10 left-0 right-0 bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                                            {residentOptions.map(resident => (
                                                <li
                                                    key={resident._id}
                                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex flex-col"
                                                    onClick={() => handleResidentSelect(resident)}
                                                >
                                                    <span className="font-medium">{resident.firstName} {resident.middleName} {resident.lastName}</span>
                                                    <span className="text-xs text-slate-500">Birthdate: {resident.birthDate ? new Date(resident.birthDate).toLocaleDateString() : ''}</span>
                                                    <span className="text-xs text-slate-500">Purok: {resident.purok} | Gender: {resident.gender}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {hasSearched && !residentSearchLoading && residentOptions.length === 0 && residentQuery.length >= 2 && (
                                        <div className="absolute z-10 left-0 right-0 bg-white border border-slate-200 rounded-lg mt-1 p-4 shadow-lg">
                                            <div className="text-center text-slate-500">
                                                <User className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                                <p className="text-sm font-medium">No residents found</p>
                                                <p className="text-xs">Try searching with a different name or contact barangay staff</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.resident && <p className="text-sm text-red-600 mt-1">{errors.resident}</p>}
                            </div>

                            {/* Show resident details if selected */}
                            {selectedResident && (
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="font-semibold text-blue-900 mb-1">{selectedResident.firstName} {selectedResident.middleName} {selectedResident.lastName}</div>
                                    <div className="text-sm text-slate-700 mb-1">Birthdate: {selectedResident.birthDate ? new Date(selectedResident.birthDate).toLocaleDateString() : ''}</div>
                                    <div className="text-sm text-slate-700 mb-1">Purok: {selectedResident.purok}</div>
                                    <div className="text-sm text-slate-700 mb-1">Gender: {selectedResident.gender}</div>
                                    <div className="text-sm text-slate-700 mb-1">Civil Status: {selectedResident.civilStatus}</div>
                                    <div className="text-sm text-slate-700 mb-1">Occupation: {selectedResident.occupation}</div>
                                    <div className="text-sm text-slate-700 mb-1">Contact: {selectedResident.contactNumber}</div>
                                </div>
                            )}

                            {/* Email & Password Fields */}
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
                                placeholder="Create a strong password"
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

                            <FormInput
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Confirm your password"
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
                            <div className="p-4 bg-blue-50 rounded-lg mb-4">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={12} className={formData.password.length >= 8 ? "text-green-600" : "text-blue-400"} />
                                        At least 8 characters
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={12} className={/[A-Z]/.test(formData.password) ? "text-green-600" : "text-blue-400"} />
                                        One uppercase letter
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={12} className={/[a-z]/.test(formData.password) ? "text-green-600" : "text-blue-400"} />
                                        One lowercase letter
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={12} className={/\d/.test(formData.password) ? "text-green-600" : "text-blue-400"} />
                                        One number
                                    </li>
                                </ul>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Create Account
                                        <ArrowRight size={16} />
                                    </div>
                                )}
                            </Button>
                        </Form>
                        <div className="mt-6">
                            <Separator className="my-4" />
                            <div className="text-center">
                                <p className="text-slate-600 text-sm">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">
                                        Secure Registration
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Your information is protected and will only be used for barangay services
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

export default Signup;
