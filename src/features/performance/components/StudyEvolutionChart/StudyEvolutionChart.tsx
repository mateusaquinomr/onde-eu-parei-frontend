import { Text } from '@/shared/components/ui/Text/Text';
import type { DailyStudyData } from '../../types/performance.types';
import styles from './StudyEvolutionChart.module.css';

interface StudyEvolutionChartProps {
    data: DailyStudyData[];
}

export function StudyEvolutionChart({ data }: StudyEvolutionChartProps) {
    const maxHours = Math.max(...data.map(d => d.hours));
    const bestDay = data.reduce((best, current) =>
        current.hours > best.hours ? current : best
    );

    return (
        <div className={styles.container}>
            <Text variant="cardTitle">Evolução de Estudo</Text>

            <div className={styles.insight}>
                <span className={styles.insightIcon}>Lâmpada</span>
                <Text variant="caption">
                    Seu dia mais produtivo é {bestDay.day} ({bestDay.hours}h)
                </Text>
            </div>

            <div className={styles.chart}>
                {data.map((day, index) => {
                    const height = (day.hours / maxHours) * 100;

                    return (
                        <div key={index} className={styles.barContainer}>
                            <div className={styles.barWrapper}>
                                <div
                                    className={styles.bar}
                                    style={{ height: `${height}%` }}
                                >
                                    <span className={styles.barValue}>{day.hours}h</span>
                                </div>
                            </div>
                            <span className={styles.barLabel}>{day.day}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}