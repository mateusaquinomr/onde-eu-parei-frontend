import { Timer } from '../Timer/Timer';
import { StudyTools } from '../StudyTools';
import type { ChecklistItem, QuestionList } from '../../../types/topic.types';
import styles from './StudyWidget.module.css';

interface StudyWidgetProps {
    topicId: string;
    contentId: string;
    topicName: string;
    contentTitle: string;
    estimatedTime: number;
    initialElapsedTime?: number;
    onTimeUpdate?: (contentId: string, elapsedSeconds: number) => void;
    onMinuteTick?: (contentId: string, minutes: number) => void;
    onCompleteWithConfirmation?: (contentId: string, totalSeconds: number, contentCompleted: boolean) => void;
    onContinue?: (contentId: string) => void;
    checklist?: ChecklistItem[];
    onUpdateChecklist?: (items: ChecklistItem[]) => void;
    questionLists?: QuestionList[];
    onUpdateQuestions?: (lists: QuestionList[]) => void;
    className?: string;
}

export function StudyWidget({
    topicId,
    contentId,
    topicName,
    contentTitle,
    estimatedTime,
    initialElapsedTime,
    onTimeUpdate,
    onMinuteTick,
    onCompleteWithConfirmation,
    onContinue,
    checklist,
    onUpdateChecklist,
    questionLists,
    onUpdateQuestions,
    className = ''
}: StudyWidgetProps) {
    return (
        <div className={`${styles.studyWidget} ${className}`}>
            <div className={styles.timerSection}>
                <Timer
                    topicId={topicId}
                    contentId={contentId}
                    topicName={topicName}
                    contentTitle={contentTitle}
                    estimatedTime={estimatedTime}
                    initialElapsedTime={initialElapsedTime}
                    onTimeUpdate={onTimeUpdate}
                    onMinuteTick={onMinuteTick}
                    onCompleteWithConfirmation={onCompleteWithConfirmation}
                    onContinue={onContinue}
                />
            </div>

            <div className={styles.toolsSection}>
                <StudyTools
                    topicId={topicId}
                    contentId={contentId}
                    checklist={checklist}
                    onUpdateChecklist={onUpdateChecklist}
                    questionLists={questionLists}
                    onUpdateQuestions={onUpdateQuestions}
                />
            </div>
        </div>
    );
}