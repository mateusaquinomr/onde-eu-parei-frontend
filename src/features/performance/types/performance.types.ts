export interface MetricData {
    id: string;
    label: string;
    value: string | number;
    unit?: string;
    change?: {
        value: number;
        trend: 'up' | 'down' | 'neutral';
        comparison: string;
    };
    icon?: string;
}

export interface SubjectTimeData {
    subject: string;
    hours: number;
    percentage: number;
    color: string;
}

export interface DailyStudyData {
    date: string;
    day: string;
    hours: number;
}

export interface WeeklyCycleData {
    week: string;
    cycles: number;
}

export interface IdealVsRealData {
    subject: string;
    planned: number;
    actual: number;
}

export interface HeatmapData {
    date: string;
    count: number;
    intensity: 0 | 1 | 2 | 3 | 4;
}

export interface CycleProgress {
    totalBlocks: number;
    completedBlocks: number;
    percentage: number;
    currentCycle: number;
    totalCycles?: number;
}

export interface CompletionStats {
    started: number;
    completed: number;
    rate: number;
}

export interface AverageSession {
    average: number;
    trend?: number;
}

export interface Insight {
    id: string;
    type: 'positive' | 'neutral' | 'alert';
    message: string;
    detail?: string;
}

export interface PerformanceData {
    metrics: MetricData[];
    subjectTime: SubjectTimeData[];
    dailyEvolution: DailyStudyData[];
    weeklyCycles: WeeklyCycleData[];
    idealVsReal: IdealVsRealData[];
    heatmap: HeatmapData[];
    cycleProgress: CycleProgress;
    completionStats: CompletionStats;
    averageSession: AverageSession;
    insights: Insight[];
}