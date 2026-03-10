import { useState, useEffect, useCallback } from 'react';
import type { Topic, CreateTopicDTO } from '../types/topic.types';
import { topicsService } from '../services/topicsService';

export function useTopics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadTopics = useCallback(async () => {
        try {
            setLoading(true);
            const data = await topicsService.getAll();
            setTopics(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTopics();
    }, [loadTopics]);

    const createTopic = async (topicData: CreateTopicDTO) => {
        try {
            const newTopic = await topicsService.create(topicData);
            setTopics(prev => [...prev, newTopic]);
            return newTopic;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const updateTopic = async (id: string, topicData: Partial<CreateTopicDTO>) => {
        try {
            console.log('🟣 useTopics - updateTopic chamado', { id, topicData });
            const updatedTopic = await topicsService.update(id, topicData);
            console.log('🟣 useTopics - updatedTopic recebido', updatedTopic);

            setTopics(prevTopics => {
                const newTopics = prevTopics.map(t =>
                    t.id === id ? updatedTopic : t
                );
                console.log('🟣 useTopics - novo estado topics:', newTopics);
                return newTopics;
            });

            return updatedTopic;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const deleteTopic = async (id: string) => {
        try {
            await topicsService.delete(id);
            setTopics(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const updateLastAccessed = async (id: string) => {
        try {
            const updatedTopic = await topicsService.updateLastAccessed(id);
            setTopics(prevTopics => prevTopics.map(t =>
                t.id === id ? updatedTopic : t
            ));
            return updatedTopic;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const addStudyHours = async (id: string, hours: number) => {
        try {
            const updatedTopic = await topicsService.addStudyHours(id, hours);
            setTopics(prevTopics => prevTopics.map(t =>
                t.id === id ? updatedTopic : t
            ));
            return updatedTopic;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return {
        topics,
        loading,
        error,
        createTopic,
        updateTopic,
        deleteTopic,
        updateLastAccessed,
        addStudyHours,
        refresh: loadTopics
    };
}