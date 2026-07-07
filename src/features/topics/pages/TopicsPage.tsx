import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { TopicList } from '../components/TopicList/TopicList';
import { CreateTopicModal } from '../components/CreateTopicModal/CreateTopicModal';
import { ImportEditalModal } from '@/features/editais/components/import-edital/ImportEditalModal';
import { useTopics } from '../hooks/useTopics';
import styles from './TopicsPage.module.css';

export function TopicsPage() {
    const navigate = useNavigate();
    const { topics, loading, createTopic, createMultipleTopics } = useTopics();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const handleTopicClick = (topicId: string) => {
        navigate(`/topics/${topicId}`);
    };

    const handleCreateTopic = async (topicData: any) => {
        await createTopic(topicData);
        setIsCreateModalOpen(false);
    };

    const handleImportTopics = async (topicsData: any[]) => {
        await createMultipleTopics(topicsData);
        setIsImportModalOpen(false);
    };

    if (!loading && topics.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Text as="h1" variant="pageTitle">
                        Tópicos
                    </Text>
                    <div className={styles.actions}>
                        <Button
                            variant="secondary"
                            icon={<span className="material-icons">file_download</span>}
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            Importar tópicos
                        </Button>
                        <Button
                            variant="primary"
                            icon={<span className="material-icons">add</span>}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Adicionar tópico
                        </Button>
                    </div>
                </div>

                <div className={styles.emptyState}>
                    <Text variant="body" className={styles.emptyText}>
                        Adicione seus tópicos de estudo{' '}
                        <button
                            className={styles.inlineButton}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            manualmente
                        </button>
                        {' ou '}
                        <button
                            className={styles.inlineButton}
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            importe
                        </button>
                        {' de um template.'}
                    </Text>
                </div>

                <CreateTopicModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={handleCreateTopic}
                />

                <ImportEditalModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onImport={handleImportTopics}
                />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text as="h1" variant="pageTitle">
                    Tópicos
                </Text>
                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        icon={<span className="material-icons">file_download</span>}
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        Importar tópicos
                    </Button>
                    <Button
                        variant="primary"
                        icon={<span className="material-icons">add</span>}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Adicionar tópico
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Carregando...</div>
            ) : (
                <TopicList
                    topics={topics}
                    onTopicClick={handleTopicClick}
                />
            )}

            <CreateTopicModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateTopic}
            />

            <ImportEditalModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportTopics}
            />
        </div>
    );
}
