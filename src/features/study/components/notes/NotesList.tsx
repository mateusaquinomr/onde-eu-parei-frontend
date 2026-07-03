import { useState } from 'react';
import type { Note } from '../../types/study.types';
import styles from './Notes.module.css';

interface NotesListProps {
    notes: Note[];
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
    onReorder?: (notes: Note[]) => void;
}

function extractTitle(html: string): string {
    if (!html) return '';

    const temp = document.createElement('div');
    temp.innerHTML = html;

    const nodes = Array.from(temp.childNodes);

    for (const node of nodes) {
        const text = node.textContent?.trim();
        if (node.nodeName === 'BR') continue;
        if (!text) continue;
        return text;
    }

    return '';
}

function extractContent(html: string): string {
    if (!html) return '';

    const temp = document.createElement('div');
    temp.innerHTML = html;

    const strong = temp.querySelector('strong');
    if (strong) {
        strong.remove();
    }

    const firstChild = temp.firstChild;
    if (firstChild?.nodeName === 'BR') {
        firstChild.remove();
    }

    return temp.innerHTML;
}

function formatDate(date: Date): string {
    const now = new Date();
    const noteDate = new Date(date);

    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDateOnly = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());

    const diffTime = nowDate.getTime() - noteDateOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Hoje';
    } else if (diffDays === 1) {
        return 'Ontem';
    } else if (diffDays < 7) {
        return `${diffDays} dias atrás`;
    } else {
        return noteDate.toLocaleDateString();
    }
}

export function NotesList({
    notes,
    onEdit,
    onDelete,
    onReorder,
}: NotesListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    const [draggedItem, setDraggedItem] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleToggle = (noteId: string) => {
        setExpandedId((prev) => (prev === noteId ? null : noteId));
        setMenuOpenId(null);
    };

    const handleMenuClick = (e: React.MouseEvent, noteId: string) => {
        e.stopPropagation();
        setMenuOpenId(prev => prev === noteId ? null : noteId);
    };

    const handleEdit = (e: React.MouseEvent, note: Note) => {
        e.stopPropagation();
        onEdit(note);
        setMenuOpenId(null);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onDelete(id);
        setMenuOpenId(null);
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        if (!onReorder) return;
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        e.currentTarget.classList.add('dragging');
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        if (!onReorder) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();

        if (!onReorder) return;

        const dragIndex = draggedItem;
        if (dragIndex === null || dragIndex === dropIndex) {
            setDraggedItem(null);
            setDragOverIndex(null);
            return;
        }

        const items = Array.from(notes);
        const [reorderedItem] = items.splice(dragIndex, 1);
        items.splice(dropIndex, 0, reorderedItem);

        onReorder(items);

        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('dragging');
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    return (
        <ul className={styles['notes-list']}>
            {notes.map((note, index) => {
                const isExpanded = expandedId === note.id;
                const isMenuOpen = menuOpenId === note.id;
                const title = extractTitle(note.text);
                const content = extractContent(note.text);
                const date = formatDate(note.updatedAt || note.createdAt);

                return (
                    <li
                        key={note.id}
                        className={`${styles['note-item']} ${dragOverIndex === index ? styles['drop-over'] : ''}`}
                        draggable={!!onReorder}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        <div
                            className={`${styles['note-card']} ${isExpanded ? styles.expanded : ''}`}
                        >
                            <div className={styles['note-header']}>
                                <strong
                                    className={styles['note-title']}
                                    onClick={() => handleToggle(note.id)}
                                >
                                    {title || 'Sem título'}
                                </strong>

                                <div className={styles['note-menu-container']}>
                                    <button
                                        className={styles['note-menu-button']}
                                        onClick={(e) => handleMenuClick(e, note.id)}
                                    >
                                        ⋮
                                    </button>

                                    {isMenuOpen && (
                                        <div className={styles['note-menu-dropdown']}>
                                            <button
                                                className={styles['note-menu-item']}
                                                onClick={(e) => handleEdit(e, note)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className={`${styles['note-menu-item']} ${styles.delete}`}
                                                onClick={(e) => handleDelete(e, note.id)}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div
                                className={styles['note-body']}
                                onClick={() => handleToggle(note.id)}
                            >
                                {isExpanded ? (
                                    <div
                                        className={styles['note-content-expanded']}
                                        dangerouslySetInnerHTML={{
                                            __html: content || '<em>Sem conteúdo</em>',
                                        }}
                                    />
                                ) : (
                                    <p className={styles['note-preview']}>
                                        {content.replace(/<[^>]*>/g, '').slice(0, 120) || 'Sem conteúdo'}
                                    </p>
                                )}
                            </div>

                            <div className={styles['note-footer']}>
                                <span className={styles['note-date']}>
                                    {date}
                                </span>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}