import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task.types';
import { tasksService } from '../services/tasksService';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await tasksService.getAll();
            setTasks(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const createTask = async (data: CreateTaskDTO) => {
        try {
            const newTask = await tasksService.create(data);
            setTasks(prev => [newTask, ...prev]);
            return newTask;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const updateTask = async (id: string, data: UpdateTaskDTO) => {
        try {
            const updated = await tasksService.update(id, data);
            setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
            return updated;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        return updateTask(id, { completed: !task.completed });
    };

    const deleteTask = async (id: string) => {
        try {
            await tasksService.delete(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        refresh: loadTasks
    };
}