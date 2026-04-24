// src/services/authService.js
import api from './api';

export const authService = {
    // Tentative de connexion
    login: async (credentials) => {
        const response = await api.post('/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Déconnexion
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
},
};