import { useState } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import { Select } from '@/shared/components/ui/Form/Select';
import { DragHandle } from '../DragHandle/DragHandle';
import { StudyTools } from '@/features/study/components/study-tools/StudyTools';
import type { Content, ImportanceLevel, ChecklistItem, QuestionList } from '../../types/topic.types';
import styles from './ContentItem.module.css';

interface ContentItemProps {
    content: Content;
    topicId: string;
    index: number;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (id: string, title: string, importance: ImportanceLevel) => void;
    onCancel: () => void;
    onDelete: () => void;
    onToggleComplete: () => void;
    onUpdateChecklist: (contentId: string, items: ChecklistItem[]) => void;
    onUpdateNotes: (contentId: string, notes: string) => void;
    onUpdateQuestions?: (contentId: string, lists: QuestionList[]) => void;
    onCompleteReview?: (contentId: string, durationMinutes: number) => void;
    dragHandleProps?: any;
}

const importanceOptions = [
    { label: 'Pouco importante', value: 'pouco' },
    { label: 'Normal', value: 'normal' },
    { label: 'Muito importante', value: 'muita' }
];

const importanceColors = {
    pouco: '#9CA3AF',
    normal: '#3B82F6',
    muita: '#EF4444'
};

const importanceLabels = {
    pouco: 'Pouco importante',
    normal: 'Normal',
    muita: 'Muito importante'
};

export function ContentItem({
    content,
    topicId,
    index,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onToggleComplete,
    onUpdateChecklist,
    onUpdateNotes,
    onUpdateQuestions,
    onCompleteReview,
    dragHandleProps
}: ContentItemProps) {
    const [editTitle, setEditTitle] = useState(content.title);
    const [editImportance, setEditImportance] = useState<ImportanceLevel>(content.importance);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [reviewDuration, setReviewDuration] = useState('');

    const handleCompleteReview = () => {
        const duration = reviewDuration ? Math.max(0, Math.floor(Number(reviewDuration))) : 0;
        onCompleteReview?.(content.id, duration);
        setReviewDuration('');
    };

    const handleSave = () => {
        if (editTitle.trim()) {
            onSave(content.id, editTitle, editImportance);
        }
    };

    const handleToggleComplete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleComplete();
    };

    const handleDelete = () => {
        setShowMenu(false);
        onDelete();
    };

    const handleEdit = () => {
        setShowMenu(false);
        onEdit();
    };

    const handleExpandClick = () => {
        setIsExpanded(!isExpanded);
    };

    const formatTime = (minutes: number) => {
        if (!minutes || minutes === 0) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}min`;
        }
        return `${mins}min`;
    };

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return '—';
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
        }).format(new Date(date));
    };

    const getDaysUntil = (date: Date | null | undefined): string => {
        if (!date) return '';
        const today = new Date();
        const reviewDate = new Date(date);
        const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
        const reviewUTC = Date.UTC(reviewDate.getUTCFullYear(), reviewDate.getUTCMonth(), reviewDate.getUTCDate());
        const diffDays = Math.round((reviewUTC - todayUTC) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'hoje';
        if (diffDays === 1) return 'amanhã';
        if (diffDays < 0) return `${Math.abs(diffDays)} dias atrasado`;
        return `em ${diffDays} dias`;
    };

    if (isEditing) {
        return (
            <div className={styles.contentItem}>
                <div className={styles.contentRow}>
                    <DragHandle dragHandleProps={dragHandleProps} />
                    <div className={styles.contentIndex}>{index}</div>
                    <div className={styles.contentEditFields}>
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            autoFocus
                            placeholder="Título do conteúdo"
                            className={styles.editTitleInput}
                        />
                        <div className={styles.editImportanceWrapper}>
                            <Select
                                value={editImportance}
                                onChange={(value) => setEditImportance(value as ImportanceLevel)}
                                options={importanceOptions}
                            />
                        </div>
                    </div>
                    <div className={styles.contentActions}>
                        <Button
                            variant="ghost"
                            icon={<span className="material-icons">check</span>}
                            onClick={handleSave}
                            aria-label="Salvar"
                        />
                        <Button
                            variant="ghost"
                            icon={<span className="material-icons">close</span>}
                            onClick={onCancel}
                            aria-label="Cancelar"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.contentItem} ${isExpanded ? styles.expanded : ''}`}>

            <div className={styles.clickableContainer} onClick={handleExpandClick}>
                <div className={styles.topRow}>
                    <DragHandle dragHandleProps={dragHandleProps} />
                    <div className={styles.contentIndex}>{index}</div>

                    <div className={styles.titleWrapper}>
                        <Text variant="body" className={content.completed ? styles.completedText : ''}>
                            {content.title}
                        </Text>
                        <div
                            className={styles.importanceDot}
                            style={{ backgroundColor: importanceColors[content.importance] }}
                            title={importanceLabels[content.importance]}
                        />
                    </div>

                    <div className={styles.statsGroup}>
                        {content.studyData?.totalTimeSpent > 0 && (
                            <span className={styles.stat}>
                                <span className="material-icons">schedule</span>
                                {formatTime(content.studyData.totalTimeSpent)}
                            </span>
                        )}
                        {content.checklist && content.checklist.length > 0 && (
                            <span className={styles.stat}>
                                <span className="material-icons">checklist</span>
                                {content.checklist.filter(i => i.completed).length}/{content.checklist.length}
                            </span>
                        )}
                    </div>

                    <div className={styles.actionsGroup}>
                        <button
                            className={`${styles.checkboxBtn} ${content.completed ? styles.completed : ''}`}
                            onClick={handleToggleComplete}
                            aria-label={content.completed ? "Marcar como não concluído" : "Marcar como concluído"}
                        >
                            <span className="material-icons">
                                {content.completed ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                        </button>

                        <div className={styles.menuContainer}>
                            <button
                                className={styles.menuBtn}
                                onClick={() => setShowMenu(!showMenu)}
                                aria-label="Opções"
                            >
                                <span className="material-icons">more_vert</span>
                            </button>

                            {showMenu && (
                                <div className={styles.menuDropdown}>
                                    <button className={styles.menuItem} onClick={handleEdit}>
                                        <span className="material-icons">edit</span>
                                        Editar
                                    </button>
                                    <button className={`${styles.menuItem} ${styles.deleteItem}`} onClick={handleDelete}>
                                        <span className="material-icons">delete</span>
                                        Excluir
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className={styles.expandedContent}>

                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statCardHeader}>
                                <span className="material-icons">schedule</span>
                                <span className={styles.statCardTitle}>Tempo de estudo</span>
                            </div>
                            <div className={styles.statCardValue}>
                                {formatTime(content.studyData?.totalTimeSpent || 0) || '0min'}
                            </div>
                            <div className={styles.statCardLabel}>total estudado</div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statCardHeader}>
                                <span className="material-icons">event</span>
                                <span className={styles.statCardTitle}>Datas de Estudo</span>
                            </div>
                            <div className={styles.statCardDates}>
                                <div className={styles.dateRow}>
                                    <span>Início: {formatDate(content.studyData?.startedAt)}</span>
                                </div>
                                <div className={styles.dateRow}>
                                    <span>Conclusão: {formatDate(content.studyData?.completedAt)}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statCardHeader}>
                                <span className="material-icons">refresh</span>
                                <span className={styles.statCardTitle}>Próxima Revisão</span>
                            </div>
                            <div className={styles.statCardValue}>
                                {content.studyData?.nextReviewDate ? formatDate(content.studyData.nextReviewDate) : '—'}
                            </div>
                            {content.studyData?.nextReviewDate && (
                                <div className={styles.statCardLabel}>
                                    {getDaysUntil(content.studyData.nextReviewDate)}
                                </div>
                            )}
                            {content.studyData?.nextReviewDate && onCompleteReview && (
                                <div className={styles.reviewActionRow}>
                                    <input
                                        className={styles.reviewDurationInput}
                                        type="number"
                                        min={0}
                                        placeholder="min"
                                        value={reviewDuration}
                                        onChange={(e) => setReviewDuration(e.target.value)}
                                    />
                                    <button
                                        className={styles.reviewCompleteButton}
                                        onClick={handleCompleteReview}
                                        title="Marcar como revisado"
                                    >
                                        <span className="material-icons">check</span>
                                        Revisado
                                    </button>
                                </div>
                            )}
                            {content.studyData?.reviewHistory && content.studyData.reviewHistory.length > 0 && (
                                <details className={styles.historyDetails}>
                                    <summary className={styles.historySummary}>
                                        <span className="material-icons">history</span>
                                        Histórico de revisões
                                    </summary>
                                    <div className={styles.historyList}>
                                        {content.studyData.reviewHistory.map((review, idx) => (
                                            <div key={idx} className={styles.historyItem}>
                                                <span className="material-icons">schedule</span>
                                                <span>{formatDate(review.date)}</span>
                                                <span className={styles.historyDuration}>{review.duration}min</span>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}
                        </div>
                    </div>

                    <StudyTools
                        topicId={topicId}
                        contentId={content.id}
                        checklist={content.checklist}
                        onUpdateChecklist={(items) => onUpdateChecklist(content.id, items)}
                        questionLists={content.studyData?.questionLists}
                        onUpdateQuestions={(lists) => onUpdateQuestions?.(content.id, lists)}
                    />
                </div>
            )}
        </div>
    );
}