import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContentItem } from '../ContentItem/ContentItem';
import type { Content, ImportanceLevel } from '../../../types/topic.types';

interface SortableContentItemProps {
    content: Content;
    index: number;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (id: string, title: string, importance: ImportanceLevel) => void;
    onCancel: () => void;
    onDelete: () => void;
    onToggleComplete: () => void;
    showDragHandle?: boolean;
}

export function SortableContentItem(props: SortableContentItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.content.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : 0,
    };

    const handleToggleComplete = () => {
        console.log('🟡 SortableContentItem - Toggle', props.content.id);
        props.onToggleComplete();
    };

    const handleDelete = () => {
        console.log('🟡 SortableContentItem - Delete', props.content.id);
        props.onDelete();
    };

    return (
        <div ref={setNodeRef} style={style}>
            <ContentItem
                content={props.content}
                index={props.index}
                isEditing={props.isEditing}
                onEdit={props.onEdit}
                onSave={props.onSave}
                onCancel={props.onCancel}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
                dragHandleProps={props.showDragHandle ? { ...attributes, ...listeners } : undefined}
            />
        </div>
    );
}