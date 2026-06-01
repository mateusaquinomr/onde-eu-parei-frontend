interface NotesHeaderProps {
    viewMode: 'default' | 'expanded';
    onToggleExpand: () => void;
    onBack: () => void;
    isEditing: boolean;
    notesCount: number;
    onAddNote: () => void;
    showInput: boolean;
}

export function NotesHeader({
    viewMode,
    onToggleExpand,
    onBack,
    isEditing,
    notesCount,
    onAddNote,
    showInput
}: NotesHeaderProps) {
    return (
        <header className="notes-header">
            <h3>Notes ({notesCount})</h3>

            <div className="notes-header__actions">
                {isEditing ? (
                    <button
                        className="icon-button back"
                        onClick={onBack}
                        title="Voltar"
                    >
                        ←
                    </button>
                ) : (
                    <button
                        className={`icon-button add-note ${showInput ? 'active' : ''}`}
                        onClick={onAddNote}
                        title={showInput ? "Fechar" : "Adicionar nota"}
                    >
                        {showInput ? (
                            <span className="material-icons">edit_note</span>
                        ) : (
                            <span className="material-icons-outlined">edit_note</span>
                        )}
                    </button>
                )}
            </div>
        </header>
    );
}