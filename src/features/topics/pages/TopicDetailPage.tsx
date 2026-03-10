import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import { Select } from '@/shared/components/ui/Form/Select';
import { EditableTitle } from '@/shared/components/ui/EditableTitle/EditableTitle';
import { EditableMetadata } from '@/shared/components/ui/EditableMetadata/EditableMetadata';
import { useTopics } from '../hooks/useTopics';
import { ContentList } from '../components/topic/ContentList/ContentList';
import { CircularProgress } from '../components/topic/CircularProgress/CircularProgress';
import type { Content, ImportanceLevel, NotebookColor, DifficultyLevel } from '../types/topic.types';
import styles from './TopicDetailPage.module.css';

const importanceOptions = [
    { label: 'Pouco importante', value: 'pouco' },
    { label: 'Normal', value: 'normal' },
    { label: 'Muito importante', value: 'muita' }
];

export function TopicDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { topics, loading, updateTopic, updateLastAccessed } = useTopics();
    const topic = topics.find(t => t.id === id);
    const [showAddContent, setShowAddContent] = useState(false);
    const [newContentTitle, setNewContentTitle] = useState('');
    const [newContentImportance, setNewContentImportance] = useState<ImportanceLevel>('normal');

    useEffect(() => {
        if (id && topic) {
            updateLastAccessed(id);
        }
    }, [id, topic, updateLastAccessed]);

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (!topic) {
        return (
            <div className={styles.notFound}>
                <Text variant="body">Tópico não encontrado</Text>
                <Button variant="primary" onClick={() => window.history.back()}>
                    Voltar
                </Button>
            </div>
        );
    }

    const completedContents = topic.contents.filter(c => c.completed).length;
    const totalContents = topic.contents.length;
    const progress = totalContents > 0
        ? Math.round((completedContents / totalContents) * 100)
        : 0;

    const handleGoBack = () => {
        window.history.back();
    };

    const handleToggleComplete = (contentId: string) => {
        const updatedContents = topic.contents.map(c =>
            c.id === contentId ? { ...c, completed: !c.completed } : c
        );
        updateTopic(topic.id, { contents: updatedContents });
    };

    const handleUpdateContent = (contentId: string, title: string, importance: ImportanceLevel) => {
        const updatedContents = topic.contents.map(c =>
            c.id === contentId ? { ...c, title, importance } : c
        );
        updateTopic(topic.id, { contents: updatedContents });
    };

    const handleDeleteContent = (contentId: string) => {
        const updatedContents = topic.contents.filter(c => c.id !== contentId);
        updateTopic(topic.id, { contents: updatedContents });
    };

    const handleReorderContents = (reorderedContents: Content[]) => {
        updateTopic(topic.id, { contents: reorderedContents });
    };

    const handleUpdateTopicName = (newName: string) => {
        updateTopic(topic.id, { name: newName });
    };

    const handleUpdateNotebook = (color: NotebookColor) => {
        updateTopic(topic.id, { notebookColor: color });
    };

    const handleUpdateDifficulty = (difficulty: DifficultyLevel) => {
        updateTopic(topic.id, { difficulty });
    };

    const handleAddContent = () => {
        if (!newContentTitle.trim()) return;

        const newContent: Content = {
            id: Date.now().toString(),
            title: newContentTitle,
            importance: newContentImportance,
            completed: false,
            order: topic.contents.length,
            createdAt: new Date()
        };

        const updatedContents = [...topic.contents, newContent];
        updateTopic(topic.id, { contents: updatedContents });

        setNewContentTitle('');
        setNewContentImportance('normal');
        setShowAddContent(false);
    };

    const formatLastAccessed = (date?: Date | string | null) => {
        if (!date) return 'Nunca';

        try {

            const dateObj = typeof date === 'string' ? new Date(date) : date;

            if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
                return 'Data inválida';
            }

            return dateObj.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };

    const formatTotalHours = (hours?: number) => {
        if (hours === undefined || hours === null) return '0';
        return hours.toFixed(1);
    };

    const notebookOptions = [
        { label: 'Azul', value: 'azul' as const, color: '#3B82F6' },
        { label: 'Amarelo', value: 'amarelo' as const, color: '#F59E0B' },
        { label: 'Vermelho', value: 'vermelho' as const, color: '#EF4444' },
        { label: 'Verde', value: 'verde' as const, color: '#10B981' },
        { label: 'Rosa', value: 'rosa' as const, color: '#EC4899' },
        { label: 'Preto', value: 'preto' as const, color: '#1F2937' }
    ];

    const difficultyOptions = [
        { label: 'Fácil', value: 'facil' as const },
        { label: 'Médio', value: 'medio' as const },
        { label: 'Difícil', value: 'dificil' as const }
    ];

    const metadataFields = [
        {
            id: 'notebook',
            label: 'Caderno',
            value: topic.notebookColor,
            type: 'select' as const,
            options: notebookOptions
        },
        {
            id: 'difficulty',
            label: 'Dificuldade',
            value: topic.difficulty,
            type: 'select' as const,
            options: difficultyOptions
        }
    ];

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <div className={styles.breadcrumb}>
                    <Button
                        variant="ghost"
                        icon={<span>←</span>}
                        onClick={handleGoBack}
                        className={styles.backButton}
                    />
                    <Text variant="caption" className={styles.breadcrumbText}>
                        Tópicos
                    </Text>
                </div>
            </div>

            <div className={styles.titleSection}>
                <EditableTitle
                    value={topic.name}
                    onSave={handleUpdateTopicName}
                    variant="pageTitle"
                />
            </div>

            <div className={styles.twoColumnLayout}>

                <div className={styles.leftColumn}>

                    <div className={styles.progressCard}>
                        <CircularProgress
                            progress={progress}
                            completed={completedContents}
                            total={totalContents}
                            size={140}
                            strokeWidth={8}
                        />


                        <div className={styles.progressStats}>
                            <div className={styles.statItem}>
                                <Text variant="caption" className={styles.statLabel}>
                                    último acesso
                                </Text>
                                <Text variant="cardSectionTitle" className={styles.statValue}>
                                    {formatLastAccessed(topic.lastAccessed)}
                                </Text>

                            </div>

                            <div className={styles.statItem}>
                                <Text variant="caption" className={styles.statLabel}>
                                    horas totais
                                </Text>
                                <Text variant="cardSectionTitle" className={styles.statValue}>
                                    {formatTotalHours(topic.totalHours)}h
                                </Text>

                            </div>
                        </div>
                    </div>

                    <div className={styles.metadataCard}>
                        <EditableMetadata
                            fields={metadataFields}
                            onSave={(fieldId: string, value: any) => {
                                if (fieldId === 'notebook') {
                                    handleUpdateNotebook(value as NotebookColor);
                                } else if (fieldId === 'difficulty') {
                                    handleUpdateDifficulty(value as DifficultyLevel);
                                }
                            }}
                        />

                        {topic.tags.length > 0 && (
                            <div className={styles.tagsSection}>
                                <Text variant="label" className={styles.metadataLabel}>
                                    Etiquetas
                                </Text>
                                <div className={styles.tagsContainer}>
                                    {topic.tags.map(tag => (
                                        <span key={tag.id} className={styles.tag}>
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.contentsHeader}>
                        <Text variant="cardTitle">Conteúdos</Text>
                        <Button
                            variant="primary"
                            // icon={<span>+</span>}
                            onClick={() => setShowAddContent(!showAddContent)}
                        >
                            {showAddContent ? 'Cancelar' : '+ Conteúdo'}
                        </Button>
                    </div>

                    {showAddContent && (
                        <div className={styles.addContent}>
                            <div className={styles.addContentRow}>
                                <div className={styles.flex2}>
                                    <Input
                                        value={newContentTitle}
                                        onChange={(e) => setNewContentTitle(e.target.value)}
                                        placeholder="Nome do conteúdo..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddContent())}
                                        autoFocus
                                    />
                                </div>

                                <div className={styles.flex1}>
                                    <Select
                                        value={newContentImportance}
                                        onChange={(value) => setNewContentImportance(value as ImportanceLevel)}
                                        options={importanceOptions}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    icon={<span>+</span>}
                                    onClick={handleAddContent}
                                    disabled={!newContentTitle.trim()}
                                />
                            </div>
                        </div>
                    )}

                    <ContentList
                        contents={topic.contents}
                        isEditing={true}
                        onToggleComplete={handleToggleComplete}
                        onUpdateContent={handleUpdateContent}
                        onDeleteContent={handleDeleteContent}
                        onReorder={handleReorderContents}
                    />
                </div>
            </div>
        </div>
    );
}