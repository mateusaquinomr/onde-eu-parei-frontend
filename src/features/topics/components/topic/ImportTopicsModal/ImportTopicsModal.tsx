import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button/Button';
import { Text } from '@/shared/components/ui/Text/Text';
import { TopicEditorRow } from './TopicEditorRow';
import { enemTopicsData, type EnemTopic } from '../../../data/enemTopicsData';
import styles from './ImportTopicsModal.module.css';

interface ImportTopicsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (topics: any[]) => void;
}

type Step = 'template' | 'editor';

interface EditableContent {
    id: string;
    title: string;
    importance: 'pouco' | 'normal' | 'muita';
}

interface EditableTopic {
    id: string;
    name: string;
    notebookColor: 'azul' | 'amarelo' | 'vermelho' | 'verde' | 'rosa' | 'preto';
    difficulty: 'facil' | 'medio' | 'dificil';
    contents: EditableContent[];
}

export function ImportTopicsModal({ isOpen, onClose, onImport }: ImportTopicsModalProps) {
    const [step, setStep] = useState<Step>('template');
    const [selectedTemplate, setSelectedTemplate] = useState<'enem' | 'concurso' | null>(null);
    const [topics, setTopics] = useState<EditableTopic[]>([]);

    if (!isOpen) return null;

    const handleSelectTemplate = (template: 'enem' | 'concurso') => {
        if (template === 'concurso') return;

        setSelectedTemplate(template);

        if (template === 'enem') {
            const loadedTopics: EditableTopic[] = enemTopicsData.map((topic: EnemTopic) => ({
                id: crypto.randomUUID(),
                name: topic.name,
                notebookColor: topic.notebookColor,
                difficulty: topic.difficulty,
                contents: topic.contents.map(content => ({
                    id: crypto.randomUUID(),
                    title: content.title,
                    importance: content.importance
                }))
            }));
            setTopics(loadedTopics);
        }

        setStep('editor');
    };

    const handleUpdateTopic = (topicId: string, field: string, value: any) => {
        setTopics(prev => prev.map(topic =>
            topic.id === topicId ? { ...topic, [field]: value } : topic
        ));
    };

    const handleDeleteTopic = (topicId: string) => {
        setTopics(prev => prev.filter(topic => topic.id !== topicId));
    };

    const handleUpdateContent = (topicId: string, contentId: string, title: string, importance: 'pouco' | 'normal' | 'muita') => {
        setTopics(prev => prev.map(topic => {
            if (topic.id !== topicId) return topic;
            return {
                ...topic,
                contents: topic.contents.map(content =>
                    content.id === contentId ? { ...content, title, importance } : content
                )
            };
        }));
    };

    const handleDeleteContent = (topicId: string, contentId: string) => {
        setTopics(prev => prev.map(topic => {
            if (topic.id !== topicId) return topic;
            return {
                ...topic,
                contents: topic.contents.filter(content => content.id !== contentId)
            };
        }));
    };

    const handleAddContent = (topicId: string, newContent: { title: string; importance: 'pouco' | 'normal' | 'muita' }) => {
        setTopics(prev => prev.map(topic => {
            if (topic.id !== topicId) return topic;
            return {
                ...topic,
                contents: [...topic.contents, {
                    id: crypto.randomUUID(),
                    title: newContent.title,
                    importance: newContent.importance
                }]
            };
        }));
    };

    const handleImport = () => {
        const topicsToImport = topics.map(topic => ({
            name: topic.name,
            notebookColor: topic.notebookColor,
            difficulty: topic.difficulty,
            tags: [],
            contents: topic.contents.map(content => ({
                title: content.title,
                importance: content.importance
            }))
        }));

        onImport(topicsToImport);
        handleClose();
    };

    const handleClose = () => {
        setStep('template');
        setSelectedTemplate(null);
        setTopics([]);
        onClose();
    };

    if (step === 'template') {
        return (
            <div className={styles.overlay} onClick={handleClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Importar tópicos</h2>
                        <button className={styles.closeButton} onClick={handleClose}>
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.templatesGrid}>
                            <button
                                className={styles.templateCard}
                                onClick={() => handleSelectTemplate('enem')}
                            >

                                <h3 className={styles.templateTitle}>ENEM</h3>
                                <p className={styles.templateDescription}>
                                    Modelo com matérias da matriz curricular oficial do ENEM disponibilizada no site do ENEP
                                </p>
                            </button>

                            <button
                                className={`${styles.templateCard} ${styles.disabled}`}
                                disabled
                                title="Em breve"
                            >

                                <h3 className={styles.templateTitle}>Concurso</h3>
                                <p className={styles.templateDescription}>
                                    Em breve - Modelo para concursos públicos
                                </p>
                                <span className={styles.disabledBadge}>Em breve</span>
                            </button>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Button variant="ghost" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Importar tópicos - {selectedTemplate === 'enem' ? 'ENEM' : 'Concurso'}
                    </h2>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.topicsEditor}>
                        <div className={styles.editorHeader}>
                            <div></div>
                            <div className={styles.headerTopic}>Tópico</div>
                            <div className={styles.headerCaderno}>Caderno</div>
                            <div className={styles.headerDifficulty}>Dificuldade</div>
                            <div className={styles.headerActions}></div>
                        </div>

                        <div className={styles.topicsList}>
                            {topics.map((topic, idx) => (
                                <TopicEditorRow
                                    key={topic.id}
                                    id={topic.id}
                                    name={topic.name}
                                    notebookColor={topic.notebookColor}
                                    difficulty={topic.difficulty}
                                    contents={topic.contents}
                                    index={idx + 1}
                                    onUpdate={handleUpdateTopic}
                                    onDelete={handleDeleteTopic}
                                    onUpdateContent={handleUpdateContent}
                                    onDeleteContent={handleDeleteContent}
                                    onAddContent={handleAddContent}
                                />
                            ))}
                        </div>

                        {topics.length === 0 && (
                            <div className={styles.emptyTopics}>
                                <Text variant="body">Nenhum tópico para importar</Text>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Button variant="ghost" onClick={() => setStep('template')}>
                        <span className="material-icons">arrow_back</span>
                        Voltar
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleImport}
                        disabled={topics.length === 0}
                    >
                        Importar {topics.length} tópico(s)
                    </Button>
                </div>
            </div>
        </div>
    );
}