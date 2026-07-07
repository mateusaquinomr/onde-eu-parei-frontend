import { useState, useEffect, useCallback } from 'react';
import type { Edital, CreateEditalDTO, UpdateEditalDTO } from '../types/edital.types';
import { editaisService } from '../services/editaisService';

export function useEditais() {
    const [editais, setEditais] = useState<Edital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadEditais = useCallback(async () => {
        try {
            setLoading(true);
            const data = await editaisService.getAll();
            setEditais(data);
        } catch (err) {
            console.error('Erro ao carregar editais:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEditais();
    }, [loadEditais]);

    const createEdital = async (data: CreateEditalDTO) => {
        try {
            const newEdital = await editaisService.create(data);
            setEditais(prev => [...prev, newEdital]);
            return newEdital;
        } catch (err) {
            console.error('Erro ao criar edital:', err);
            setError(err as Error);
            throw err;
        }
    };

    const updateEdital = async (id: string, data: UpdateEditalDTO) => {
        try {
            const updated = await editaisService.update(id, data);
            setEditais(prev => prev.map(e => e.id === id ? updated : e));
            return updated;
        } catch (err) {
            console.error('Erro ao atualizar edital:', err);
            setError(err as Error);
            throw err;
        }
    };

    const deleteEdital = async (id: string) => {
        try {
            await editaisService.delete(id);
            setEditais(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            console.error('Erro ao deletar edital:', err);
            setError(err as Error);
            throw err;
        }
    };

    const getEditalProgress = async (id: string) => {
        try {
            if (!id || id === 'undefined') {
                console.warn('ID inválido para buscar progresso:', id);
                return { progresso: 0, topicosCount: 0, concluidos: 0 };
            }
            return await editaisService.getProgress(id);
        } catch (err) {
            console.error('Erro ao buscar progresso do edital:', err);
            return { progresso: 0, topicosCount: 0, concluidos: 0 };
        }
    };

    const updateEditalCounts = useCallback(async () => {
        if (editais.length === 0) return;

        const updatedEditais = await Promise.all(
            editais.map(async (edital) => {
                if (!edital.id) return edital;
                try {
                    const progress = await getEditalProgress(edital.id);
                    return {
                        ...edital,
                        topicosCount: progress.topicosCount || 0,
                        progresso: progress.progresso || 0
                    };
                } catch (error) {
                    console.error('Erro ao buscar progresso do edital:', edital.id, error);
                    return edital;
                }
            })
        );
        setEditais(updatedEditais);
    }, [editais]);

    useEffect(() => {
        if (editais.length > 0) {
            updateEditalCounts();
        }
    }, [editais.length]);

    return {
        editais,
        loading,
        error,
        createEdital,
        updateEdital,
        deleteEdital,
        getEditalProgress,
        updateEditalCounts,
        refresh: loadEditais
    };
}