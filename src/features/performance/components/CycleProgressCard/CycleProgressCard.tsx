import { Text } from '@/shared/components/ui/Text/Text';
import { CircularProgress } from '@/features/topics/components/CircularProgress/CircularProgress';
import type { CycleProgress } from '../../types/performance.types';
import styles from './CycleProgressCard.module.css';

interface CycleProgressCardProps {
    progress: CycleProgress;
}

export function CycleProgressCard({ progress }: CycleProgressCardProps) {
    return (
        <div className={styles.card}>
            <Text variant="cardTitle">Progresso do Ciclo</Text>

            <div className={styles.content}>
                <CircularProgress
                    progress={progress.percentage}
                    completed={progress.completedBlocks}
                    total={progress.totalBlocks}
                    size={100}
                    strokeWidth={6}
                />

                <div className={styles.info}>
                    <div className={styles.row}>
                        <span className={styles.label}>Ciclo atual</span>
                        <span className={styles.value}>#{progress.currentCycle}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Blocos</span>
                        <span className={styles.value}>
                            {progress.completedBlocks}/{progress.totalBlocks}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}