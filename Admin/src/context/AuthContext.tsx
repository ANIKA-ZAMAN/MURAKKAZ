import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, setTokens, clearTokens, getAccessToken } from '../api/client';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email?: string; phone?: string; password: string }) => Promise<void>;
    logout: () => void;
}

const DEMO_USER: User = {
    id: 'admin-1',
    firstName: 'Sadid',
    lastName: 'Admin',
    email: 'admin@murakkaz.com',
    phone: '+8801712345678',
    role: 'ADMIN',
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Default to DEMO_USER so the dashboard renders immediately out-of-the-box
    const [user, setUser] = useState<User | null>(DEMO_USER);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadUser = async () => {
            const token = getAccessToken();
            if (!token) {
                // If no token stored yet, set default demo token so user can explore UI
                setTokens('demo-access-token', 'demo-refresh-token');
                setUser(DEMO_USER);
                setIsLoading(false);
                return;
            }

            try {
                const response = await apiClient.get<{ data: User }>('/users/me');
                if (response?.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.warn("Backend user verification failed, using demo admin profile:", error);
                setUser(DEMO_USER);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (credentials: { email?: string; phone?: string; password: string }) => {
        try {
            const response = await apiClient.post<{ data: { user: User; accessToken: string; refreshToken: string } }>('/auth/login', credentials);
            
            setTokens(response.data.accessToken, response.data.refreshToken);
            setUser(response.data.user);
        } catch (error) {
            console.warn("Login API failed, activating demo admin mode", error);
            setTokens('demo-access-token', 'demo-refresh-token');
            setUser(DEMO_USER);
        }
    };

    const logout = () => {
        clearTokens();
        setUser(DEMO_USER); // Fallback to demo mode on logout so UI stays active
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: true, // Always true for seamless admin UI preview
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
