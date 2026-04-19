import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/auth.service';

interface AuthContextType {
    user: { 
        name: string; 
        email: string; 
        role: string; 
        userId: string; 
        companyName?: string; 
        phone?: string; 
        verified?: boolean;
        hasGeminiKey?: boolean;
    } | null;
    token: string | null;
    login: (email: string, password: string) => Promise<{ name: string; email: string; role: string; userId: string }>;
    register: (data: {
        name: string; email: string; password: string; role: string;
        companyName?: string; phone?: string;
    }) => Promise<void>;
    updateProfile: (data: { name?: string; phone?: string; companyName?: string }) => Promise<void>;
    updateGeminiKey: (apiKey: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthContextType['user']>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

    useEffect(() => {
        // Token is now initialized synchronously, no need to set here on mount.
        // We could implement an /auth/me check here if backend validation was required.
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login(email, password);
        const userData = { 
            name: response.name, 
            email: response.email, 
            role: response.role, 
            userId: response.userId, 
            companyName: response.companyName, 
            phone: response.phone, 
            verified: response.verified,
            hasGeminiKey: response.hasGeminiKey 
        };
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(response.token);
        setUser(userData);
        return userData;
    };

    const register = async (data: {
        name: string; email: string; password: string; role: string;
        companyName?: string; phone?: string;
    }) => {
        const response = await authService.register(data);
        const userData = { 
            name: response.name, 
            email: response.email, 
            role: response.role, 
            userId: response.userId, 
            companyName: response.companyName, 
            phone: response.phone, 
            verified: response.verified,
            hasGeminiKey: response.hasGeminiKey 
        };
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(response.token);
        setUser(userData);
    };

    const updateProfile = async (data: { name?: string; phone?: string; companyName?: string }) => {
        const response = await authService.updateProfile(data);
        const userData = { 
            name: response.name, 
            email: response.email, 
            role: response.role, 
            userId: response.userId, 
            companyName: response.companyName, 
            phone: response.phone, 
            verified: response.verified,
            hasGeminiKey: response.hasGeminiKey 
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const updateGeminiKey = async (apiKey: string) => {
        await authService.updateGeminiKey(apiKey);
        if (user) {
            const updatedUser = { ...user, hasGeminiKey: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, updateProfile, updateGeminiKey, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
