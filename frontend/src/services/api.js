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

// Resident API functions for TanStack Query
export const fetchResidents = () => api.get('/residents');
export const fetchResidentById = (residentId) => api.get(`/residents/${residentId}`);
export const createResident = (data) => api.post('/residents', data);
export const updateResident = (residentId, data) => api.put(`/residents/${residentId}`, data);
export const deleteResident = (residentId) => api.delete(`/residents/${residentId}`);

// User API functions for TanStack Query
export const fetchUsers = () => api.get('/users');
export const fetchUserById = (userId) => api.get(`/users/${userId}`);
export const verifyUserDocument = (userId) => api.patch(`/users/${userId}/verify-document`);

// Officials API functions for admin
export const fetchOfficials = () => api.get('/users/officials');
export const fetchOfficialById = (id) => api.get(`/users/officials/${id}`);
export const createOfficial = (data) => api.post('/users/officials', data);
export const updateOfficial = (id, data) => api.put(`/users/officials/${id}`, data);
export const deleteOfficial = (id) => api.delete(`/users/officials/${id}`);

export default api;
