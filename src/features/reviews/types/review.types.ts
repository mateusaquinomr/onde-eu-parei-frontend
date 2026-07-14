import type { Topic, Content, ReviewHistoryItem } from '@/features/topics/types/topic.types';

export const REVIEW_INTERVALS_DAYS = [1, 7, 30, 30, 30] as const;

export interface DueReviewItem {
    topicId: string;
    topicName: string;
    contentId: string;
    contentTitle: string;
    nextReviewDate: Date;
    daysOverdue: number;
    stage: number;
}

export type { ReviewHistoryItem, Topic, Content };