import type { CycleBlock } from '../../types/cycle.types';
import styles from './BlocksView.module.css';

interface BlocksViewProps {
    blocks: CycleBlock[];
}

export function BlocksView({ blocks }: BlocksViewProps) {
    return (
        <div className={styles.container}>
            <div className={styles.blocks}>
                {blocks.map((block, index) => (
                    <div key={block.id} className={`${styles.block} ${block.completed ? styles.completed : ''}`}>
                        <div className={styles.blockHeader}>
                            <span className={styles.position}>#{index + 1}</span>
                            <span className={styles.topicName}>{block.topicName}</span>
                            <span className={styles.hours}>{block.hours}h</span>
                        </div>
                        {block.completed ? (
                            <div className={styles.completedBadge}>Concluído</div>
                        ) : (
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: '0%' }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}