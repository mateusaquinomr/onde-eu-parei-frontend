interface Props {
    viewMode: 'default' | 'expanded';
    onToggleExpand: () => void;
    onBack: () => void;
    isEditing: boolean;
}

export function NotesHeader({ viewMode, onToggleExpand, onBack, isEditing }: Props) {
    return (
        <header className="notes-header">
            <h3>Anotações</h3>

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
                    <div style={{ width: '32px' }} />
                )}
            </div>
        </header>
    );
}