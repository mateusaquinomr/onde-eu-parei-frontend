import { useState } from 'react';
import type { Note } from '../../types/types';
import { NotesHeader } from './NotesHeader';
import { NotesInput } from './NotesInput';
import { NotesList } from './NotesList';
import './notes-widget.css';

type ViewMode = 'default' | 'expanded';

interface NotesWidgetProps {
    topicId: string;
    contentId: string;
}

export function NotesWidget({ topicId, contentId }: NotesWidgetProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('default');
    const [notes, setNotes] = useState<Note[]>([]);
    const [text, setText] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [showAllNotes, setShowAllNotes] = useState(false);

    function handleSave() {
        if (!text) return;

        if (editingNoteId) {
            setNotes(prev =>
                prev.map(note =>
                    note.id === editingNoteId
                        ? {
                            ...note,
                            text,
                            updatedAt: new Date()
                        }
                        : note
                )
            );
        } else {
            setNotes(prev => [
                {
                    id: crypto.randomUUID(),
                    topicId,
                    contentId,
                    text,
                    createdAt: new Date(),
                },
                ...prev,
            ]);
        }

        setText('');
        setEditingNoteId(null);
        setViewMode('default');
    }

    function handleEdit(note: Note) {
        setText(note.text);
        setEditingNoteId(note.id);
        setViewMode('expanded');
    }

    function handleToggleExpand() {
        setViewMode(prev => prev === 'default' ? 'expanded' : 'default');
    }

    function handleBackFromExpand() {
        setViewMode('default');
        setEditingNoteId(null);
        setText('');
    }

    function handleDelete(id: string) {
        setNotes(prev => prev.filter(note => note.id !== id));
    }

    function handleReorder(reorderedNotes: Note[]) {
        setNotes(reorderedNotes);
    }

    function handleViewMore() {
        setShowAllNotes(true);
    }

    function handleViewLess() {
        setShowAllNotes(false);
    }

    const hasManyNotes = notes.length > 3;
    const displayedNotes = showAllNotes ? notes : notes.slice(0, 3);

    return (
        <div className={`notes-widget ${viewMode}`}>
            <NotesHeader
                viewMode={viewMode}
                onToggleExpand={handleToggleExpand}
                onBack={handleBackFromExpand}
                isEditing={!!editingNoteId}
            />

            <NotesInput
                value={text}
                onChange={setText}
                onSave={handleSave}
                viewMode={viewMode}
                isEditing={!!editingNoteId}
                onToggleExpand={handleToggleExpand}
            />

            {viewMode === 'default' && (
                <div className="notes-list-container">
                    <div
                        className={`notes-scroll-container ${hasManyNotes ? 'fixed-height' : ''} ${showAllNotes ? 'show-all' : ''}`}
                    >
                        <NotesList
                            notes={displayedNotes}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onReorder={handleReorder}
                        />
                    </div>

                    {hasManyNotes && (
                        <div className="notes-list-controls">
                            {!showAllNotes ? (
                                <button
                                    className="link-button view-more"
                                    onClick={handleViewMore}
                                >
                                    Ver mais ({notes.length - 3} ocultas) v
                                </button>
                            ) : (
                                <button
                                    className="link-button view-less"
                                    onClick={handleViewLess}
                                >
                                    ^ Ver menos
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}