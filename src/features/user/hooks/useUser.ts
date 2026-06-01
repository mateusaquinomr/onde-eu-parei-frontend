import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { User, UpdateUserData } from '../types/user.types';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { updateAuthUser, user: authUser } = useAuth();

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                const userData = await userService.getProfile();
                setUser(userData);

                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    const mergedUser = { ...parsed, ...userData };
                    localStorage.setItem('user', JSON.stringify(mergedUser));
                } else {
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            } catch (err: any) {
                console.error('Erro ao carregar usuário:', err);
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch {
                        setError('Erro ao carregar dados do usuário');
                    }
                } else {
                    setError(err.response?.data?.message || 'Não foi possível carregar o perfil');
                }
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const updateProfile = async (data: UpdateUserData) => {
        setLoading(true);
        setError(null);

        try {
            const updatedUser = await userService.updateProfile(data);
            setUser(updatedUser);

            if (updateAuthUser && authUser) {
                const updatedAuthUser = {
                    ...authUser,
                    ...updatedUser,
                };
                updateAuthUser(updatedAuthUser);
            }

            const currentStored = localStorage.getItem('user');
            if (currentStored) {
                const parsed = JSON.parse(currentStored);
                const mergedUser = { ...parsed, ...updatedUser };
                localStorage.setItem('user', JSON.stringify(mergedUser));
            } else {
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            return updatedUser;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erro ao atualizar perfil';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (file: File) => {
        console.log('Upload de avatar:', file);
        return null;
    };

    return {
        user,
        loading,
        error,
        updateProfile,
        uploadAvatar,
    };
}