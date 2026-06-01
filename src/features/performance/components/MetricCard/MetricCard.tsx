import { Text } from '@/shared/components/ui/Text/Text';
import type { MetricData } from '../../types/performance.types';
import styles from './MetricCard.module.css';

interface MetricCardProps {
    metric: MetricData;
}

export function MetricCard({ metric }: MetricCardProps) {
    const getTrendIcon = () => {
        if (!metric.change) return null;
        switch (metric.change.trend) {
            case 'up': return 'trending_up';
            case 'down': return 'trending_down';
            default: return 'trending_flat';
        }
    };

    const getTrendColor = () => {
        if (!metric.change) return '';
        switch (metric.change.trend) {
            case 'up': return styles.trendUp;
            case 'down': return styles.trendDown;
            default: return styles.trendNeutral;
        }
    };

    return (
        <div className={styles.card}>
            {metric.icon && (
                <span className={`${styles.icon} material-icons-outlined`}>
                    {metric.icon}
                </span>
            )}

            <div className={styles.content}>
                <Text variant="caption" className={styles.label}>
                    {metric.label}
                </Text>

                <div className={styles.valueContainer}>
                    <span className={styles.value}>
                        {metric.value}
                        {metric.unit && <span className={styles.unit}>{metric.unit}</span>}
                    </span>

                    {metric.change && (
                        <div className={`${styles.trend} ${getTrendColor()}`}>
                            <span className="material-icons" style={{ fontSize: '14px' }}>
                                {getTrendIcon()}
                            </span>
                            <span className={styles.trendValue}>{metric.change.value}%</span>
                            <Text variant="caption" className={styles.trendComparison}>
                                {metric.change.comparison}
                            </Text>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}