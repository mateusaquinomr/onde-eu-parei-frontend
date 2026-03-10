import { useState, useEffect, useRef } from "react";

interface NotesInputProps {
    value: string;
    onChange: (value: string) => void;
    onSave: () => void;
    viewMode: 'default' | 'expanded';
    isEditing: boolean;
    onToggleExpand: () => void;
}

export function NotesInput({
    value,
    onChange,
    onSave,
    viewMode,
    isEditing,
    onToggleExpand
}: NotesInputProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 120);
            textarea.style.height = `${newHeight}px`;
        }
    }, [content]);

    useEffect(() => {
        if (!value) {
            setTitle('');
            setContent('');
            return;
        }

        const strongMatch = value.match(/<strong>(.*?)<\/strong>/);
        if (strongMatch) {
            setTitle(strongMatch[1]);
            const rest = value.replace(/<strong>.*?<\/strong>/, '').replace(/^<br>/, '');
            setContent(rest);
        } else {
            setTitle('');
            setContent(value);
        }
    }, [value]);

    function emitChange(newTitle: string, newContent: string) {
        if (!newTitle && !newContent) {
            onChange('');
            return;
        }

        let combined = '';
        if (newTitle) {
            combined += `<strong>${newTitle}</strong>`;
        }
        if (newContent) {
            if (newTitle) combined += '<br>';
            combined += newContent;
        }
        onChange(combined);
    }

    return (
        <div className={`notes-input ${viewMode === 'expanded' ? 'expanded' : ''}`}>
            <div className="notes-input__header">
                <button className="notes-input__left">+</button>
                <div className="notes-input__spacer" />
                <div className="notes-input__actions">
                    {!isEditing && (
                        <button
                            className="icon-button expand"
                            onClick={onToggleExpand}
                            title={viewMode === 'expanded' ? "Recolher" : "Expandir editor"}
                        >
                            {viewMode === 'expanded' ? '⤢' : '⤢'}
                        </button>
                    )}
                    <button onClick={onSave}>
                        {isEditing ? '✓' : '↑'}
                    </button>
                </div>
            </div>

            <div className="notes-input__fields">
                <input
                    type="text"
                    className="notes-input__title"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => {
                        const newTitle = e.target.value;
                        setTitle(newTitle);
                        emitChange(newTitle, content);
                    }}
                />

                <textarea
                    ref={textareaRef}
                    className="notes-input__content"
                    placeholder="Escreva suas anotações..."
                    value={content}
                    onChange={(e) => {
                        const newContent = e.target.value;
                        setContent(newContent);
                        emitChange(title, newContent);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                            e.preventDefault();
                            onSave();
                        }
                    }}
                    rows={2}
                />
            </div>
        </div>
    );
}