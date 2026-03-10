import { useState, useRef, useEffect } from 'react';
import { Text } from '../Text/Text';
import { Input } from '../Form/Input';
import styles from './EditableTitle.module.css';

interface EditableTitleProps {
    value: string;
    onSave: (newValue: string) => void;
    variant?: 'pageTitle' | 'cardSectionTitle' | 'cardTitle' | 'body' | 'label' | 'buttonText' | 'caption' | 'helper' | 'note';
    isEditing?: boolean;
    className?: string;
    placeholder?: string;
}

export function EditableTitle({
    value,
    onSave,
    variant = 'pageTitle',
    isEditing: externalEditing,
    className,
    placeholder = 'Digite o título...'
}: EditableTitleProps) {
    const [isEditing, setIsEditing] = useState(externalEditing || false);
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (editValue.trim() && editValue !== value) {
            onSave(editValue);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditValue(value);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className={`${styles.editingContainer} ${className || ''}`}>
                <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className={styles.editInput}
                    placeholder={placeholder}
                    autoFocus
                />
            </div>
        );
    }

    return (
        <div
            className={`${styles.container} ${className || ''}`}
            onClick={() => setIsEditing(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    setIsEditing(true);
                }
            }}
        >
            <Text variant={variant} className={styles.title}>
                {value}
            </Text>
            <button
                className={styles.editButton}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                aria-label="Editar título"
                title="Clique para editar"
            >
                !
            </button>
        </div>
    );
}