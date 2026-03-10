import type { Topic } from '../../topics/types/topic.types';

export type ConditionType = '=' | '>' | '<' | '>=' | '<=' | '!=';
export type LogicalOperator = 'deve' | 'não deve';
export type TimeRelation = 'antes' | 'depois' | 'entre';

export interface CycleRule {
    id: string;
    topic1: string;
    logicalOperator: LogicalOperator;
    timeRelation: TimeRelation;
    topic2: string;
}

export interface CycleConfig {
    hoursPerTopic: number;
    minHoursPerTopic: number;
    selectedTopics: string[];
    rules: CycleRule[];
}

export interface CycleBlock {
    id: string;
    topicId: string;
    topicName: string;
    position: number;
    hours: number;
    completed: boolean;
    completedAt?: Date;
}

export interface Cycle {
    id: string;
    number: number;
    config: CycleConfig;
    blocks: CycleBlock[];
    totalHours: number;
    completedHours: number;
    remainingHours: number;
    createdAt: Date;
    updatedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    isActive: boolean;
}

export interface CycleSummary {
    totalCycles: number;
    totalStudyHours: number;
    currentCycle: Cycle | null;
}

export type { Topic };