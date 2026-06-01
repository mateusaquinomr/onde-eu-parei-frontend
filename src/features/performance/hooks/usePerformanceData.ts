import { useState, useEffect } from 'react';
import type { PerformanceData } from '../types/performance.types';
import { performanceService } from '../services/performanceService';

export function usePerformanceData() {
    const [data, setData] = useState<PerformanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockData: PerformanceData = {
                    metrics: [
                        {
                            id: '1',
                            label: 'Tempo total estudado',
                            value: '32h 40m',
                            change: { value: 12, trend: 'up', comparison: 'comparado à semana passada' },
                            icon: 'schedule'
                        },
                        {
                            id: '2',
                            label: 'Ciclos completos',
                            value: 6,
                            unit: 'ciclos',
                            icon: 'donut_large'
                        },
                        {
                            id: '3',
                            label: 'Blocos estudados',
                            value: 48,
                            unit: 'blocos',
                            icon: 'library_books'
                        },
                        {
                            id: '4',
                            label: 'Dias consecutivos',
                            value: 7,
                            unit: 'dias',
                            icon: 'local_fire_department'
                        }
                    ],
                    subjectTime: [
                        { subject: 'Matemática', hours: 13, percentage: 40, color: '#3B82F6' },
                        { subject: 'Português', hours: 8, percentage: 25, color: '#10B981' },
                        { subject: 'Biologia', hours: 5, percentage: 15, color: '#F59E0B' },
                        { subject: 'História', hours: 3.5, percentage: 10, color: '#EF4444' },
                        { subject: 'Redação', hours: 3.5, percentage: 10, color: '#8B5CF6' }
                    ],
                    dailyEvolution: [
                        { date: '2024-03-18', day: 'Seg', hours: 2 },
                        { date: '2024-03-19', day: 'Ter', hours: 3 },
                        { date: '2024-03-20', day: 'Qua', hours: 1 },
                        { date: '2024-03-21', day: 'Qui', hours: 4 },
                        { date: '2024-03-22', day: 'Sex', hours: 2 },
                        { date: '2024-03-23', day: 'Sáb', hours: 0.5 },
                        { date: '2024-03-24', day: 'Dom', hours: 1 }
                    ],
                    weeklyCycles: [
                        { week: 'Semana 1', cycles: 3 },
                        { week: 'Semana 2', cycles: 4 },
                        { week: 'Semana 3', cycles: 2 },
                        { week: 'Semana 4', cycles: 5 }
                    ],
                    idealVsReal: [
                        { subject: 'Matemática', planned: 30, actual: 45 },
                        { subject: 'Português', planned: 25, actual: 20 },
                        { subject: 'Biologia', planned: 20, actual: 15 },
                        { subject: 'História', planned: 15, actual: 10 },
                        { subject: 'Redação', planned: 10, actual: 10 }
                    ],
                    heatmap: Array.from({ length: 35 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (34 - i));
                        const hours = Math.floor(Math.random() * 7);
                        return {
                            date: date.toISOString().split('T')[0],
                            count: hours,
                            intensity: hours === 0 ? 0 :
                                hours < 2 ? 1 :
                                    hours < 4 ? 2 :
                                        hours < 6 ? 3 : 4
                        } as any;
                    }),
                    cycleProgress: {
                        totalBlocks: 10,
                        completedBlocks: 7,
                        percentage: 70,
                        currentCycle: 3
                    },
                    completionStats: {
                        started: 52,
                        completed: 48,
                        rate: 92
                    },
                    averageSession: {
                        average: 38,
                        trend: 15
                    },
                    insights: [
                        {
                            id: '1',
                            type: 'positive',
                            message: 'Você estuda mais às terças e quintas',
                            detail: 'Esses dias representam 45% do seu tempo total'
                        },
                        {
                            id: '2',
                            type: 'neutral',
                            message: 'Matemática representa 38% do seu tempo de estudo',
                            detail: 'Segunda disciplina que mais estuda'
                        },
                        {
                            id: '3',
                            type: 'positive',
                            message: 'Seu tempo médio de sessão aumentou 15% esta semana',
                            detail: 'Agora você estuda em média 38min por sessão'
                        },
                        {
                            id: '4',
                            type: 'positive',
                            message: 'Você completou 2 ciclos a mais que na semana passada',
                            detail: 'Continue com esse ritmo!'
                        }
                    ]
                };

                setData(mockData);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { data, loading, error };
}