import styles from './DragHandle.module.css';

interface DragHandleProps {
    dragHandleProps?: any;
    isVisible?: boolean;
    className?: string;
}

export function DragHandle({
    dragHandleProps,
    isVisible = true,
    className
}: DragHandleProps) {
    if (!isVisible) return null;

    return (
        <div
            className={`${styles.dragHandle} ${className || ''}`}
            {...dragHandleProps}
        >
            <span className={styles.icon}>⋮⋮</span>
        </div>
    );
}