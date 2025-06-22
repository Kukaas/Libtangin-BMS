import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState({
        loading: true,
        success: false,
        message: ''
    });
    const hasVerified = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get('token');
                if (!token) {
                    setVerificationStatus({
                        loading: false,
                        success: false,
                        message: 'Verification token is missing'
                    });
                    return;
                }

                if (hasVerified.current) {
                    return;
                }
                hasVerified.current = true;

                const response = await api.get('/auth/verify-email', {
                    params: { token }
                });

                // Extract success and message from the response (axios interceptor already returns data)
                const { success, message } = response;

                setVerificationStatus({
                    loading: false,
                    success,
                    message
                });

                if (success) {
                    setTimeout(() => {
                        navigate('/login');
                    }, 5000);
                }
            } catch (error) {
                console.error('Verification error:', error);
                setVerificationStatus({
                    loading: false,
                    success: false,
                    message: error.response?.data?.message || error.message || 'Failed to verify email'
                });
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 transition-all duration-300 ease-in-out">
                {verificationStatus.loading ? (
                    <div className="flex flex-col items-center py-8">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-8 text-lg text-gray-600 font-light animate-pulse">
                            Verifying your email...
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        {verificationStatus.success ? (
                            <div className="space-y-6">
                                <div className="relative">
                                    <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center transform transition-transform duration-500 hover:scale-105">
                                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div className="absolute -inset-1 bg-green-50 rounded-full blur-lg opacity-50"></div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-light text-gray-900">Email Verified!</h2>
                                    <p className="text-gray-600">{verificationStatus.message}</p>
                                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Redirecting to login page...</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="relative">
                                    <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center transform transition-transform duration-500 hover:scale-105">
                                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </div>
                                    <div className="absolute -inset-1 bg-red-50 rounded-full blur-lg opacity-50"></div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-light text-gray-900">Verification Failed</h2>
                                    <p className="text-gray-600">{verificationStatus.message}</p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        Go to Login
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
