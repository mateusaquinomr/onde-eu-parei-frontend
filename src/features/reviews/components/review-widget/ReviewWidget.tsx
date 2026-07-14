import { useState } from 'react';
import type { Topic } from '@/features/topics/types/topic.types';
import { useDueReviews } from '../../hooks/useReviews';
import { REVIEW_INTERVALS_DAYS } from '../../types/review.types';
import styles from './ReviewWidget.module.css';

interface ReviewWidgetProps {
    topics: Topic[];
    onCompleteReview: (topicId: string, contentId: string, durationMinutes: number) => void;
}

export function ReviewWidget({ topics, onCompleteReview }: ReviewWidgetProps) {
    const dueReviews = useDueReviews(topics);
    const [durations, setDurations] = useState<Record<string, string>>({});

    const handleDurationChange = (contentId: string, value: string) => {
        setDurations(prev => ({ ...prev, [contentId]: value }));
    };

    const handleComplete = (topicId: string, contentId: string) => {
        const raw = durations[contentId];
        const duration = raw ? Math.max(0, Math.floor(Number(raw))) : 0;
        onCompleteReview(topicId, contentId, duration);
        setDurations(prev => {
            const updated = { ...prev };
            delete updated[contentId];
            return updated;
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Revisões</h3>
                {dueReviews.length > 0 && (
                    <span className={styles.countBadge}>{dueReviews.length}</span>
                )}
            </div>

            {dueReviews.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className="material-icons">event_available</span>
                    <p>Nenhuma revisão pendente hoje</p>
                </div>
            ) : (
                <ul className={styles.list}>
                    {dueReviews.map((item) => (
                        <li
                            key={item.contentId}
                            className={`${styles.item} ${item.daysOverdue > 0 ? styles.overdueItem : ''}`}
                        >
                            <div className={styles.itemInfo}>
                                <span className={styles.topicName}>{item.topicName}</span>
                                <span className={styles.contentTitle}>{item.contentTitle}</span>
                                <span className={styles.stageLabel}>
                                    Revisão {item.stage + 1} de {REVIEW_INTERVALS_DAYS.length}
                                    {item.daysOverdue > 0 && (
                                        <span className={styles.overdueTag}>
                                            · {item.daysOverdue} {item.daysOverdue === 1 ? 'dia' : 'dias'} atrasada
                                        </span>
                                    )}
                                </span>
                            </div>

                            <div className={styles.itemActions}>
                                <input
                                    className={styles.durationInput}
                                    type="number"
                                    min={0}
                                    placeholder="min"
                                    value={durations[item.contentId] || ''}
                                    onChange={(e) => handleDurationChange(item.contentId, e.target.value)}
                                />
                                <button
                                    className={styles.completeButton}
                                    onClick={() => handleComplete(item.topicId, item.contentId)}
                                    title="Marcar como revisado"
                                >
                                    <span className="material-icons">check</span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}