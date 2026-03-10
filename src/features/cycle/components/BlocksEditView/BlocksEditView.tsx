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

    const topicHours = localBlocks.reduce((acc, block) => {
        acc[block.topicName] = (acc[block.topicName] || 0) + block.hours;
        return acc;
    }, {} as Record<string, number>);

    const topicOptions = [
        { label: 'Selecione um tópico', value: '' },
        ...Object.keys(topicHours).map(topicName => ({
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
            hours: 1.0,
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
                <Text variant="label">Tópicos ({Object.keys(topicHours).length})</Text>
                <div className={styles.topicSummary}>
                    {Object.entries(topicHours).map(([topicName, hours]) => (
                        <div key={topicName} className={styles.topicRow}>
                            <span className={styles.topicName}>{topicName}</span>
                            <span className={styles.topicHours}>{hours.toFixed(1)}h</span>
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
                            <span className={styles.hours}>{block.hours}h</span>
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