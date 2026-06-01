import { useRef, useEffect, useState, useCallback } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import type { CycleBlock } from '../../types/cycle.types';
import styles from './TimelineInfinite.module.css';

interface TimelineInfiniteProps {
    blocks: CycleBlock[];
    activeBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
}

export function TimelineInfinite({
    blocks,
    activeBlockId,
    onBlockSelect
}: TimelineInfiniteProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [duplicatedBlocks, setDuplicatedBlocks] = useState<CycleBlock[]>([]);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<number | null>(null);
    const isInitializedRef = useRef(false);

    useEffect(() => {
        const multiplied: CycleBlock[] = [];
        for (let i = 0; i < 5; i++) {
            multiplied.push(...blocks);
        }
        setDuplicatedBlocks(multiplied);
    }, [blocks]);

    const findBestActiveIndex = useCallback((): number => {
        if (!activeBlockId) return -1;

        const middleIndex = Math.floor(duplicatedBlocks.length / 2);
        let bestIndex = -1;
        let minDistance = Infinity;

        for (let i = 0; i < duplicatedBlocks.length; i++) {
            if (duplicatedBlocks[i]?.id === activeBlockId) {
                const distance = Math.abs(i - middleIndex);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestIndex = i;
                }
            }
        }

        return bestIndex;
    }, [duplicatedBlocks, activeBlockId]);

    const centerItem = useCallback((item: HTMLElement, container: HTMLElement) => {
        const containerHeight = container.clientHeight;
        const itemOffsetTop = item.offsetTop;
        const itemHeight = item.clientHeight;
        const offsetAdjustment = -15;
        const targetScrollTop = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2) - offsetAdjustment;

        container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth'
        });
    }, []);

    const scrollToActiveBlock = useCallback(() => {
        if (!containerRef.current || duplicatedBlocks.length === 0) return;

        const bestIndex = findBestActiveIndex();
        if (bestIndex === -1) return;

        const container = containerRef.current;
        const items = container.querySelectorAll(`.${styles.timelineItem}`);
        const activeItem = items[bestIndex] as HTMLElement;

        if (activeItem) {
            setIsScrolling(true);
            centerItem(activeItem, container);

            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = window.setTimeout(() => {
                setIsScrolling(false);
                scrollTimeoutRef.current = null;
            }, 500);
        }
    }, [duplicatedBlocks, findBestActiveIndex, centerItem]);

    useEffect(() => {
        if (isInitializedRef.current) {
            scrollToActiveBlock();
        }
    }, [activeBlockId, scrollToActiveBlock]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || duplicatedBlocks.length === 0) return;

        const preventPageScroll = (e: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const atTop = scrollTop <= 10;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 10;

            if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
                e.preventDefault();
            }
        };

        container.addEventListener('wheel', preventPageScroll, { passive: false });

        const handleScroll = () => {
            if (isScrolling) return;

            const { scrollTop, scrollHeight, clientHeight } = container;
            const threshold = 200;
            const originalLength = blocks.length;
            const itemHeight = 100;
            const targetCenterPosition = (originalLength * 2) * itemHeight;

            if (scrollTop + clientHeight >= scrollHeight - threshold) {
                container.scrollTop = targetCenterPosition;
            } else if (scrollTop <= threshold) {
                container.scrollTop = targetCenterPosition;
            }
        };

        container.addEventListener('scroll', handleScroll);

        if (!isInitializedRef.current && duplicatedBlocks.length > 0 && blocks.length > 0) {
            isInitializedRef.current = true;

            setTimeout(() => {
                if (activeBlockId) {
                    scrollToActiveBlock();
                } else {
                    const firstOriginalIndex = Math.floor(duplicatedBlocks.length / 2) - Math.floor(blocks.length / 2);
                    const items = container.querySelectorAll(`.${styles.timelineItem}`);
                    const firstItem = items[firstOriginalIndex] as HTMLElement;
                    if (firstItem) {
                        setIsScrolling(true);
                        centerItem(firstItem, container);
                        setTimeout(() => {
                            setIsScrolling(false);
                        }, 500);
                    }
                }
            }, 200);
        }

        return () => {
            container.removeEventListener('wheel', preventPageScroll);
            container.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [duplicatedBlocks, blocks.length, isScrolling, scrollToActiveBlock, activeBlockId, centerItem]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || duplicatedBlocks.length === 0) return;

        let detectTimeout: number | null = null;

        const detectCenterBlock = () => {
            if (isScrolling) return;

            const containerRect = container.getBoundingClientRect();
            const containerCenter = containerRect.top + containerRect.height / 2;

            let closestIndex = -1;
            let closestDistance = Infinity;

            const items = container.querySelectorAll(`.${styles.timelineItem}`);

            items.forEach((item, idx) => {
                const rect = item.getBoundingClientRect();
                const itemCenter = rect.top + rect.height / 2;
                const distance = Math.abs(itemCenter - containerCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = idx;
                }
            });

            if (closestIndex !== -1 && closestIndex < duplicatedBlocks.length) {
                const blockAtCenter = duplicatedBlocks[closestIndex];
                if (blockAtCenter && blockAtCenter.id !== activeBlockId && !isScrolling) {
                    onBlockSelect?.(blockAtCenter.id);
                }
            }
        };

        const throttledDetect = () => {
            if (detectTimeout) clearTimeout(detectTimeout);
            detectTimeout = window.setTimeout(detectCenterBlock, 100);
        };

        container.addEventListener('scroll', throttledDetect);

        return () => {
            container.removeEventListener('scroll', throttledDetect);
            if (detectTimeout) clearTimeout(detectTimeout);
        };
    }, [duplicatedBlocks, activeBlockId, onBlockSelect, isScrolling]);

    return (
        <div className={styles.container}>
            <div className={styles.scrollContainer} ref={containerRef}>
                <div className={styles.timeline}>
                    {duplicatedBlocks.map((block, index) => {
                        const isActive = block.id === activeBlockId;
                        const relativePos = (index % blocks.length) + 1;
                        const currentContent = block.currentContent || "Clique para começar";

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
                                    <div className={styles.leftSide}>
                                        <div className={styles.titleRow}>
                                            <span className={`${styles.position} ${isActive ? styles.activePosition : ''}`}>
                                                {relativePos}
                                            </span>
                                            <Text variant="body" className={styles.topicName}>
                                                {block.topicName}
                                            </Text>
                                        </div>
                                        <div className={styles.lastContent}>
                                            <span className={styles.lastContentLabel}>Você parou:</span>
                                            <span className={styles.lastContentText}>{currentContent}</span>
                                        </div>
                                    </div>

                                    <div className={styles.rightSide}>
                                        <div className={styles.timeInfo}>
                                            <span className="material-icons">timer</span>
                                            <span className={styles.minutes}>{block.minutes}min</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}