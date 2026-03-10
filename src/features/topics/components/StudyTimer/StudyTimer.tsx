import React from 'react';
import { useStudyTimer } from '../../hooks/useStudyTimer';
import type { StudyTimerProps } from './StudyTimer.types';
import styles from './StudyTimer.module.css';

export function StudyTimer({
    topicId,
    contentId,
    topicName,
    contentTitle,
    estimatedTime,
    initialElapsedTime = 0,
    onTimeUpdate,
    onComplete,
    className = ''
}: StudyTimerProps) {
    const {
        isRunning,
        elapsedSeconds,
        isCompleted,
        progress,
        formattedTime,
        formattedEstimated,
        start,
        pause,
        reset
    } = useStudyTimer({
        contentId,
        estimatedTime,
        initialElapsedTime,
        onTimeUpdate,
        onComplete
    });

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className={`${styles.container} ${className}`}>

            <div className={styles.header}>
                <div>
                    <h3 className={styles.topicName}>{topicName}</h3>
                    <p className={styles.contentTitle}>{contentTitle}</p>
                </div>
                {isCompleted && (
                    <span className={styles.completedBadge}>Concluído!</span>
                )}
            </div>

            <div className={styles.timerContainer}>
                <svg
                    className={styles.progressRing}
                    viewBox="0 0 200 200"
                >

                    <circle
                        className={styles.backgroundRing}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        strokeWidth="10"
                    />

                    <circle
                        className={styles.progressRingFill}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        strokeWidth="10"
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
                            className={styles.currentTimeText}
                            x="100"
                            y="85"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {formattedTime}
                        </text>

                        <text
                            className={styles.estimatedTimeText}
                            x="100"
                            y="120"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {formattedEstimated}
                        </text>
                    </g>
                </svg>
            </div>

            <div className={styles.controls}>
                {!isRunning ? (
                    <button
                        className={`${styles.button} ${styles.startButton}`}
                        onClick={start}
                        disabled={isCompleted}
                    >
                        {isCompleted ? 'Concluído' : 'Iniciar'}
                    </button>
                ) : (
                    <button
                        className={`${styles.button} ${styles.pauseButton}`}
                        onClick={pause}
                    >
                        Pausar
                    </button>
                )}

                {elapsedSeconds > 0 && !isRunning && (
                    <button
                        className={`${styles.button} ${styles.resetButton}`}
                        onClick={reset}
                    >
                        Reiniciar
                    </button>
                )}
            </div>
        </div>
    );
}