import { useState, useEffect, useRef } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { Select } from '@/shared/components/ui/Form/Select';
import type { CycleBlock } from '../../types/cycle.types';
import styles from './BlocksEditView.module.css';

interface BlocksEditViewProps {
    blocks: CycleBlock[];

    onChange?: (blocks: CycleBlock[]) => void;
}

export function BlocksEditView({ blocks, onChange }: BlocksEditViewProps) {
    const [selectedTopic, setSelectedTopic] = useState('');
    const [localBlocks, setLocalBlocks] = useState(blocks);
    const dragIndexRef = useRef<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    useEffect(() => {
        setLocalBlocks(blocks);
    }, [blocks]);

    const applyChange = (updater: (prev: CycleBlock[]) => CycleBlock[]) => {
        setLocalBlocks(prev => {
            const updated = updater(prev);
            onChange?.(updated);
            return updated;
        });
    };

    const topicMinutes = localBlocks.reduce((acc, block) => {
        acc[block.topicName] = (acc[block.topicName] || 0) + block.minutes;
        return acc;
    }, {} as Record<string, number>);

    const topicOptions = [
        { label: 'Selecione um tópico', value: '' },
        ...Object.keys(topicMinutes).map(topicName => ({
            label: topicName,
            value: topicName
        }))
    ];

    const handleAddBlock = () => {
        if (!selectedTopic) return;

        const newBlock: CycleBlock = {
            id: `temp-${Date.now()}`,
            topicId: selectedTopic,
            topicName: selectedTopic,
            position: localBlocks.length,
            minutes: 60,
            originalMinutes: 60,
            completed: false
        };

        applyChange(prev => [...prev, newBlock]);
        setSelectedTopic('');
    };

    const handleRemoveBlock = (blockId: string) => {
        applyChange(prev => prev.filter(b => b.id !== blockId));
    };

    const handleMinutesChange = (blockId: string, minutes: number) => {
        const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? Math.floor(minutes) : 1;
        applyChange(prev => prev.map(b =>
            b.id === blockId
                ? { ...b, minutes: safeMinutes, originalMinutes: safeMinutes }
                : b
        ));
    };

    const handleDragStart = (index: number) => {
        dragIndexRef.current = index;
        setDraggingIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        const draggedIndex = dragIndexRef.current;
        if (draggedIndex === null || draggedIndex === index) return;

        applyChange(prev => {
            const updated = [...prev];
            const [draggedItem] = updated.splice(draggedIndex, 1);
            updated.splice(index, 0, draggedItem);
            return updated;
        });
        dragIndexRef.current = index;
        setDraggingIndex(index);
    };

    const handleDragEnd = () => {
        dragIndexRef.current = null;
        setDraggingIndex(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <Text variant="label">Adicionar novo bloco</Text>
                <div className={styles.addBlock}>
                    <Select
                        value={selectedTopic}
                        onChange={setSelectedTopic}
                        options={topicOptions}
                    />
                    <Button
                        variant="primary"
                        onClick={handleAddBlock}
                        disabled={!selectedTopic}
                    >
                        Adicionar
                    </Button>
                </div>
            </div>

            <div className={styles.section}>
                <Text variant="label">Tópicos ({Object.keys(topicMinutes).length})</Text>
                <div className={styles.topicSummary}>
                    {Object.entries(topicMinutes).map(([topicName, minutes]) => (
                        <div key={topicName} className={styles.topicRow}>
                            <span className={styles.topicName}>{topicName}</span>
                            <span className={styles.topicMinutes}>{minutes}min</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <Text variant="label">Blocos existentes ({localBlocks.length})</Text>
                <p className={styles.dragHint}>Arraste pelo ícone para reordenar</p>
                <div className={styles.blocks}>
                    {localBlocks.map((block, index) => (
                        <div
                            key={block.id}
                            className={`${styles.block} ${draggingIndex === index ? styles.dragging : ''}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            <span className={`material-icons ${styles.dragHandle}`}>drag_indicator</span>
                            <span className={styles.position}>#{index + 1}</span>
                            <span className={styles.topicName}>{block.topicName}</span>
                            <input
                                type="number"
                                min={1}
                                className={styles.minutesInput}
                                value={block.minutes}
                                onChange={(e) => handleMinutesChange(block.id, Number(e.target.value))}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <span className={styles.minutesLabel}>min</span>
                            <Button
                                variant="ghost"
                                icon={<span>✕</span>}
                                onClick={() => handleRemoveBlock(block.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
