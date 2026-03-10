import { useState, useEffect } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import type { CycleBlock } from '../../types/cycle.types';
import styles from './TimelineCarousel.module.css';

interface TimelineCarouselProps {
    blocks: CycleBlock[];
    activeBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
}

export function TimelineCarousel({ blocks, activeBlockId, onBlockSelect }: TimelineCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleBlocks, setVisibleBlocks] = useState<CycleBlock[]>([]);

    useEffect(() => {
        const tripled = [...blocks, ...blocks, ...blocks];
        setVisibleBlocks(tripled);

        setCurrentIndex(blocks.length);
    }, [blocks]);

    const handlePrev = () => {
        setCurrentIndex(prev => {
            const newIndex = prev - 1;
            if (newIndex < blocks.length) {
                return blocks.length * 2 - 1;
            }
            return newIndex;
        });
    };

    const handleNext = () => {
        setCurrentIndex(prev => {
            const newIndex = prev + 1;
            if (newIndex >= blocks.length * 2) {
                return blocks.length;
            }
            return newIndex;
        });
    };

    const getVisibleRange = () => {
        const start = currentIndex - 2;
        const end = currentIndex + 3;
        return visibleBlocks.slice(start, end);
    };

    const visibleRange = getVisibleRange();
    const centerIndex = 2;

    return (
        <div className={styles.container}>

            <Button
                variant="ghost"
                icon={<span>^</span>}
                onClick={handlePrev}
                className={styles.arrowButton}
                aria-label="Bloco anterior"
            />

            <div className={styles.timeline}>
                {visibleRange.map((block, idx) => {
                    const isCenter = idx === centerIndex;
                    const isActive = block.id === activeBlockId;
                    const position = (currentIndex + (idx - centerIndex) + blocks.length) % blocks.length + 1;

                    return (
                        <div
                            key={`${block.id}-${idx}`}
                            className={`${styles.timelineItem} ${isCenter ? styles.center : ''} ${isActive ? styles.active : ''}`}
                            onClick={() => isCenter && onBlockSelect?.(block.id)}
                        >
                            <div className={styles.lineContainer}>
                                <div className={styles.line} />
                                <div className={`${styles.dot} ${isActive ? styles.activeDot : ''} ${isCenter ? styles.centerDot : ''}`} />
                            </div>

                            <div className={`${styles.card} ${isCenter ? styles.centerCard : ''} ${isActive ? styles.activeCard : ''}`}>
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

            <Button
                variant="ghost"
                icon={<span>v</span>}
                onClick={handleNext}
                className={styles.arrowButton}
                aria-label="Próximo bloco"
            />
        </div>
    );
}