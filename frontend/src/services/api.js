import api from '../lib/axios';

// Auth API functions
export const authAPI = {
    // Login
    login: async (credentials) => {
        return await api.post('/auth/login', credentials);
    },

    // Register
    register: async (registrationData) => {
        return await api.post('/auth/register', registrationData);
    },

    // Logout
    logout: async () => {
        return await api.post('/auth/logout');
    },

    // Forgot password
    forgotPassword: async (email) => {
        return await api.post('/auth/forgot-password', { email });
    },

    // Verify reset token
    verifyResetToken: async (token) => {
        return await api.get(`/auth/verify-reset-token?token=${token}`);
    },

    // Reset password
    resetPassword: async (resetData) => {
        return await api.post('/auth/reset-password', resetData);
    },

    // Verify email
    verifyEmail: async (token) => {
        return await api.get(`/auth/verify-email?token=${token}`);
    },
    // Get current user
    me: async () => {
        return await api.get('/auth/me');
    },
};

// Resident search API functions
export const residentAPI = {
    // Search residents by name
    searchResidents: async (searchParams) => {
        return await api.get('/auth/search-residents', {
            params: searchParams
        });
    },

    // Get resident by ID
    getResidentById: async (residentId) => {
        return await api.get(`/auth/resident/${residentId}`);
    },
};

export default api;
