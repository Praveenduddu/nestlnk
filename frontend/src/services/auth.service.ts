import api from './api';
import type { AuthResponse } from '../types';

export const authService = {
    async register(data: {
        name: string;
        email: string;
        password: string;
        role: string;
        companyName?: string;
        phone?: string;
    }): Promise<AuthResponse> {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    async updateProfile(data: { name?: string; phone?: string; companyName?: string }): Promise<AuthResponse> {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    async updateGeminiKey(apiKey: string): Promise<void> {
        await api.put('/auth/gemini-key', { apiKey });
    },
};
