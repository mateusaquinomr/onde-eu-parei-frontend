import { useState } from 'react';
import styles from './ContentEditorRow.module.css';

interface ContentEditorRowProps {
    id: string;
    title: string;
    importance: 'pouco' | 'normal' | 'muita';
    index: number;
    onUpdate: (id: string, title: string, importance: 'pouco' | 'normal' | 'muita') => void;
    onDelete: (id: string) => void;
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

export function ContentEditorRow({
    id,
    title,
    importance,
    index,
    onUpdate,
    onDelete
}: ContentEditorRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    const [editImportance, setEditImportance] = useState(importance);

    const handleSave = () => {
        if (editTitle.trim()) {
            onUpdate(id, editTitle, editImportance);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(title);
        setEditImportance(importance);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className={styles.contentRow}>
                <div className={styles.contentIndex}>{index}</div>
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.contentTitleInput}
                    autoFocus
                    placeholder="Nome do conteúdo"
                />
                <select
                    value={editImportance}
                    onChange={(e) => setEditImportance(e.target.value as any)}
                    className={styles.contentSelect}
                >
                    {importanceOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className={styles.contentActions}>
                    <button
                        onClick={handleSave}
                        className={`${styles.actionBtn} ${styles.saveBtn}`}
                        title="Salvar"
                    >
                        <span className="material-icons">check</span>
                    </button>
                    <button
                        onClick={handleCancel}
                        className={`${styles.actionBtn} ${styles.cancelBtn}`}
                        title="Cancelar"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.contentRow}>
            <div className={styles.contentIndex}>{index}</div>
            <div
                className={styles.contentTitle}
                onDoubleClick={() => setIsEditing(true)}
                title="Duplo clique para editar"
            >
                {title}
            </div>
            <div
                className={styles.contentImportance}
                style={{ color: importanceColors[importance] }}
            >
                <span className={styles.importanceDot} />
                {importanceOptions.find(opt => opt.value === importance)?.label}
            </div>
            <div className={styles.contentActions}>
                <button
                    onClick={() => setIsEditing(true)}
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    title="Editar"
                >
                    <span className="material-icons">edit</span>
                </button>
                <button
                    onClick={() => onDelete(id)}
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    title="Excluir"
                >
                    <span className="material-icons">delete</span>
                </button>
            </div>
        </div>
    );
}