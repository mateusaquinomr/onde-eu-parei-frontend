export interface StudyProgress {
    contentId: string;
    elapsedSeconds: number;
    lastUpdated: string;
    completed: boolean;
}

export interface UseStudyTimerProps {
    contentId: string;
    estimatedTime: number;
    initialElapsedTime?: number;
    onTimeUpdate?: (contentId: string, elapsedSeconds: number) => void;
    onComplete?: (contentId: string, totalSeconds: number) => void;
    onMinuteTick?: (contentId: string, minutes: number) => void;
}

export interface TimerProps {
    topicId: string;
    contentId: string;
    topicName: string;
    contentTitle: string;
    estimatedTime: number;
    initialElapsedTime?: number;
    onTimeUpdate?: (contentId: string, elapsedSeconds: number) => void;
    onComplete?: (contentId: string, totalSeconds: number) => void;
    onCompleteWithConfirmation?: (contentId: string, totalSeconds: number, contentCompleted: boolean) => void;
    onMinuteTick?: (contentId: string, minutes: number) => void;
    onContinue?: (contentId: string) => void;
    className?: string;
}

export interface TimerState {
    isRunning: boolean;
    elapsedSeconds: number;
    isCompleted: boolean;
    showConfirmation: boolean;
}

export type TimerAction =
    | { type: 'START' }
    | { type: 'PAUSE' }
    | { type: 'RESET' }
    | { type: 'TICK' }
    | { type: 'SET_ELAPSED'; payload: number }
    | { type: 'SHOW_CONFIRMATION' }
    | { type: 'HIDE_CONFIRMATION' };

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
    order: number;
}

export interface ChecklistProps {
    topicId: string;
    contentId: string;
    checklist?: ChecklistItem[];
    onUpdateChecklist?: (items: ChecklistItem[]) => void;
}

export interface QuestionList {
    id: string;
    title: string;
    total: number;
    hits: number;
}

export interface QuestionsProps {
    topicId: string;
    contentId: string;
    questionLists?: QuestionList[];
    onUpdateQuestions?: (lists: QuestionList[]) => void;
}

export interface Note {
    id: string;
    text: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface NotesProps {
    topicId: string;
    contentId: string;
    showHeader?: boolean;
}

export interface StudyToolsProps {
    topicId: string;
    contentId: string;
    checklist?: ChecklistItem[];
    onUpdateChecklist?: (items: ChecklistItem[]) => void;
    questionLists?: QuestionList[];
    onUpdateQuestions?: (lists: QuestionList[]) => void;
}

export interface StudyWidgetProps {
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