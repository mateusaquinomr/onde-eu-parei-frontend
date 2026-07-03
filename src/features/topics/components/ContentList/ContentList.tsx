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
import { Text } from '@/shared/components/ui/Text/Text';
import { SortableContentItem } from '../SortableContentItem/SortableContentItem';
import type { Content, ImportanceLevel, ChecklistItem, QuestionList } from '../../types/topic.types';
import styles from './ContentList.module.css';

interface ContentListProps {
    topicId: string;
    contents: Content[];
    isEditing: boolean;
    onToggleComplete: (contentId: string) => void;
    onUpdateContent: (id: string, title: string, importance: ImportanceLevel) => void;
    onDeleteContent: (contentId: string) => void;
    onReorder: (contents: Content[]) => void;
    onUpdateChecklist: (contentId: string, items: ChecklistItem[]) => void;
    onUpdateNotes: (contentId: string, notes: string) => void;
    onUpdateQuestions?: (contentId: string, lists: QuestionList[]) => void;
}

export function ContentList({
    topicId,
    contents,
    isEditing,
    onToggleComplete,
    onUpdateContent,
    onDeleteContent,
    onReorder,
    onUpdateChecklist,
    onUpdateNotes,
    onUpdateQuestions
}: ContentListProps) {
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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = contents.findIndex((item) => item.id === active.id);
            const newIndex = contents.findIndex((item) => item.id === over.id);

            const newContents = arrayMove(contents, oldIndex, newIndex);
            const reorderedContents = newContents.map((item, idx) => ({
                ...item,
                order: idx
            }));
            onReorder(reorderedContents);
        }
    };

    const handleToggleComplete = (contentId: string) => {
        console.log('ContentList - Toggle', contentId);
        onToggleComplete(contentId);
    };

    const handleDeleteContent = (contentId: string) => {
        console.log('ContentList - Delete', contentId);
        onDeleteContent(contentId);
    };

    const sortedContents = [...contents].sort((a, b) => a.order - b.order);

    if (contents.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Text variant="body">Nenhum conteúdo adicionado</Text>
                <Text variant="caption">
                    {isEditing ? 'Clique em "Adicionar" para começar' : 'Entre no modo edição para adicionar conteúdos'}
                </Text>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
                <SortableContext
                    items={sortedContents.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className={styles.list}>
                        {sortedContents.map((content) => (
                            <SortableContentItem
                                key={content.id}
                                content={content}
                                topicId={topicId}
                                index={content.order + 1}
                                isEditing={editingId === content.id}
                                onEdit={() => setEditingId(content.id)}
                                onSave={(id, title, importance) => {
                                    onUpdateContent(id, title, importance);
                                    setEditingId(null);
                                }}
                                onCancel={() => setEditingId(null)}
                                onDelete={() => handleDeleteContent(content.id)}
                                onToggleComplete={() => handleToggleComplete(content.id)}
                                onUpdateChecklist={onUpdateChecklist}
                                onUpdateNotes={onUpdateNotes}
                                onUpdateQuestions={onUpdateQuestions}
                                showDragHandle={isEditing}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}