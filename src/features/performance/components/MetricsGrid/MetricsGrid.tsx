import { MetricCard } from '../MetricCard/MetricCard';
import type { MetricData } from '../../types/performance.types';
import styles from './MetricsGrid.module.css';

interface MetricsGridProps {
    metrics: MetricData[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
    return (
        <div className={styles.grid}>
            {metrics.map(metric => (
                <MetricCard key={metric.id} metric={metric} />
            ))}
        </div>
    );
}