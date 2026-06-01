import { useState, useEffect, useCallback } from 'react';
import { useTopics } from '../../../hooks/useTopics';
import { NotesHeader } from './NotesHeader';
import { NotesInput } from './NotesInput';
import { NotesList } from './NotesList';
import styles from './Notes.module.css';

type ViewMode = 'default' | 'expanded';

interface NotesProps {
    topicId: string;
    contentId: string;
    showHeader?: boolean;
}

interface LocalNote {
    id: string;
    text: string;
    createdAt: Date;
    updatedAt?: Date;
}

export function Notes({ topicId, contentId, showHeader = true }: NotesProps) {
    const { topics, updateTopic } = useTopics();
    const [viewMode, setViewMode] = useState<ViewMode>('default');
    const [notes, setNotes] = useState<LocalNote[]>([]);
    const [text, setText] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [showAllNotes, setShowAllNotes] = useState(false);
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        const topic = topics.find(t => t.id === topicId);
        const content = topic?.contents.find(c => c.id === contentId);
        const notesString = content?.studyData?.notes || '';

        if (notesString) {
            try {
                const parsedNotes = JSON.parse(notesString) as LocalNote[];
                setNotes(parsedNotes);
            } catch {
                setNotes([]);
            }
        } else {
            setNotes([]);
        }
    }, [topics, topicId, contentId]);

    const saveNotes = useCallback(async (updatedNotes: LocalNote[]) => {
        const topic = topics.find(t => t.id === topicId);
        if (!topic) return;

        const serialized = JSON.stringify(updatedNotes);

        const updatedContents = topic.contents.map(c =>
            c.id === contentId
                ? {
                    ...c,
                    studyData: {
                        ...c.studyData,
                        notes: serialized
                    }
                }
                : c
        );

        await updateTopic(topicId, { contents: updatedContents });
    }, [topics, topicId, contentId, updateTopic]);

    function handleSave() {
        if (!text.trim()) {
            setShowInput(false);
            setText('');
            setEditingNoteId(null);
            return;
        }

        if (editingNoteId) {
            const updatedNotes = notes.map(note =>
                note.id === editingNoteId
                    ? {
                        ...note,
                        text,
                        updatedAt: new Date()
                    }
                    : note
            );
            setNotes(updatedNotes);
            saveNotes(updatedNotes);
        } else {
            const newNote: LocalNote = {
                id: crypto.randomUUID(),
                text,
                createdAt: new Date(),
            };
            const updatedNotes = [newNote, ...notes];
            setNotes(updatedNotes);
            saveNotes(updatedNotes);
        }

        setText('');
        setEditingNoteId(null);
        setShowInput(false);
        setViewMode('default');
    }

    function handleEdit(note: LocalNote) {
        setText(note.text);
        setEditingNoteId(note.id);
        setShowInput(true);
        setViewMode('default');
    }

    function handleToggleExpand() {
        setViewMode(prev => prev === 'default' ? 'expanded' : 'default');
    }

    function handleBackFromExpand() {
        setViewMode('default');
        setShowInput(false);
        setEditingNoteId(null);
        setText('');
    }

    function handleDelete(id: string) {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        saveNotes(updatedNotes);
    }

    function handleReorder(reorderedNotes: LocalNote[]) {
        setNotes(reorderedNotes);
        saveNotes(reorderedNotes);
    }

    function handleViewMore() {
        setShowAllNotes(true);
    }

    function handleViewLess() {
        setShowAllNotes(false);
    }

    function handleAddNote() {
        setShowInput(!showInput);
        setViewMode('default');
        if (showInput) {
            setText('');
            setEditingNoteId(null);
        }
    }

    const hasManyNotes = notes.length > 3;
    const displayedNotes = showAllNotes ? notes : notes.slice(0, 3);
    const showList = viewMode !== 'expanded';

    return (
        <div className={`${styles.notesWidget} ${viewMode === 'expanded' ? styles.expanded : ''}`}>
            {showHeader && (
                <NotesHeader
                    viewMode={viewMode}
                    onToggleExpand={handleToggleExpand}
                    onBack={handleBackFromExpand}
                    isEditing={!!editingNoteId}
                    notesCount={notes.length}
                    onAddNote={handleAddNote}
                    showInput={showInput}
                />
            )}

            {!showHeader && notes.length === 0 && !showInput && (
                <button className={styles.addNoteButton} onClick={handleAddNote}>
                    <span className="material-icons">add</span>
                    Adicionar nota
                </button>
            )}

            {!showHeader && notes.length > 0 && !showInput && (
                <div className={styles.addNoteWrapper}>
                    <button className={styles.addNoteButtonSmall} onClick={handleAddNote}>
                        <span className="material-icons">add</span>
                        Nova nota
                    </button>
                </div>
            )}

            {showInput && (
                <NotesInput
                    value={text}
                    onChange={setText}
                    onSave={handleSave}
                    viewMode={viewMode}
                    isEditing={!!editingNoteId}
                    onToggleExpand={handleToggleExpand}
                />
            )}

            {showList && (
                <>
                    {notes.length === 0 && !showInput && showHeader ? (
                        <div className={styles.emptyNotesPlaceholder} />
                    ) : notes.length === 0 && !showInput && !showHeader ? (
                        <div className={styles.emptyNotesMessage}>
                            <span className="material-icons">note_add</span>
                            <span>Clique em "Adicionar nota" para começar</span>
                        </div>
                    ) : (
                        <div className={styles.notesListContainer}>
                            <div
                                className={`${styles.notesScrollContainer} ${hasManyNotes ? styles.fixedHeight : ''} ${showAllNotes ? styles.showAll : ''}`}
                            >
                                <NotesList
                                    notes={displayedNotes}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onReorder={handleReorder}
                                />
                            </div>

                            {hasManyNotes && (
                                <div className={styles.notesListControls}>
                                    {!showAllNotes ? (
                                        <button
                                            className={styles.linkButton}
                                            onClick={handleViewMore}
                                        >
                                            Ver mais ({notes.length - 3} ocultas)
                                        </button>
                                    ) : (
                                        <button
                                            className={styles.linkButton}
                                            onClick={handleViewLess}
                                        >
                                            Ver menos
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}