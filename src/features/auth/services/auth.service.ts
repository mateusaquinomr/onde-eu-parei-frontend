import api from '@/shared/services/api/api';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    RegisterStep1Data,
    RegisterStep2Data,
    RegisterTemplateData,
    CompleteRegistrationData
} from '../types/auth.types';

export const authService = {

    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        const user = response.data;

        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));

        return user;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        const user = response.data;

        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));

        return user;
    },

    saveStep1: (data: RegisterStep1Data): void => {
        sessionStorage.setItem('register_email', data.email);
        sessionStorage.setItem('register_password', data.password);
    },

    saveStep2: (data: RegisterStep2Data): void => {
        sessionStorage.setItem('register_name', data.name);
        sessionStorage.setItem('register_username', data.username);
    },

    saveStep3: (data: RegisterTemplateData): void => {
        if (data.templateId) {
            sessionStorage.setItem('register_templateId', data.templateId);
        }
    },

    completeRegistration: async (): Promise<AuthResponse> => {
        const email = sessionStorage.getItem('register_email');
        const password = sessionStorage.getItem('register_password');
        const name = sessionStorage.getItem('register_name');
        const username = sessionStorage.getItem('register_username');

        if (!email || !password || !name || !username) {
            throw new Error('Dados de registro incompletos');
        }

        const response = await api.post<AuthResponse>('/auth/register', {
            name,
            username,
            email,
            password,
        });

        const user = response.data;

        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));

        sessionStorage.clear();

        return user;
    },

    getRegistrationData: (): Partial<CompleteRegistrationData> => {
        return {
            email: sessionStorage.getItem('register_email') || undefined,
            password: sessionStorage.getItem('register_password') || undefined,
            name: sessionStorage.getItem('register_name') || undefined,
            username: sessionStorage.getItem('register_username') || undefined,
            templateId: sessionStorage.getItem('register_templateId') || undefined,
        };
    },

    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
    },

    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    getStoredUser: (): AuthResponse | null => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    },
};