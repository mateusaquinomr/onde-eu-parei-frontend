import { Text } from '@/shared/components/ui/Text/Text';
import type { HeatmapData } from '../../types/performance.types';
import styles from './StudyHeatmap.module.css';

interface StudyHeatmapProps {
    data: HeatmapData[];
}

const intensityColors = {
    0: styles.intensity0,
    1: styles.intensity1,
    2: styles.intensity2,
    3: styles.intensity3,
    4: styles.intensity4,
};

export function StudyHeatmap({ data }: StudyHeatmapProps) {

    const weeks: HeatmapData[][] = [];
    for (let i = 0; i < data.length; i += 7) {
        weeks.push(data.slice(i, i + 7));
    }

    return (
        <div className={styles.container}>
            <Text variant="cardTitle">Consistência de Estudo</Text>

        </div>
    );
}