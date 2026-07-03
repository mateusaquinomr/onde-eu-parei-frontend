import { Text } from '@/shared/components/ui/Text/Text';
import { CircularProgress } from '@/features/topics/components/CircularProgress/CircularProgress';
import type { Cycle, CycleSummary } from '../../types/cycle.types';
import styles from './ProgressCard.module.css';

interface ProgressCardProps {
    currentCycle: Cycle | null;
    summary: CycleSummary;
}

const formatMinutes = (minutes: number): string => {
    if (!minutes || minutes === 0) return '0min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
        return `${hours}h${mins}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${mins}m`;
    }
};

export function ProgressCard({ currentCycle, summary }: ProgressCardProps) {
    if (!currentCycle) {
        return null;
    }

    const progress = currentCycle.totalMinutes > 0
        ? Math.round((currentCycle.completedMinutes / currentCycle.totalMinutes) * 100)
        : 0;

    return (
        <div className={styles.card}>
            <div className={styles.progressSection}>
                <CircularProgress
                    progress={progress}
                    completed={currentCycle.completedMinutes}
                    total={currentCycle.totalMinutes}
                    size={120}
                    strokeWidth={8}
                />
                <div className={styles.timeInfo}>
                    <div className={styles.timeItem}>
                        <Text variant="caption">Ciclo atual</Text>
                        <Text variant="cardTitle" className={styles.timeValue}>
                            {currentCycle.number}
                        </Text>
                    </div>
                    <div className={styles.timeDivider}>|</div>
                    <div className={styles.timeItem}>
                        <Text variant="caption">Meta</Text>
                        <Text variant="cardTitle" className={styles.timeValue}>
                            {formatMinutes(currentCycle.totalMinutes)}
                        </Text>
                    </div>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <div className={styles.statValueWrapper}>
                        <span className="material-icons" style={{ fontSize: '16px', color: '#9CA3AF' }}>donut_large</span>
                        <Text variant="caption">Ciclos totais</Text>
                    </div>
                    <Text variant="body" className={styles.statValue}>
                        {summary.totalCycles}
                    </Text>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statValueWrapper}>
                        <span className="material-icons" style={{ fontSize: '16px', color: '#9CA3AF' }}>schedule</span>
                        <Text variant="caption">Total estudado</Text>
                    </div>
                    <Text variant="body" className={styles.statValue}>
                        {formatMinutes(summary.totalStudyMinutes)}
                    </Text>
                </div>
            </div>
        </div>
    );
}