import type { Edital, CreateEditalDTO, UpdateEditalDTO } from '../types/edital.types';
import api from '@/shared/services/api/api';

const adaptEdital = (backendEdital: any): Edital => ({
    ...backendEdital,
    id: backendEdital._id || backendEdital.id,
});

export const editaisService = {
    async getAll(): Promise<Edital[]> {
        const response = await api.get('/editais');
        return response.data.map(adaptEdital);
    },

    async getById(id: string): Promise<Edital> {
        const response = await api.get(`/editais/${id}`);
        return adaptEdital(response.data);
    },

    async create(data: CreateEditalDTO): Promise<Edital> {
        const response = await api.post('/editais', data);
        return adaptEdital(response.data);
    },

    async update(id: string, data: UpdateEditalDTO): Promise<Edital> {
        const response = await api.put(`/editais/${id}`, data);
        return adaptEdital(response.data);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/editais/${id}`);
    },

    async getProgress(id: string): Promise<{ progresso: number; topicosCount: number; concluidos: number }> {
        const response = await api.get(`/editais/${id}/progress`);
        return response.data;
    }
};