import { useState, useEffect } from 'react';
import { useStudyTimer } from '../../hooks/useStudyTimer';
import type { TimerProps } from '../../types/study.types';
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
    onFinishContent,
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

    const [showConfirmation, setShowConfirmation] = useState(false);

    const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
    const [pendingFinishElapsed, setPendingFinishElapsed] = useState(0);

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


    const handleOpenFinishConfirmation = () => {
        const finalElapsed = pause();
        setPendingFinishElapsed(finalElapsed);
        setShowFinishConfirmation(true);
    };

    const handleFinishConfirm = (confirmed: boolean) => {
        setShowFinishConfirmation(false);
        if (confirmed) {
            onFinishContent?.(contentId, pendingFinishElapsed);
        } else {
            start();
        }
    };

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <h3 className={styles.topicName}>{topicName}</h3>
                    <p className={styles.contentTitle}>{contentTitle}</p>
                </div>

                {!timerCompleted && !showFinishConfirmation && (
                    <button
                        className={styles.finishIconButton}
                        onClick={handleOpenFinishConfirmation}
                        title="Concluir este conteúdo agora"
                    >
                        <span className="material-icons">task_alt</span>
                    </button>
                )}
            </div>

            {timerCompleted ? (
                showConfirmation ? (
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
                    <div className={styles.mainContent}>
                        <span className={styles.completedBadge}>Tempo concluído!</span>
                        <div className={styles.actionsWrapper}>
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
                        </div>
                    </div>
                )
            ) : showFinishConfirmation ? (
                <div className={styles.confirmationContainer}>
                    <p className={styles.confirmationText}>
                        Concluir "{contentTitle}" antecipadamente? O tempo até agora ({formattedTime}) será registrado, e o bloco continua com o próximo conteúdo.
                    </p>
                    <div className={styles.confirmationButtons}>
                        <button
                            className={`${styles.actionButton} ${styles.confirmYesButton}`}
                            onClick={() => handleFinishConfirm(true)}
                        >
                            <span className="material-icons">check</span>
                            Sim, concluir
                        </button>
                        <button
                            className={`${styles.actionButton} ${styles.confirmNoButton}`}
                            onClick={() => handleFinishConfirm(false)}
                        >
                            <span className="material-icons">close</span>
                            Continuar estudando
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.mainContent}>
                    <div className={styles.timerWrapper}>
                        <svg
                            className={styles.progressRing}
                            viewBox="0 0 200 200"
                            width="180"
                            height="180"
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
                                    className={styles.currentTimeText}
                                    x="100"
                                    y="90"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {formattedTime}
                                </text>
                                <text
                                    className={styles.estimatedTimeText}
                                    x="100"
                                    y="118"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {formattedEstimated}
                                </text>
                            </g>
                        </svg>
                    </div>

                    <div className={styles.controlsRow}>
                        <button
                            className={styles.controlIconButton}
                            onClick={isRunning ? pause : start}
                            title={isRunning ? 'Pausar' : 'Iniciar'}
                        >
                            <span className="material-icons">{isRunning ? 'pause' : 'play_arrow'}</span>
                        </button>

                        <button
                            className={`${styles.controlIconButton} ${styles.resetIconButton} ${elapsedSeconds === 0 ? styles.disabled : ''}`}
                            onClick={reset}
                            disabled={elapsedSeconds === 0}
                            title="Reiniciar"
                        >
                            <span className="material-icons">refresh</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}