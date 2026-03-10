import { Text } from '@/shared/components/ui/Text/Text';
import type { CompletionStats } from '../../types/performance.types';
import styles from './CompletionRateCard.module.css';

interface CompletionRateCardProps {
    stats: CompletionStats;
}

export function CompletionRateCard({ stats }: CompletionRateCardProps) {
    return (
        <div className={styles.card}>
            <Text variant="cardTitle">Taxa de Conclusão</Text>

            <div className={styles.content}>
                <div className={styles.rateCircle}>
                    <span className={styles.rateValue}>{stats.rate}%</span>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statRow}>
                        <span className={styles.statLabel}>Blocos iniciados</span>
                        <span className={styles.statValue}>{stats.started}</span>
                    </div>
                    <div className={styles.statRow}>
                        <span className={styles.statLabel}>Blocos concluídos</span>
                        <span className={styles.statValue}>{stats.completed}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}