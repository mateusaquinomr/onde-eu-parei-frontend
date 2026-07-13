import { useState, useEffect, useCallback, useRef } from 'react';
import { studyTimerService } from '../services/studyTimerService';
import type { UseStudyTimerProps } from '../types/study.types';

export function useStudyTimer({
    contentId,
    estimatedTime,
    initialElapsedTime = 0,
    onTimeUpdate,
    onComplete,
    onMinuteTick
}: UseStudyTimerProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const [targetSeconds, setTargetSeconds] = useState(estimatedTime * 60);
    const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100);

    const intervalRef = useRef<number | null>(null);
    const lastMinuteRef = useRef(0);

    const baseElapsedRef = useRef(0);
    const startTimestampRef = useRef<number | null>(null);

    useEffect(() => {
        let savedSeconds = 0;

        if (initialElapsedTime > 0) {
            savedSeconds = Math.floor(initialElapsedTime);
        } else {
            const savedProgress = studyTimerService.getProgress(contentId);
            if (savedProgress && savedProgress.elapsedSeconds > 0) {
                savedSeconds = Math.floor(savedProgress.elapsedSeconds);
            }
        }

        setElapsedSeconds(savedSeconds);
        baseElapsedRef.current = savedSeconds;
        lastMinuteRef.current = Math.floor(savedSeconds / 60);
        setTargetSeconds(estimatedTime * 60);
        setIsRunning(false);
        setIsCompleted(false);
        setIsInitialized(true);

    }, [contentId]);

    const computeElapsed = useCallback(() => {
        if (!isRunning || startTimestampRef.current === null) {
            return baseElapsedRef.current;
        }
        const runningSeconds = (Date.now() - startTimestampRef.current) / 1000;
        return baseElapsedRef.current + runningSeconds;
    }, [isRunning]);

    const applyElapsed = useCallback((rawElapsed: number, target: number) => {
        const cappedElapsed = Math.min(rawElapsed, target);
        const newValue = Math.floor(cappedElapsed);

        setElapsedSeconds(prevDisplayed => {
            if (newValue === prevDisplayed) return prevDisplayed;

            const newMinute = Math.floor(newValue / 60);
            if (newMinute > lastMinuteRef.current) {
                const minutesPassed = newMinute - lastMinuteRef.current;
                lastMinuteRef.current = newMinute;
                onMinuteTick?.(contentId, minutesPassed);
            }

            if (newValue % 10 === 0 || newValue >= target) {
                studyTimerService.saveProgress(contentId, newValue);
            }

            onTimeUpdate?.(contentId, newValue);
            return newValue;
        });

        if (rawElapsed >= target) {
            baseElapsedRef.current = target;
            startTimestampRef.current = null;
            setIsRunning(false);
            setIsCompleted(true);
            studyTimerService.saveProgress(contentId, target);
            onComplete?.(contentId, target);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [contentId, onTimeUpdate, onComplete, onMinuteTick]);

    const tick = useCallback(() => {
        if (!isRunning || isCompleted) return;
        applyElapsed(computeElapsed(), targetSeconds);
    }, [isRunning, isCompleted, computeElapsed, applyElapsed, targetSeconds]);

    useEffect(() => {
        if (!isInitialized) return;

        if (isRunning && !isCompleted) {
            intervalRef.current = window.setInterval(tick, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, isCompleted, isInitialized, tick]);

    useEffect(() => {
        const handleVisibilityOrFocus = () => {
            if (document.visibilityState === 'visible') {
                tick();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityOrFocus);
        window.addEventListener('focus', handleVisibilityOrFocus);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
            window.removeEventListener('focus', handleVisibilityOrFocus);
        };
    }, [tick]);

    const start = useCallback(() => {
        if (!isCompleted && isInitialized) {
            startTimestampRef.current = Date.now();
            setIsRunning(true);
        }
    }, [isCompleted, isInitialized]);

    const pause = useCallback((): number => {
        const finalElapsed = Math.min(computeElapsed(), targetSeconds);
        baseElapsedRef.current = finalElapsed;
        startTimestampRef.current = null;
        setIsRunning(false);
        applyElapsed(finalElapsed, targetSeconds);
        if (finalElapsed > 0) {
            studyTimerService.saveProgress(contentId, Math.floor(finalElapsed));
        }
        return Math.floor(finalElapsed);
    }, [computeElapsed, applyElapsed, targetSeconds, contentId]);

    const reset = useCallback(() => {
        setIsRunning(false);
        setElapsedSeconds(0);
        setIsCompleted(false);
        baseElapsedRef.current = 0;
        startTimestampRef.current = null;
        lastMinuteRef.current = 0;
        setTargetSeconds(estimatedTime * 60);
        studyTimerService.clearProgress(contentId);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [contentId, estimatedTime]);

    const addTime = useCallback((secondsToAdd: number) => {
        setTargetSeconds(prev => prev + secondsToAdd);
        setIsCompleted(false);
        startTimestampRef.current = Date.now();
        setIsRunning(true);
    }, []);

    const formatTime = (totalSeconds: number): string => {
        const absSeconds = Math.floor(Math.abs(totalSeconds));
        const minutes = Math.floor(absSeconds / 60);
        const seconds = absSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatEstimated = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        return `${minutes}min`;
    };

    return {
        isRunning,
        elapsedSeconds,
        isCompleted,
        progress,
        estimatedSeconds: targetSeconds,
        start,
        pause,
        reset,
        addTime,
        formattedTime: formatTime(elapsedSeconds),
        formattedEstimated: formatEstimated(targetSeconds)
    };
}
