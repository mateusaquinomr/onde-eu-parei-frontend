import { useState } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { TimelineInfinite } from '../TimelineInfinite/TimelineInfinite';
import { BlocksEditView } from '../BlocksEditView/BlocksEditView';
import type { Cycle } from '../../types/cycle.types';
import styles from './CyclePanel.module.css';

interface CyclePanelProps {
    cycle: Cycle;
    onReconfigure: () => void;
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

export function CyclePanel({ cycle, onReconfigure }: CyclePanelProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeBlockId, setActiveBlockId] = useState<string | undefined>(
        cycle.blocks.find(b => !b.completed)?.id
    );

    const remainingTime = formatMinutes(cycle.remainingMinutes);

    const handleEdit = () => {
        setIsEditing(true);
        setHasChanges(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setHasChanges(false);
    };

    const handleSave = () => {
        console.log('Salvar alterações');
        setIsEditing(false);
        setHasChanges(false);
    };

    const handleChange = () => {
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
                                disabled={!hasChanges}
                                className={hasChanges ? styles.saveActive : styles.saveDisabled}
                                aria-label="Salvar alterações"
                            />
                            <Button
                                variant="ghost"
                                icon={<span className="material-icons">close</span>}
                                onClick={handleCancel}
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