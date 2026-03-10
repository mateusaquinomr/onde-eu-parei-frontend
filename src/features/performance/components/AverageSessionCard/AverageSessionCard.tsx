import { Text } from '@/shared/components/ui/Text/Text';
import type { AverageSession } from '../../types/performance.types';
import styles from './AverageSessionCard.module.css';

interface AverageSessionCardProps {
    session: AverageSession;
}

export function AverageSessionCard({ session }: AverageSessionCardProps) {
    const getTrendIcon = () => {
        if (!session.trend) return '';
        return session.trend > 0 ? '^' : 'v';
    };

    const getTrendClass = () => {
        if (!session.trend) return '';
        return session.trend > 0 ? styles.trendUp : styles.trendDown;
    };

    return (
        <div className={styles.card}>
            <Text variant="cardTitle">Tempo Médio por Sessão</Text>

            <div className={styles.content}>
                <div className={styles.timeDisplay}>
                    <span className={styles.timeValue}>{session.average}</span>
                    <span className={styles.timeUnit}>min</span>
                </div>

                {session.trend && (
                    <div className={`${styles.trend} ${getTrendClass()}`}>
                        <span className={styles.trendIcon}>{getTrendIcon()}</span>
                        <span className={styles.trendValue}>{Math.abs(session.trend)}%</span>
                        <span className={styles.trendLabel}>vs semana anterior</span>
                    </div>
                )}
            </div>
        </div>
    );
}