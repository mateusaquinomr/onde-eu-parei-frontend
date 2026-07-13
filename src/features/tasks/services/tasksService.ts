import api from '@/shared/services/api/api';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task.types';

const adaptTask = (backendTask: any): Task => ({
    ...backendTask,
    id: backendTask._id || backendTask.id,
});

export const tasksService = {
    async getAll(): Promise<Task[]> {
        const response = await api.get('/tasks');
        return response.data.map(adaptTask);
    },

    async create(data: CreateTaskDTO): Promise<Task> {
        const response = await api.post('/tasks', data);
        return adaptTask(response.data);
    },

    async update(id: string, data: UpdateTaskDTO): Promise<Task> {
        const response = await api.put(`/tasks/${id}`, data);
        return adaptTask(response.data);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },
};