export interface StudyTimerProps {
    topicId: string;
    contentId: string;
    topicName: string;
    contentTitle: string;
    estimatedTime: number;
    initialElapsedTime?: number;
    onTimeUpdate?: (contentId: string, elapsedSeconds: number) => void;
    onComplete?: (contentId: string, totalSeconds: number) => void;
    className?: string;
}

export interface TimerState {
    isRunning: boolean;
    elapsedSeconds: number;
    isCompleted: boolean;
}

export type TimerAction =
    | { type: 'START' }
    | { type: 'PAUSE' }
    | { type: 'RESET' }
    | { type: 'TICK' }
    | { type: 'SET_ELAPSED'; payload: number };