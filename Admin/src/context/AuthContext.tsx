import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, setTokens, clearTokens, getAccessToken } from '../api/client';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    photo?: string;
    lastLoginAt?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email?: string; phone?: string; password: string }) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = getAccessToken();
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                // Verify admin session via dedicated /admin/auth/me endpoint
                const response = await apiClient.get<{ data: User }>('/admin/auth/me');
                if (response?.data) {
                    setUser(response.data);
                } else {
                    clearTokens();
                    setUser(null);
                }
            } catch (error) {
                console.warn("Admin session verification failed:", error);
                clearTokens();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (credentials: { email?: string; phone?: string; password: string }) => {
        setIsLoading(true);
        try {
            // Dedicated Admin Auth endpoint verifying role: ADMIN or SUPER_ADMIN
            const response = await apiClient.post<{ data: { user: User; accessToken: string; refreshToken: string } }>('/admin/auth/login', credentials);
            
            if (response?.data?.accessToken) {
                setTokens(response.data.accessToken, response.data.refreshToken);
                setUser(response.data.user);
            } else {
                throw new Error('Authentication failed');
            }
        } catch (error: any) {
            clearTokens();
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        clearTokens();
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: Boolean(user),
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
