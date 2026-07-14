import { useMemo } from 'react';
import type { Topic } from '@/features/topics/types/topic.types';
import { getDueReviews } from '../services/reviewService';
import type { DueReviewItem } from '../types/review.types';

export function useDueReviews(topics: Topic[]): DueReviewItem[] {
    return useMemo(() => getDueReviews(topics), [topics]);
}