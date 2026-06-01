import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { AuthResponse, AuthState, AuthContextType } from '../types/auth.types';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
        error: null,
    });

    useEffect(() => {
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
            setState({
                user: storedUser,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const user = await authService.login(credentials);
            setState({
                user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });
        } catch (error: any) {
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: error.response?.data?.message || error.message || 'Erro ao fazer login',
            });
            throw error;
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const user = await authService.register(data);
            setState({
                user,
                isLoading: false,
                isAuthenticated: true,
                error: null,
            });
        } catch (error: any) {
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: error.response?.data?.message || error.message || 'Erro ao registrar',
            });
            throw error;
        }
    };

    const updateAuthUser = (updatedUser: AuthResponse) => {
        setState(prev => ({
            ...prev,
            user: updatedUser,
        }));
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const registerStep1 = (data: any) => {
        authService.saveStep1(data);
    };

    const registerStep2 = (data: any) => {
        authService.saveStep2(data);
    };

    const registerStep3 = async (data: any) => {
        if (data.templateId) {
            authService.saveStep3(data);
        }
    };

    const logout = () => {
        authService.logout();
        setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
        });
    };

    const clearError = () => {
        setState(prev => ({ ...prev, error: null }));
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            login,
            register,
            registerStep1,
            registerStep2,
            registerStep3,
            logout,
            clearError,
            updateAuthUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;