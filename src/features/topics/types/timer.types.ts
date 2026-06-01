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