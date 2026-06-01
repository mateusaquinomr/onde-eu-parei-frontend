import { useState, useEffect } from 'react';
import { useStudyTimer } from '../../../hooks/useStudyTimer';
import type { TimerProps } from '../../../types/timer.types';
import styles from './Timer.module.css';

export function Timer({
    topicId,
    contentId,
    topicName,
    contentTitle,
    estimatedTime,
    initialElapsedTime = 0,
    onTimeUpdate,
    onComplete,
    onCompleteWithConfirmation,
    onMinuteTick,
    onContinue,
    className = ''
}: TimerProps) {
    const {
        isRunning,
        elapsedSeconds,
        isCompleted: timerCompleted,
        progress,
        formattedTime,
        formattedEstimated,
        start,
        pause,
        reset,
        addTime
    } = useStudyTimer({
        contentId,
        estimatedTime,
        initialElapsedTime,
        onTimeUpdate,
        onComplete: (contentId, totalSeconds) => {

            onComplete?.(contentId, totalSeconds);
        },
        onMinuteTick
    });

    const [isActive, setIsActive] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);


    useEffect(() => {
        if (isRunning && !isActive) {
            setIsTransitioning(true);
            setTimeout(() => {
                setIsActive(true);
                setTimeout(() => setIsTransitioning(false), 300);
            }, 50);
        } else if (!isRunning && isActive && !timerCompleted) {
            setIsTransitioning(true);
            setIsActive(false);
            setTimeout(() => setIsTransitioning(false), 300);
        } else if (timerCompleted && isActive) {
            setIsActive(false);
        }
    }, [isRunning, timerCompleted, isActive]);

    useEffect(() => {
        if (timerCompleted) {
            setShowConfirmation(true);
        }
    }, [timerCompleted]);

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const handleContinue = () => {
        addTime(15 * 60);
        onContinue?.(contentId);
        setShowConfirmation(false);
    };

    const handleCompleteConfirm = (contentCompleted: boolean) => {
        setShowConfirmation(false);

        onCompleteWithConfirmation?.(contentId, elapsedSeconds, contentCompleted);
    };

    if (isActive && isRunning && !timerCompleted) {
        return (
            <div className={`${styles.container} ${className}`}>
                <div className={styles.header}>
                    <div>
                        <h3 className={styles.topicName}>{topicName}</h3>
                        <p className={styles.contentTitle}>{contentTitle}</p>
                    </div>
                </div>

                <div className={`${styles.activeContent} ${isTransitioning ? styles.transitioning : ''}`}>
                    <div className={styles.activeTimerWrapper}>
                        <svg
                            className={styles.activeProgressRing}
                            viewBox="0 0 200 200"
                            width="200"
                            height="200"
                        >
                            <circle
                                className={styles.backgroundRing}
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                strokeWidth="8"
                            />
                            <circle
                                className={styles.progressRingFill}
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                transform="rotate(-90 100 100)"
                                style={{
                                    transition: 'stroke-dashoffset 0.3s ease'
                                }}
                            />
                            <g className={styles.textGroup}>
                                <text
                                    className={styles.activeCurrentTimeText}
                                    x="100"
                                    y="85"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {formattedTime}
                                </text>
                                <text
                                    className={styles.activeEstimatedTimeText}
                                    x="100"
                                    y="115"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {formattedEstimated}
                                </text>
                            </g>
                        </svg>
                    </div>

                    <div className={styles.pauseWrapper}>
                        <button
                            className={styles.pauseIconButton}
                            onClick={pause}
                            title="Pausar"
                        >
                            <span className="material-icons">pause</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.topicName}>{topicName}</h3>
                    <p className={styles.contentTitle}>{contentTitle}</p>
                </div>
                {timerCompleted && (
                    <span className={styles.completedBadge}>Tempo concluído!</span>
                )}
            </div>

            <div className={styles.mainContent}>
                <div className={styles.timerWrapper}>
                    <svg
                        className={styles.progressRing}
                        viewBox="0 0 160 160"
                        width="160"
                        height="160"
                    >
                        <circle
                            className={styles.backgroundRing}
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="none"
                            strokeWidth="8"
                        />
                        <circle
                            className={styles.progressRingFill}
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="none"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 80 80)"
                            style={{
                                transition: 'stroke-dashoffset 0.3s ease'
                            }}
                        />
                        <g className={styles.textGroup}>
                            <text
                                className={styles.currentTimeText}
                                x="80"
                                y="70"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {formattedTime}
                            </text>
                            <text
                                className={styles.estimatedTimeText}
                                x="80"
                                y="95"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {formattedEstimated}
                            </text>
                        </g>
                    </svg>
                </div>

                <div className={styles.actionsWrapper}>
                    {!timerCompleted ? (
                        <>
                            {!isRunning ? (
                                <button
                                    className={`${styles.actionButton} ${styles.startButton}`}
                                    onClick={start}
                                >
                                    <span className="material-icons">play_arrow</span>
                                    Iniciar
                                </button>
                            ) : (
                                <button
                                    className={`${styles.actionButton} ${styles.pauseButton}`}
                                    onClick={pause}
                                >
                                    <span className="material-icons">pause</span>
                                    Pausar
                                </button>
                            )}

                            <button
                                className={`${styles.actionButton} ${styles.resetButton} ${elapsedSeconds === 0 ? styles.disabled : ''}`}
                                onClick={reset}
                                disabled={elapsedSeconds === 0}
                            >
                                <span className="material-icons">refresh</span>
                                Reiniciar
                            </button>
                        </>
                    ) : showConfirmation ? (
                        <div className={styles.confirmationContainer}>
                            <p className={styles.confirmationText}>
                                Você concluiu o estudo de "{contentTitle}"?
                            </p>
                            <div className={styles.confirmationButtons}>
                                <button
                                    className={`${styles.actionButton} ${styles.confirmYesButton}`}
                                    onClick={() => handleCompleteConfirm(true)}
                                >
                                    <span className="material-icons">check</span>
                                    Sim
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.confirmNoButton}`}
                                    onClick={() => handleCompleteConfirm(false)}
                                >
                                    <span className="material-icons">close</span>
                                    Não
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                className={`${styles.actionButton} ${styles.completeButton}`}
                                onClick={() => setShowConfirmation(true)}
                            >
                                <span className="material-icons">check_circle</span>
                                Concluir
                            </button>
                            <button
                                className={`${styles.actionButton} ${styles.continueButton}`}
                                onClick={handleContinue}
                            >
                                <span className="material-icons">play_circle</span>
                                Continuar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}