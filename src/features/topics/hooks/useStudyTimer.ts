import { useState, useEffect, useCallback, useRef } from 'react';
import { studyTimerService } from '../services/studyTimerService';

interface UseStudyTimerProps {
    contentId: string;
    estimatedTime: number;
    initialElapsedTime?: number;
    onTimeUpdate?: (contentId: string, elapsedSeconds: number) => void;
    onComplete?: (contentId: string, totalSeconds: number) => void;
    onMinuteTick?: (contentId: string, minutes: number) => void;
}

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

    const estimatedSeconds = estimatedTime * 60;
    const progress = Math.min((elapsedSeconds / estimatedSeconds) * 100, 100);

    const intervalRef = useRef<number | null>(null);
    const lastMinuteRef = useRef(0);
    const isProcessingRef = useRef(false);

    useEffect(() => {
        const loadSavedProgress = () => {
            let savedSeconds = 0;

            if (initialElapsedTime > 0) {
                savedSeconds = Math.floor(initialElapsedTime);
                console.log(`📀 Usando initialElapsedTime: ${savedSeconds}s`);
            } else {
                const savedProgress = studyTimerService.getProgress(contentId);
                if (savedProgress && savedProgress.elapsedSeconds > 0) {
                    savedSeconds = Math.floor(savedProgress.elapsedSeconds);
                    console.log(`Carregando do localStorage: ${savedSeconds}s`);
                } else {
                    console.log(`Iniciando do zero: 0s`);
                }
            }

            setElapsedSeconds(savedSeconds);
            lastMinuteRef.current = Math.floor(savedSeconds / 60);
            setIsInitialized(true);
        };

        loadSavedProgress();
    }, [contentId, initialElapsedTime]);

    const tick = useCallback(() => {
        if (!isRunning || isCompleted) return;

        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        setElapsedSeconds(prev => {
            const newValue = prev + 1;

            if (newValue >= estimatedSeconds) {
                setIsRunning(false);
                setIsCompleted(true);
                studyTimerService.saveProgress(contentId, estimatedSeconds);
                onComplete?.(contentId, estimatedSeconds);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                isProcessingRef.current = false;
                return estimatedSeconds;
            }

            const newMinute = Math.floor(newValue / 60);
            if (newMinute > lastMinuteRef.current && onMinuteTick) {
                const minutesPassed = newMinute - lastMinuteRef.current;
                lastMinuteRef.current = newMinute;
                console.log(`Minuto completado: ${newMinute} min`);
                onMinuteTick(contentId, minutesPassed);
            }

            if (newValue % 10 === 0) {
                studyTimerService.saveProgress(contentId, newValue);
            }

            onTimeUpdate?.(contentId, newValue);
            isProcessingRef.current = false;
            return newValue;
        });
    }, [isRunning, isCompleted, estimatedSeconds, contentId, onTimeUpdate, onComplete, onMinuteTick]);

    useEffect(() => {
        if (!isInitialized) return;

        if (isRunning && !isCompleted) {
            console.log(`Timer iniciado (setInterval a cada 1 segundo)`);
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

    const start = useCallback(() => {
        if (!isCompleted && isInitialized) {
            console.log(`Start chamado - elapsedSeconds: ${elapsedSeconds}`);
            setIsRunning(true);
        }
    }, [isCompleted, isInitialized, elapsedSeconds]);

    const pause = useCallback(() => {
        console.log(`Pause chamado - elapsedSeconds: ${elapsedSeconds}`);
        setIsRunning(false);
        if (elapsedSeconds > 0) {
            studyTimerService.saveProgress(contentId, Math.floor(elapsedSeconds));
        }
    }, [elapsedSeconds, contentId]);

    const reset = useCallback(() => {
        console.log(`Reset chamado`);
        setIsRunning(false);
        setElapsedSeconds(0);
        setIsCompleted(false);
        lastMinuteRef.current = 0;
        studyTimerService.clearProgress(contentId);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [contentId]);

    const addTime = useCallback((secondsToAdd: number) => {
        setElapsedSeconds(prev => {
            const newValue = prev + secondsToAdd;
            console.log(`Adicionando ${secondsToAdd}s, novo total: ${newValue}s`);
            if (newValue < estimatedSeconds) {
                if (isCompleted) setIsCompleted(false);
                return newValue;
            }
            setIsCompleted(true);
            setIsRunning(false);
            return estimatedSeconds;
        });
    }, [estimatedSeconds, isCompleted]);

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
        estimatedSeconds,
        start,
        pause,
        reset,
        addTime,
        formattedTime: formatTime(elapsedSeconds),
        formattedEstimated: formatEstimated(estimatedSeconds)
    };
}