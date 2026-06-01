import { useState } from 'react';
import type { ChecklistItem } from '../../../types/topic.types';
import styles from './ToDo.module.css';

interface ToDoProps {
    topicId: string;
    contentId: string;
    checklist?: ChecklistItem[];
    onUpdateChecklist?: (items: ChecklistItem[]) => void;
}

export function ToDo({ checklist = [], onUpdateChecklist }: ToDoProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');

    const handleDoubleClick = (item: ChecklistItem) => {
        setEditingId(item.id);
        setEditingText(item.text);
    };

    const handleSaveEdit = (id: string) => {
        if (editingText.trim() && onUpdateChecklist) {
            const updated = checklist.map(i =>
                i.id === id ? { ...i, text: editingText.trim() } : i
            );
            onUpdateChecklist(updated);
        }
        setEditingId(null);
        setEditingText('');
    };

    const handleAddItem = () => {
        if (!onUpdateChecklist) return;

        const newItem: ChecklistItem = {
            id: crypto.randomUUID(),
            text: 'Novo item',
            completed: false,
            order: checklist.length
        };
        onUpdateChecklist([...checklist, newItem]);
        setEditingId(newItem.id);
        setEditingText('');
    };

    const handleToggleComplete = (id: string) => {
        if (!onUpdateChecklist) return;

        const updated = checklist.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        onUpdateChecklist(updated);
    };

    const handleDelete = (id: string) => {
        if (!onUpdateChecklist) return;

        const updated = checklist.filter(item => item.id !== id);
        onUpdateChecklist(updated);
    };

    const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') {
            handleSaveEdit(id);
        } else if (e.key === 'Escape') {
            setEditingId(null);
            setEditingText('');
        }
    };

    return (
        <div className={styles.todoSection}>
            <div className={styles.todoHeader}>
                <button className={styles.addTodoBtn} onClick={handleAddItem}>
                    <span className="material-icons">add</span>
                    Adicionar To do
                </button>
            </div>
            <div className={styles.todoList}>
                {checklist.length === 0 ? (
                    <div className={styles.emptyTodo}>
                        <span className="material-icons">checklist</span>
                        <span>Nenhum item adicionado</span>
                    </div>
                ) : (
                    checklist.map((item) => (
                        <div key={item.id} className={styles.todoItem}>
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => handleToggleComplete(item.id)}
                                className={styles.todoCheckbox}
                            />
                            {editingId === item.id ? (
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onBlur={() => handleSaveEdit(item.id)}
                                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                                    autoFocus
                                    className={styles.todoEditInput}
                                />
                            ) : (
                                <span
                                    className={styles.todoText}
                                    onDoubleClick={() => handleDoubleClick(item)}
                                >
                                    {item.text}
                                </span>
                            )}
                            <button
                                className={styles.todoDelete}
                                onClick={() => handleDelete(item.id)}
                            >
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}