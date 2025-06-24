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

// Resident API functions
export const residentAPI = {
    // Search residents by name
    searchResidents: async (searchParams) => {
        return await api.get('/auth/search-residents', {
            params: searchParams
        });
    },

    // Get all residents
    getResidents: async () => {
        return await api.get('/residents');
    },

    // Get resident by ID
    getResidentById: async (residentId) => {
        return await api.get(`/residents/${residentId}`);
    },

    // Create a resident
    createResident: async (data) => {
        return await api.post('/residents', data);
    },

    // Update a resident
    updateResident: async (residentId, data) => {
        return await api.put(`/residents/${residentId}`, data);
    },

    // Delete a resident
    deleteResident: async (residentId) => {
        return await api.delete(`/residents/${residentId}`);
    },
};

// User API functions
export const userAPI = {
    getUsers: async () => {
        return await api.get('/users');
    },
    getUserById: async (userId) => {
        return await api.get(`/users/${userId}`);
    },
    verifyUserDocument: async (userId) => {
        return await api.patch(`/users/${userId}/verify-document`);
    },
};

export default api;
