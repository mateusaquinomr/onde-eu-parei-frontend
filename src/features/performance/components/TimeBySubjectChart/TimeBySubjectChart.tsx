import { Text } from '@/shared/components/ui/Text/Text';
import type { SubjectTimeData } from '../../types/performance.types';
import styles from './TimeBySubjectChart.module.css';

interface TimeBySubjectChartProps {
    data: SubjectTimeData[];
}

export function TimeBySubjectChart({ data }: TimeBySubjectChartProps) {
    const total = data.reduce((acc, item) => acc + item.hours, 0);

    return (
        <div className={styles.container}>
            <Text variant="cardTitle">Tempo por Disciplina</Text>

            <div className={styles.chartContent}>
                <div className={styles.pieContainer}>
                    <svg viewBox="0 0 100 100" className={styles.pie}>
                        {data.map((item, index) => {
                            const percentage = (item.hours / total) * 100;
                            const previousPercentage = data
                                .slice(0, index)
                                .reduce((acc, curr) => acc + (curr.hours / total) * 100, 0);

                            return (
                                <circle
                                    key={item.subject}
                                    r="25"
                                    cx="50"
                                    cy="50"
                                    fill="transparent"
                                    stroke={item.color}
                                    strokeWidth="50"
                                    strokeDasharray={`${percentage} ${100 - percentage}`}
                                    strokeDashoffset={-previousPercentage}
                                    transform="rotate(-90 50 50)"
                                    className={styles.pieSlice}
                                />
                            );
                        })}
                    </svg>
                </div>

                <div className={styles.legend}>
                    {data.map(item => (
                        <div key={item.subject} className={styles.legendItem}>
                            <span className={styles.colorDot} style={{ backgroundColor: item.color }} />
                            <span className={styles.subjectName}>{item.subject}</span>
                            <span className={styles.subjectHours}>{item.hours}h</span>
                            <span className={styles.subjectPercentage}>{item.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}