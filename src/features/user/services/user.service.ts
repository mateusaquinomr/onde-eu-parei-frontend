import api from '@/shared/services/api/api';
import type { User, UpdateUserData } from '../types/user.types';

export const userService = {

    getProfile: async (): Promise<User> => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    updateProfile: async (data: UpdateUserData): Promise<User> => {
        const response = await api.put('/users/profile', data);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const currentUser = JSON.parse(storedUser);
            const updatedUser = { ...currentUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        return response.data;
    },
};