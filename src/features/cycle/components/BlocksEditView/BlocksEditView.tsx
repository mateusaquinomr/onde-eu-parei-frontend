import { useState, useEffect } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { Select } from '@/shared/components/ui/Form/Select';
import type { CycleBlock } from '../../types/cycle.types';
import styles from './BlocksEditView.module.css';

interface BlocksEditViewProps {
    blocks: CycleBlock[];
    onChange?: () => void;
}

export function BlocksEditView({ blocks, onChange }: BlocksEditViewProps) {
    const [selectedTopic, setSelectedTopic] = useState('');
    const [localBlocks, setLocalBlocks] = useState(blocks);

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
            completed: false
        };

        setLocalBlocks([...localBlocks, newBlock]);
        setSelectedTopic('');
        onChange?.();
    };

    const handleRemoveBlock = (blockId: string) => {
        setLocalBlocks(localBlocks.filter(b => b.id !== blockId));
        onChange?.();
    };

    useEffect(() => {
        setLocalBlocks(blocks);
    }, [blocks]);

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
                <div className={styles.blocks}>
                    {localBlocks.map((block, index) => (
                        <div key={block.id} className={styles.block}>
                            <span className={styles.position}>#{index + 1}</span>
                            <span className={styles.topicName}>{block.topicName}</span>
                            <span className={styles.minutes}>{block.minutes}min</span>
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