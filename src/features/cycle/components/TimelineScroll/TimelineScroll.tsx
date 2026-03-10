import { useRef, useEffect, useState } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import type { CycleBlock } from '../../types/cycle.types';
import styles from './TimelineScroll.module.css';

interface TimelineScrollProps {
    blocks: CycleBlock[];
    activeBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
}

export function TimelineScroll({ blocks, activeBlockId, onBlockSelect }: TimelineScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showTopArrow, setShowTopArrow] = useState(false);
    const [showBottomArrow, setShowBottomArrow] = useState(true);
    const [duplicatedBlocks, setDuplicatedBlocks] = useState<CycleBlock[]>([]);

    useEffect(() => {
        setDuplicatedBlocks([...blocks, ...blocks, ...blocks]);
    }, [blocks]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const singleSetHeight = scrollHeight / 3;

            setShowTopArrow(scrollTop > 10);
            setShowBottomArrow(scrollTop + clientHeight < scrollHeight - 10);

            if (scrollTop + clientHeight >= scrollHeight - 10) {
                container.scrollTop = singleSetHeight;
            } else if (scrollTop <= 10) {
                container.scrollTop = singleSetHeight * 2 - clientHeight;
            }
        };

        container.addEventListener('scroll', handleScroll);

        setTimeout(() => {
            if (container) {
                container.scrollTop = (container.scrollHeight / 3);
                handleScroll();
            }
        }, 0);

        return () => container.removeEventListener('scroll', handleScroll);
    }, [duplicatedBlocks]);

    return (
        <div className={styles.container}>
            {showTopArrow && (
                <div className={styles.arrowTop}>
                    <span>^</span>
                </div>
            )}

            <div className={styles.scrollContainer} ref={containerRef}>
                <div className={styles.timeline}>
                    {duplicatedBlocks.map((block, index) => {
                        const isActive = block.id === activeBlockId;
                        const position = index % blocks.length + 1;

                        return (
                            <div
                                key={`${block.id}-${index}`}
                                className={`${styles.timelineItem} ${isActive ? styles.active : ''}`}
                                onClick={() => onBlockSelect?.(block.id)}
                            >

                                <div className={styles.lineContainer}>
                                    <div className={styles.line} />
                                    <div className={`${styles.dot} ${isActive ? styles.activeDot : ''}`} />
                                </div>

                                <div className={`${styles.card} ${isActive ? styles.activeCard : ''}`}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.position}>#{position}</span>
                                        <span className={styles.hours}>{block.hours}h</span>
                                    </div>

                                    <Text variant="body" className={styles.topicName}>
                                        {block.topicName}
                                    </Text>

                                    {block.completed && (
                                        <div className={styles.completedBadge}>Concluído</div>
                                    )}

                                    {!block.completed && (
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: '0%' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showBottomArrow && (
                <div className={styles.arrowBottom}>
                    <span>V</span>
                </div>
            )}
        </div>
    );
}