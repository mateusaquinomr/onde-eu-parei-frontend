import { useRef, useEffect, useState } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import type { CycleBlock } from '../../types/cycle.types';
import styles from './TimelineInfinite.module.css';

interface TimelineInfiniteProps {
    blocks: CycleBlock[];
    activeBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onBlockPlay?: (blockId: string) => void;
}

export function TimelineInfinite({ blocks, activeBlockId, onBlockSelect, onBlockPlay }: TimelineInfiniteProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showTopArrow, setShowTopArrow] = useState(true);
    const [showBottomArrow, setShowBottomArrow] = useState(true);
    const [duplicatedBlocks, setDuplicatedBlocks] = useState<CycleBlock[]>([]);

    const getLastContent = (block: CycleBlock) => {
        const contents = [
            "Introdução ao assunto",
            "Conceitos fundamentais",
            "Exercícios básicos",
            "Aprofundamento"
        ];
        return contents[Math.floor(Math.random() * contents.length)];
    };

    useEffect(() => {
        const multiplied = [];
        for (let i = 0; i < 5; i++) {
            multiplied.push(...blocks);
        }
        setDuplicatedBlocks(multiplied);
    }, [blocks]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || duplicatedBlocks.length === 0) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const blockHeight = 140;
            const singleSetHeight = blocks.length * blockHeight;

            setShowTopArrow(true);
            setShowBottomArrow(true);

            if (scrollTop <= 50) {
                container.scrollTop = scrollHeight / 2 - singleSetHeight;
            } else if (scrollTop + clientHeight >= scrollHeight - 50) {
                container.scrollTop = scrollHeight / 2 + blockHeight;
            }
        };

        container.addEventListener('scroll', handleScroll);

        setTimeout(() => {
            if (container) {
                container.scrollTop = container.scrollHeight / 2;
            }
        }, 0);

        return () => container.removeEventListener('scroll', handleScroll);
    }, [duplicatedBlocks, blocks.length]);

    const handlePlayClick = (e: React.MouseEvent, blockId: string) => {
        e.stopPropagation();
        onBlockPlay?.(blockId);
    };

    return (
        <div className={styles.container}>
            <div className={styles.scrollContainer} ref={containerRef}>
                <div className={styles.timeline}>
                    {duplicatedBlocks.map((block, index) => {
                        const isActive = block.id === activeBlockId;
                        const relativePos = index % blocks.length + 1;
                        const lastContent = getLastContent(block);

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

                                    <div className={styles.cardRow}>

                                        <div className={styles.leftColumn}>
                                            <span className={styles.position}>#{relativePos}</span>
                                            <Text variant="body" className={styles.topicName}>
                                                {block.topicName}
                                            </Text>
                                            <div className={styles.lastContent}>
                                                <span className={styles.lastContentLabel}>Você parou:</span>
                                                <span className={styles.lastContentText}>{lastContent}</span>
                                            </div>
                                        </div>


                                        <div className={styles.rightColumn}>
                                            <span className={styles.hours}>{block.hours}h</span>
                                            <Button
                                                variant="ghost"
                                                icon={<span className={styles.playIcon}>P</span>}
                                                onClick={(e) => handlePlayClick(e, block.id)}
                                                className={styles.playButton}
                                                aria-label={`Continuar estudando ${block.topicName}`}
                                            />
                                        </div>
                                    </div>


                                    {/* {block.completed ? (
                                        <div className={styles.completedBadge}>Concluído</div>
                                    ) : (
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: '0%' }}
                                            />
                                        </div>
                                    )} */}

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}