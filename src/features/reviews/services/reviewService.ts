import type { ReviewHistoryItem, Topic, DueReviewItem } from '../types/review.types';
import { REVIEW_INTERVALS_DAYS } from '../types/review.types';

function toUTCMidnight(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function getReviewStage(reviewHistory: ReviewHistoryItem[] | undefined): number {
    return reviewHistory?.length || 0;
}

export function calculateNextReviewDate(
    fromDate: Date,
    reviewHistory: ReviewHistoryItem[] | undefined
): Date | null {
    const stage = getReviewStage(reviewHistory);
    if (stage >= REVIEW_INTERVALS_DAYS.length) return null;

    const days = REVIEW_INTERVALS_DAYS[stage];
    const next = toUTCMidnight(fromDate);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
}

export function isReviewFinished(reviewHistory: ReviewHistoryItem[] | undefined): boolean {
    return getReviewStage(reviewHistory) >= REVIEW_INTERVALS_DAYS.length;
}

function daysBetweenUTC(from: Date, to: Date): number {
    const fromUTC = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const toUTC = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((toUTC - fromUTC) / (1000 * 60 * 60 * 24));
}

export function getDueReviews(topics: Topic[], today: Date = new Date()): DueReviewItem[] {
    const due: DueReviewItem[] = [];

    for (const topic of topics) {
        for (const content of topic.contents) {
            const nextReviewDate = content.studyData?.nextReviewDate;
            if (!nextReviewDate) continue;

            const nextDate = new Date(nextReviewDate);
            const daysOverdue = daysBetweenUTC(nextDate, today);
            if (daysOverdue < 0) continue;

            due.push({
                topicId: topic.id,
                topicName: topic.name,
                contentId: content.id,
                contentTitle: content.title,
                nextReviewDate: nextDate,
                daysOverdue,
                stage: getReviewStage(content.studyData?.reviewHistory)
            });
        }
    }

    return due.sort((a, b) => b.daysOverdue - a.daysOverdue);
}