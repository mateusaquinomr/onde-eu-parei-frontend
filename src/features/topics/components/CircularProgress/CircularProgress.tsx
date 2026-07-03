import styles from './CircularProgress.module.css';

interface CircularProgressProps {
    progress: number;
    completed: number;
    total: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function CircularProgress({
    progress,
    completed,
    total,
    size = 120,
    strokeWidth = 8,
    className
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div
            className={`${styles.container} ${className || ''}`}
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className={styles.svg}
            >
                <circle
                    className={styles.background}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    className={styles.progress}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <div className={styles.content}>
                <span className={styles.percentage}>{progress}%</span>
                <span className={styles.counter}>{completed} de {total}</span>
            </div>
        </div>
    );
}