import type {
    PerformanceData,
    MetricData,
    SubjectTimeData,
    DailyStudyData,
    HeatmapData,
    Insight,
    CycleProgress,
    CompletionStats,
    AverageSession
} from '../types/performance.types';
import type { Cycle } from '../../cycle/types/cycle.types';
import type { Topic } from '../../topics/types/topic.types';

class PerformanceService {

    async getPerformanceData(): Promise<PerformanceData> {
        try {
            // const response = await fetch('/api/performance');
            // return response.json();

            return this.getMockData();
        } catch (error) {
            console.error('Erro ao buscar dados de performance:', error);
            throw error;
        }
    }

    processRealData(cycles: Cycle[], topics: Topic[]): PerformanceData {
        return {
            metrics: this.calculateMetrics(cycles),
            subjectTime: this.calculateSubjectTime(cycles, topics),
            dailyEvolution: this.calculateDailyEvolution(cycles),
            weeklyCycles: this.calculateWeeklyCycles(cycles),
            idealVsReal: this.calculateIdealVsReal(cycles, topics),
            heatmap: this.generateHeatmap(cycles),
            cycleProgress: this.getCurrentCycleProgress(cycles),
            completionStats: this.calculateCompletionStats(cycles),
            averageSession: this.calculateAverageSession(cycles),
            insights: this.generateInsights(cycles, topics)
        };
    }

    private calculateMetrics(cycles: Cycle[]): MetricData[] {
        const totalHours = cycles.reduce((sum, cycle) => sum + cycle.totalHours, 0);
        const totalCompletedHours = cycles.reduce((sum, cycle) => sum + cycle.completedHours, 0);
        const totalCycles = cycles.length;
        const totalBlocks = cycles.reduce((sum, cycle) => sum + cycle.blocks.length, 0);

        const streak = this.calculateStreak(cycles);

        const lastWeekHours = this.getLastWeekHours(cycles);
        const previousWeekHours = this.getPreviousWeekHours(cycles);
        const weeklyChange = previousWeekHours > 0
            ? Math.round(((lastWeekHours - previousWeekHours) / previousWeekHours) * 100)
            : 0;

        return [
            {
                id: 'total-hours',
                label: 'Tempo total estudado',
                value: this.formatHours(totalCompletedHours),
                change: {
                    value: weeklyChange,
                    trend: weeklyChange > 0 ? 'up' : weeklyChange < 0 ? 'down' : 'neutral',
                    comparison: 'vs semana passada'
                },
                icon: 'Relogio'
            },
            {
                id: 'total-cycles',
                label: 'Ciclos completos',
                value: totalCycles,
                unit: 'ciclos',
                icon: 'ciclo'
            },
            {
                id: 'total-blocks',
                label: 'Blocos estudados',
                value: totalBlocks,
                unit: 'blocos',
                icon: 'livros'
            },
            {
                id: 'streak',
                label: 'Dias consecutivos',
                value: streak,
                unit: 'dias',
                icon: 'fogo'
            }
        ];
    }

    private calculateSubjectTime(cycles: Cycle[], topics: Topic[]): SubjectTimeData[] {
        const subjectMap = new Map<string, number>();
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

        cycles.forEach(cycle => {
            cycle.blocks.forEach(block => {
                const current = subjectMap.get(block.topicName) || 0;
                subjectMap.set(block.topicName, current + block.hours);
            });
        });

        const total = Array.from(subjectMap.values()).reduce((sum, hours) => sum + hours, 0);

        return Array.from(subjectMap.entries())
            .map(([subject, hours], index) => ({
                subject,
                hours: Math.round(hours * 10) / 10,
                percentage: Math.round((hours / total) * 100),
                color: colors[index % colors.length]
            }))
            .sort((a, b) => b.hours - a.hours);
    }

    private calculateDailyEvolution(cycles: Cycle[]): DailyStudyData[] {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const daysMap = new Map<string, number>();

        cycles.forEach(cycle => {
            const date = cycle.createdAt.toISOString().split('T')[0];
            if (last7Days.includes(date)) {
                const current = daysMap.get(date) || 0;
                daysMap.set(date, current + cycle.completedHours);
            }
        });

        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        return last7Days.map(date => {
            const dayOfWeek = new Date(date).getDay();
            return {
                date,
                day: dayNames[dayOfWeek],
                hours: daysMap.get(date) || 0
            };
        });
    }

    private calculateWeeklyCycles(cycles: Cycle[]): Array<{ week: string; cycles: number }> {
        const weeks = new Map<string, number>();

        cycles.forEach(cycle => {
            const date = new Date(cycle.createdAt);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = weekStart.toISOString().split('T')[0];

            const current = weeks.get(weekKey) || 0;
            weeks.set(weekKey, current + 1);
        });

        return Array.from(weeks.entries())
            .map(([week, count]) => ({
                week: `Semana ${new Date(week).getWeekNumber()}`,
                cycles: count
            }))
            .slice(-4);
    }

    private calculateIdealVsReal(cycles: Cycle[], topics: Topic[]): Array<{ subject: string; planned: number; actual: number }> {

        return [
            { subject: 'Matemática', planned: 30, actual: 45 },
            { subject: 'Português', planned: 25, actual: 20 },
            { subject: 'Biologia', planned: 20, actual: 15 },
            { subject: 'História', planned: 15, actual: 10 },
            { subject: 'Redação', planned: 10, actual: 10 }
        ];
    }

    private generateHeatmap(cycles: Cycle[]): HeatmapData[] {
        const last35Days = Array.from({ length: 35 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (34 - i));
            return date.toISOString().split('T')[0];
        });

        const studyMap = new Map<string, number>();

        cycles.forEach(cycle => {
            const date = cycle.createdAt.toISOString().split('T')[0];
            if (last35Days.includes(date)) {
                const current = studyMap.get(date) || 0;
                studyMap.set(date, current + cycle.completedHours);
            }
        });

        return last35Days.map(date => {
            const hours = studyMap.get(date) || 0;
            return {
                date,
                count: hours,
                intensity: hours === 0 ? 0 :
                    hours < 2 ? 1 :
                        hours < 4 ? 2 :
                            hours < 6 ? 3 : 4
            };
        });
    }

    private getCurrentCycleProgress(cycles: Cycle[]): CycleProgress {
        const activeCycle = cycles.find(c => c.isActive);

        if (!activeCycle) {
            return {
                totalBlocks: 0,
                completedBlocks: 0,
                percentage: 0,
                currentCycle: cycles.length
            };
        }

        const completedBlocks = activeCycle.blocks.filter(b => b.completed).length;

        return {
            totalBlocks: activeCycle.blocks.length,
            completedBlocks,
            percentage: Math.round((completedBlocks / activeCycle.blocks.length) * 100),
            currentCycle: activeCycle.number
        };
    }

    private calculateCompletionStats(cycles: Cycle[]): CompletionStats {
        const started = cycles.reduce((sum, cycle) => sum + cycle.blocks.length, 0);
        const completed = cycles.reduce((sum, cycle) =>
            sum + cycle.blocks.filter(b => b.completed).length, 0
        );

        return {
            started,
            completed,
            rate: Math.round((completed / started) * 100)
        };
    }

    private calculateAverageSession(cycles: Cycle[]): AverageSession {
        const totalHours = cycles.reduce((sum, cycle) => sum + cycle.completedHours, 0);
        const totalSessions = cycles.reduce((sum, cycle) => sum + cycle.blocks.length, 0);

        const average = totalSessions > 0
            ? Math.round((totalHours * 60) / totalSessions)
            : 0;
        const trend = 15;

        return { average, trend };
    }

    private generateInsights(cycles: Cycle[], topics: Topic[]): Insight[] {
        const insights: Insight[] = [];
        const dailyData = this.calculateDailyEvolution(cycles);
        const subjectData = this.calculateSubjectTime(cycles, topics);
        const averageSession = this.calculateAverageSession(cycles);
        const weeklyCycles = this.calculateWeeklyCycles(cycles);

        const bestDay = dailyData.reduce((best, current) =>
            current.hours > best.hours ? current : best
        );

        if (bestDay.hours > 0) {
            insights.push({
                id: 'best-day',
                type: 'positive',
                message: `Você estuda mais às ${bestDay.day}s`,
                detail: `Média de ${bestDay.hours}h nesse dia`
            });
        }

        if (subjectData.length > 0) {
            const topSubject = subjectData[0];
            insights.push({
                id: 'top-subject',
                type: 'neutral',
                message: `${topSubject.subject} representa ${topSubject.percentage}% do seu tempo de estudo`,
                detail: 'Esta é sua disciplina com maior dedicação'
            });
        }

        if (averageSession.trend && averageSession.trend > 0) {
            insights.push({
                id: 'session-trend',
                type: 'positive',
                message: `Seu tempo médio de sessão aumentou ${averageSession.trend}% esta semana`,
                detail: `Agora você estuda em média ${averageSession.average}min por sessão`
            });
        }

        if (weeklyCycles.length >= 2) {
            const lastWeek = weeklyCycles[weeklyCycles.length - 1];
            const previousWeek = weeklyCycles[weeklyCycles.length - 2];
            const diff = lastWeek.cycles - previousWeek.cycles;

            if (diff > 0) {
                insights.push({
                    id: 'cycles-increase',
                    type: 'positive',
                    message: `Você completou ${diff} ciclo${diff > 1 ? 's' : ''} a mais que na semana passada`,
                    detail: 'Continue com esse ritmo!'
                });
            } else if (diff < 0) {
                insights.push({
                    id: 'cycles-decrease',
                    type: 'alert',
                    message: `Você completou ${Math.abs(diff)} ciclo${Math.abs(diff) > 1 ? 's' : ''} a menos que na semana passada`,
                    detail: 'Que tal retomar o ritmo?'
                });
            }
        }

        return insights;
    }

    private calculateStreak(cycles: Cycle[]): number {
        if (cycles.length === 0) return 0;

        const studyDays = new Set(
            cycles.map(c => c.createdAt.toISOString().split('T')[0])
        );

        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        let currentDate = new Date();

        for (let i = 0; i < 365; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (studyDays.has(dateStr)) {
                streak++;
            } else if (dateStr !== today) {
                break;
            }
            currentDate.setDate(currentDate.getDate() - 1);
        }

        return streak;
    }

    private getLastWeekHours(cycles: Cycle[]): number {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        return cycles
            .filter(c => new Date(c.createdAt) >= lastWeek)
            .reduce((sum, c) => sum + c.completedHours, 0);
    }

    private getPreviousWeekHours(cycles: Cycle[]): number {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        return cycles
            .filter(c => {
                const date = new Date(c.createdAt);
                return date >= twoWeeksAgo && date < lastWeek;
            })
            .reduce((sum, c) => sum + c.completedHours, 0);
    }

    private formatHours(totalHours: number): string {
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

    private getMockData(): PerformanceData {
        return {
            metrics: [
                {
                    id: '1',
                    label: 'Tempo total estudado',
                    value: '32h 40m',
                    change: { value: 12, trend: 'up', comparison: 'vs semana passada' },
                    icon: 'Relogio'
                },
                {
                    id: '2',
                    label: 'Ciclos completos',
                    value: 6,
                    unit: 'ciclos',
                    icon: 'Ciclo'
                },
                {
                    id: '3',
                    label: 'Blocos estudados',
                    value: 48,
                    unit: 'blocos',
                    icon: 'Livros'
                },
                {
                    id: '4',
                    label: 'Dias consecutivos',
                    value: 7,
                    unit: 'dias',
                    icon: 'Fogo'
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
                };
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
    }
}

declare global {
    interface Date {
        getWeekNumber(): number;
    }
}

Date.prototype.getWeekNumber = function (): number {
    const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const performanceService = new PerformanceService();