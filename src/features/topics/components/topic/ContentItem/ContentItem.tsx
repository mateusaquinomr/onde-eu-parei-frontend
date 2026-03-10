import { useState } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import { Select } from '@/shared/components/ui/Form/Select';
import { DragHandle } from '../DragHandle/DragHandle';
import type { Content, ImportanceLevel } from '../../../types/topic.types';
import styles from './ContentItem.module.css';

interface ContentItemProps {
    content: Content;
    index: number;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (id: string, title: string, importance: ImportanceLevel) => void;
    onCancel: () => void;
    onDelete: () => void;
    onToggleComplete: () => void;
    dragHandleProps?: any;
}

const importanceOptions = [
    { label: 'Pouco importante', value: 'pouco' },
    { label: 'Normal', value: 'normal' },
    { label: 'Muito importante', value: 'muita' }
];

const importanceColors = {
    pouco: '#9CA3AF',
    normal: '#3B82F6',
    muita: '#EF4444'
};

const importanceLabels = {
    pouco: 'Pouco importante',
    normal: 'Normal',
    muita: 'Muito importante'
};

export function ContentItem({
    content,
    index,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onToggleComplete,
    dragHandleProps
}: ContentItemProps) {
    const [editTitle, setEditTitle] = useState(content.title);
    const [editImportance, setEditImportance] = useState<ImportanceLevel>(content.importance);

    const handleSave = () => {
        if (editTitle.trim()) {
            onSave(content.id, editTitle, editImportance);
        }
    };

    const handleToggleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('ContentItem - Toggle clicado', {
            id: content.id,
            completed: content.completed
        });

        onToggleComplete();
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete();
    };

    const handleEditClick = () => {
        onEdit();
    };

    if (isEditing) {
        return (
            <div className={styles.contentItem}>
                <DragHandle dragHandleProps={dragHandleProps} />
                <div className={styles.contentIndex}>{index}</div>
                <div className={styles.contentEditFields}>
                    <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        placeholder="Título do conteúdo"
                    />
                    <Select
                        value={editImportance}
                        onChange={(value) => setEditImportance(value as ImportanceLevel)}
                        options={importanceOptions}
                    />
                </div>
                <div className={styles.contentActions}>
                    <Button
                        variant="ghost"
                        icon={<span>ok</span>}
                        onClick={handleSave}
                        aria-label="Salvar"
                    />
                    <Button
                        variant="ghost"
                        icon={<span>x</span>}
                        onClick={onCancel}
                        aria-label="Cancelar"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.contentItem}>
            <DragHandle dragHandleProps={dragHandleProps} />
            <div className={styles.contentIndex}>{index}</div>
            <div
                className={`${styles.contentInfo} ${content.completed ? styles.completedContent : ''}`}
                onClick={handleEditClick}
            >
                <Text
                    variant="body"
                    className={content.completed ? styles.completedText : ''}
                >
                    {content.title}
                </Text>
                <div
                    className={styles.importanceDot}
                    style={{ backgroundColor: importanceColors[content.importance] }}
                    title={importanceLabels[content.importance]}
                />
            </div>

            <div className={styles.contentActions}>
                <Button
                    variant="ghost"
                    icon={content.completed ? <span>ok</span> : <span>o</span>}
                    onClick={handleToggleClick}
                    aria-label={content.completed ? "Marcar como não concluído" : "Marcar como concluído"}
                    className={content.completed ? styles.completedBtn : ''}
                />
                <Button
                    variant="ghost"
                    icon={<span>lixo</span>}
                    onClick={handleDeleteClick}
                    aria-label="Excluir"
                />
            </div>
        </div>
    );
}