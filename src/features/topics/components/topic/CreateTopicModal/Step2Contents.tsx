import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    restrictToVerticalAxis,
    restrictToParentElement
} from '@dnd-kit/modifiers';
import { FormField } from '@/shared/components/ui/Form/FormField';
import { Input } from '@/shared/components/ui/Form/Input';
import { Select } from '@/shared/components/ui/Form/Select';
import { Button } from '@/shared/components/ui/Button/Button';
import { Text } from '@/shared/components/ui/Text/Text';
import { SortableContentItem } from '../SortableContentItem/SortableContentItem.tsx';
import type { ImportanceLevel, Content } from '../../../types/topic.types';
import styles from './CreateTopicModal.module.css';

interface Step2ContentsProps {
    initialContents: Content[];
    onSave: (contents: Content[]) => void;
    onBack: () => void;
}

const importanceOptions = [
    { label: 'Pouco importante', value: 'pouco' },
    { label: 'Normal', value: 'normal' },
    { label: 'Muito importante', value: 'muita' }
];

export function Step2Contents({ initialContents = [], onSave, onBack }: Step2ContentsProps) {
    const [contents, setContents] = useState<Content[]>(initialContents);
    const [newContentTitle, setNewContentTitle] = useState('');
    const [newContentImportance, setNewContentImportance] = useState<ImportanceLevel>('normal');
    const [editingId, setEditingId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addContent = () => {
        if (!newContentTitle.trim()) return;

        const content: Content = {
            id: crypto.randomUUID(),
            title: newContentTitle,
            importance: newContentImportance,
            completed: false,
            order: contents.length,
            createdAt: new Date()
        };

        setContents([...contents, content]);
        setNewContentTitle('');
        setNewContentImportance('normal');
    };

    const removeContent = (id: string) => {
        setContents(contents.filter(c => c.id !== id));
    };

    const toggleComplete = (id: string) => {
        setContents(contents.map(c =>
            c.id === id ? { ...c, completed: !c.completed } : c
        ));
    };

    const updateContent = (id: string, title: string, importance: ImportanceLevel) => {
        setContents(contents.map(c =>
            c.id === id ? { ...c, title, importance } : c
        ));
        setEditingId(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setContents((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);
                return newItems.map((item, idx) => ({ ...item, order: idx }));
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(contents);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.addContent}>
                <div className={styles.addContentRow}>
                    <div className={styles.flex2}>
                        <FormField>
                            <Input
                                value={newContentTitle}
                                onChange={(e) => setNewContentTitle(e.target.value)}
                                placeholder="Nome do conteúdo..."
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addContent())}
                            />
                        </FormField>
                    </div>

                    <div className={styles.flex1}>
                        <FormField>
                            <Select
                                value={newContentImportance}
                                onChange={(value) => setNewContentImportance(value as ImportanceLevel)}
                                options={importanceOptions}
                            />
                        </FormField>
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        icon={<span>+</span>}
                        onClick={addContent}
                        disabled={!newContentTitle.trim()}
                    />
                </div>
            </div>

            <div className={styles.contentList}>
                {contents.length === 0 ? (
                    <Text variant="caption" className={styles.emptyList}>
                        Nenhum conteúdo adicionado
                    </Text>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                    >
                        <SortableContext
                            items={contents.map(c => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className={styles.sortableList}>
                                {contents
                                    .sort((a, b) => a.order - b.order)
                                    .map((content, index) => (
                                        <SortableContentItem
                                            key={content.id}
                                            content={content}
                                            index={index + 1}
                                            isEditing={editingId === content.id}
                                            onEdit={() => setEditingId(content.id)}
                                            onSave={updateContent}
                                            onCancel={() => setEditingId(null)}
                                            onDelete={() => removeContent(content.id)}
                                            onToggleComplete={() => toggleComplete(content.id)}
                                        />
                                    ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            <div className={styles.footer}>
                <Button variant="ghost" type="button" onClick={onBack}>
                    Voltar
                </Button>
                <Button type="submit" variant="primary">
                    Concluir
                </Button>
            </div>
        </form>
    );
}