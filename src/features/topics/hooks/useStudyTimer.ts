import { useState, useEffect, useCallback, useRef } from 'react';
import { studyTimerService } from '../services/studyTimerService';

interface UseStudyTimerProps {
    contentId: string;
    estimatedTime: number;
    initialElapsedTime?: number;
    onTimeUpdate?: (contentId: string, elapsedSeconds: number) => void;
    onComplete?: (contentId: string, totalSeconds: number) => void;
}

export function useStudyTimer({
    contentId,
    estimatedTime,
    initialElapsedTime = 0,
    onTimeUpdate,
    onComplete
}: UseStudyTimerProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsedTime);
    const [isCompleted, setIsCompleted] = useState(false);

    const estimatedSeconds = estimatedTime * 60;
    const progress = Math.min((elapsedSeconds / estimatedSeconds) * 100, 100);

    const elapsedSecondsRef = useRef(elapsedSeconds);

    useEffect(() => {
        elapsedSecondsRef.current = elapsedSeconds;
    }, [elapsedSeconds]);

    useEffect(() => {
        let intervalId: number;

        if (isRunning && !isCompleted) {
            intervalId = setInterval(() => {
                setElapsedSeconds(prev => {
                    const newValue = prev + 1;

                    if (newValue >= estimatedSeconds) {
                        setIsRunning(false);
                        setIsCompleted(true);

                        studyTimerService.saveProgress(contentId, estimatedSeconds);
                        onComplete?.(contentId, estimatedSeconds);
                    }

                    if (newValue % 30 === 0 || newValue === estimatedSeconds) {
                        studyTimerService.saveProgress(contentId, newValue);
                    }

                    onTimeUpdate?.(contentId, newValue);
                    return newValue;
                });
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, isCompleted, estimatedSeconds, contentId, onTimeUpdate, onComplete]);

    useEffect(() => {
        return () => {
            if (elapsedSecondsRef.current > 0) {
                studyTimerService.saveProgress(contentId, elapsedSecondsRef.current);
            }
        };
    }, [contentId]);

    const start = useCallback(() => {
        if (!isCompleted) {
            setIsRunning(true);
        }
    }, [isCompleted]);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        setElapsedSeconds(0);
        setIsCompleted(false);
        studyTimerService.clearProgress(contentId);
    }, [contentId]);

    const jumpTo = useCallback((seconds: number) => {
        if (seconds <= estimatedSeconds) {
            setElapsedSeconds(seconds);
            if (seconds >= estimatedSeconds) {
                setIsCompleted(true);
                setIsRunning(false);
            }
        }
    }, [estimatedSeconds]);

    const formatTime = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return {

        isRunning,
        elapsedSeconds,
        isCompleted,
        progress,
        estimatedSeconds,

        start,
        pause,
        reset,
        jumpTo,

        formattedTime: formatTime(elapsedSeconds),
        formattedEstimated: formatTime(estimatedSeconds)
    };
}