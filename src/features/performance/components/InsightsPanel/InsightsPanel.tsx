import { Text } from '@/shared/components/ui/Text/Text';
import type { Insight } from '../../types/performance.types';
import styles from './InsightsPanel.module.css';

interface InsightsPanelProps {
    insights: Insight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
    const getIcon = (type: Insight['type']) => {
        switch (type) {
            case 'positive': return 'ok';
            case 'alert': return 'alerta';
            default: return 'lâmpada';
        }
    };

    const getClassName = (type: Insight['type']) => {
        switch (type) {
            case 'positive': return styles.positive;
            case 'alert': return styles.alert;
            default: return styles.neutral;
        }
    };

    return (
        <div className={styles.container}>
            <Text variant="cardTitle">Insights</Text>

            <div className={styles.insightsList}>
                {insights.map(insight => (
                    <div key={insight.id} className={`${styles.insight} ${getClassName(insight.type)}`}>
                        <span className={styles.icon}>{getIcon(insight.type)}</span>
                        <div className={styles.content}>
                            <Text variant="body">{insight.message}</Text>
                            {insight.detail && (
                                <Text variant="caption" className={styles.detail}>
                                    {insight.detail}
                                </Text>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}