import { Text } from '@/shared/components/ui/Text/Text';
import { CircularProgress } from '@/features/topics/components/topic/CircularProgress/CircularProgress';
import type { Cycle, CycleSummary } from '../../types/cycle.types';
import styles from './ProgressCard.module.css';

interface ProgressCardProps {
    currentCycle: Cycle | null;
    summary: CycleSummary;
}

export function ProgressCard({ currentCycle, summary }: ProgressCardProps) {
    if (!currentCycle) {
        return (
            <div className={styles.card}>
                <Text variant="body">Nenhum ciclo ativo</Text>
            </div>
        );
    }

    const progress = currentCycle.totalHours > 0
        ? Math.round((currentCycle.completedHours / currentCycle.totalHours) * 100)
        : 0;

    return (
        <div className={styles.card}>
            <div className={styles.progressSection}>
                <CircularProgress
                    progress={progress}
                    completed={currentCycle.completedHours}
                    total={currentCycle.totalHours}
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
                    <div className={styles.timeDivider}>/</div>
                    <div className={styles.timeItem}>
                        <Text variant="caption">Meta</Text>
                        <Text variant="cardTitle" className={styles.timeValue}>
                            {currentCycle.totalHours}h
                        </Text>
                    </div>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <Text variant="caption">Ciclos totais</Text>
                    <Text variant="body" className={styles.statValue}>
                        {summary.totalCycles}
                    </Text>
                </div>
                <div className={styles.statItem}>
                    <Text variant="caption">Horas estudadas</Text>
                    <Text variant="body" className={styles.statValue}>
                        {summary.totalStudyHours}h
                    </Text>
                </div>
            </div>
        </div>
    );
}