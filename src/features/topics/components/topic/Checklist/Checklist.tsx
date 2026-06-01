import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import type { ChecklistItem } from '../../../types/topic.types';
import styles from './Checklist.module.css';

interface ChecklistProps {
    items: ChecklistItem[];
    onUpdate: (items: ChecklistItem[]) => void;
}

export function Checklist({ items, onUpdate }: ChecklistProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    const handleToggle = (id: string) => {
        const updated = items.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        onUpdate(updated);
    };

    const handleAddItem = () => {
        const newItem: ChecklistItem = {
            id: crypto.randomUUID(),
            text: 'Novo item',
            completed: false,
            order: items.length
        };
        onUpdate([...items, newItem]);
        setEditingId(newItem.id);
        setEditText('');
    };

    const handleAddTemplate = () => {
        const templateItems: ChecklistItem[] = [
            {
                id: crypto.randomUUID(),
                text: 'Teoria',
                completed: false,
                order: items.length
            },
            {
                id: crypto.randomUUID(),
                text: 'Exercícios',
                completed: false,
                order: items.length + 1
            }
        ];
        onUpdate([...items, ...templateItems]);
    };

    const handleStartEdit = (item: ChecklistItem) => {
        setEditingId(item.id);
        setEditText(item.text);
    };

    const handleSaveEdit = (id: string) => {
        if (editText.trim()) {
            const updated = items.map(item =>
                item.id === id ? { ...item, text: editText.trim() } : item
            );
            onUpdate(updated);
        }
        setEditingId(null);
        setEditText('');
    };

    const handleDelete = (id: string) => {
        const updated = items.filter(item => item.id !== id);
        onUpdate(updated);
    };

    const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') {
            handleSaveEdit(id);
        } else if (e.key === 'Escape') {
            setEditingId(null);
            setEditText('');
        }
    };

    const sortedItems = [...items].sort((a, b) => a.order - b.order);

    return (
        <div className={styles.checklist}>
            <div className={styles.header}>
                <span className={styles.label}>Checklist</span>
                <div className={styles.actions}>
                    <Button
                        variant="ghost"
                        onClick={handleAddTemplate}
                        title="Adicionar Teoria e Exercícios"
                    >
                        <span className="material-icons">auto_awesome</span>
                        Template
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleAddItem}
                        title="Adicionar item"
                    >
                        <span className="material-icons">add</span>
                        Adicionar
                    </Button>
                </div>
            </div>

            <div className={styles.items}>
                {sortedItems.length === 0 && (
                    <div className={styles.emptyHint}>
                        <span className="material-icons">checklist</span>
                        <span>Adicione itens para acompanhar seu progresso</span>
                    </div>
                )}

                {sortedItems.map((item) => (
                    <div key={item.id} className={styles.checklistItem}>
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggle(item.id)}
                            className={styles.checkbox}
                        />

                        {editingId === item.id ? (
                            <Input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onBlur={() => handleSaveEdit(item.id)}
                                onKeyDown={(e) => handleKeyDown(e, item.id)}
                                autoFocus
                                className={styles.editInput}
                            />
                        ) : (
                            <span
                                className={`${styles.itemText} ${item.completed ? styles.completed : ''}`}
                                onClick={() => handleStartEdit(item)}
                            >
                                {item.text}
                            </span>
                        )}

                        <Button
                            variant="ghost"
                            icon={<span className="material-icons">delete_outline</span>}
                            onClick={() => handleDelete(item.id)}
                            className={styles.deleteBtn}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}