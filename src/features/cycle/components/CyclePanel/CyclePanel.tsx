import { useState } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { TimelineInfinite } from '../TimelineInfinite/TimelineInfinite';
import { BlocksEditView } from '../BlocksEditView/BlocksEditView';
import type { Cycle, CycleBlock } from '../../types/cycle.types';
import styles from './CyclePanel.module.css';

interface CyclePanelProps {
    cycle: Cycle;
    onReconfigure: () => void;
    onSaveBlocks?: (blocks: CycleBlock[]) => Promise<unknown>;
}

const formatMinutes = (minutes: number): string => {
    if (!minutes || minutes === 0) return '0min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
        return `${hours}h${mins}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${mins}m`;
    }
};

export function CyclePanel({ cycle, onReconfigure, onSaveBlocks }: CyclePanelProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedBlocks, setEditedBlocks] = useState<CycleBlock[]>(cycle.blocks);
    const [activeBlockId, setActiveBlockId] = useState<string | undefined>(
        cycle.blocks.find(b => !b.completed)?.id
    );

    const remainingTime = formatMinutes(cycle.remainingMinutes);

    const handleEdit = () => {
        setEditedBlocks(cycle.blocks);
        setIsEditing(true);
        setHasChanges(false);
    };

    const handleCancel = () => {
        setEditedBlocks(cycle.blocks);
        setIsEditing(false);
        setHasChanges(false);
    };

    const handleSave = async () => {
        if (!hasChanges) return;
        setIsSaving(true);
        try {
            await onSaveBlocks?.(editedBlocks);
            setIsEditing(false);
            setHasChanges(false);
        } catch (error) {
            console.error('Erro ao salvar blocos:', error);
            alert('Não foi possível salvar as alterações. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (blocks: CycleBlock[]) => {
        setEditedBlocks(blocks);
        setHasChanges(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text variant="cardTitle">
                    Blocos de estudo ({remainingTime} restantes)
                </Text>
                <div className={styles.actions}>
                    {isEditing ? (
                        <>
                            <Button
                                variant="ghost"
                                icon={<span className="material-icons">check</span>}
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                className={hasChanges ? styles.saveActive : styles.saveDisabled}
                                aria-label="Salvar alterações"
                            />
                            <Button
                                variant="ghost"
                                icon={<span className="material-icons">close</span>}
                                onClick={handleCancel}
                                disabled={isSaving}
                                aria-label="Cancelar edição"
                            />
                        </>
                    ) : (
                        <Button
                            variant="ghost"
                            icon={<span className="material-icons-outlined">tune</span>}
                            onClick={handleEdit}
                            aria-label="Editar blocos"
                        />
                    )}
                </div>
            </div>

            {isEditing ? (
                <BlocksEditView
                    blocks={cycle.blocks}
                    onChange={handleChange}
                />
            ) : (
                <TimelineInfinite
                    blocks={cycle.blocks}
                    activeBlockId={activeBlockId}
                    onBlockSelect={setActiveBlockId}
                />
            )}
        </div>
    );
}
