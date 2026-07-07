import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { EditalFilters } from '../components/edital-filters/EditalFilters';
import { EditalHeader } from '../components/edital-header/EditalHeader';
import { NewEditalModal } from '../components/new-edital/NewEditalModal';
import { ImportEditalModal } from '../components/import-edital/ImportEditalModal';
import { useEditais } from '../hooks/useEditais';
import { useTopics } from '@/features/topics/hooks/useTopics';
import { TopicList } from '@/features/topics/components/TopicList/TopicList';
import { CreateTopicModal } from '@/features/topics/components/CreateTopicModal/CreateTopicModal';
import type { Edital } from '../types/edital.types';
import styles from './EditaisPage.module.css';

export function EditaisPage() {
    const navigate = useNavigate();
    const { editais, loading: editaisLoading, refresh: refreshEditais, deleteEdital } = useEditais();
    const { topics, loading: topicsLoading, createTopic, createMultipleTopics, refresh: refreshTopics } = useTopics();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isNewEditalModalOpen, setIsNewEditalModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [editalParaEditar, setEditalParaEditar] = useState<Edital | null>(null);

    console.log('EditaisPage - editais:', editais);
    console.log('EditaisPage - activeFilter:', activeFilter);

    useEffect(() => {
        refreshEditais();
        refreshTopics();
    }, []);

    const filteredTopics = activeFilter
        ? topics.filter(t => {
            const match = t.editalId === activeFilter;
            console.log(`🔍 Tópico: ${t.name}, editalId: ${t.editalId}, filter: ${activeFilter}, match: ${match}`);
            return match;
        })
        : topics;

    console.log('EditaisPage - filteredTopics:', filteredTopics.length);

    const activeEdital = editais.find(e => e.id === activeFilter);

    const handleTopicClick = (topicId: string) => {
        navigate(`/topics/${topicId}`);
    };

    const handleCreateTopic = async (topicData: any) => {
        await createTopic(topicData);
        setIsCreateModalOpen(false);
        refreshTopics();
        refreshEditais();
    };

    const handleImportTopics = async (topicsData: any[]) => {
        await createMultipleTopics(topicsData);
        setIsImportModalOpen(false);
        refreshTopics();
        refreshEditais();
    };

    const handleOpenImportModal = () => {
        setIsNewEditalModalOpen(false);
        setIsImportModalOpen(true);
    };

    const handleNewEditalCreated = () => {
        refreshEditais();
        refreshTopics();
    };

    const handleEditEdital = (edital: Edital) => {
        setEditalParaEditar(edital);
        setIsNewEditalModalOpen(true);
    };

    const handleDeleteEdital = async (edital: Edital) => {
        const confirmar = window.confirm(`Tem certeza que deseja excluir o edital "${edital.nome}"?`);
        if (!confirmar) return;

        try {
            await deleteEdital(edital.id);
            setActiveFilter(null);
            refreshEditais();
            refreshTopics();
        } catch (err) {
            console.error('Erro ao excluir edital:', err);
            alert('Não foi possível excluir o edital. Tente novamente.');
        }
    };

    const handleCloseNewEditalModal = () => {
        setIsNewEditalModalOpen(false);
        setEditalParaEditar(null);
    };

    const isLoading = editaisLoading || topicsLoading;

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Carregando...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text as="h1" variant="pageTitle">
                    Editais
                </Text>
                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        icon={<span className="material-icons">add</span>}
                        onClick={() => setIsNewEditalModalOpen(true)}
                    >
                        Novo edital
                    </Button>
                </div>
            </div>

            <EditalFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            {activeFilter && activeEdital && (
                <EditalHeader
                    edital={activeEdital}
                    onEdit={() => handleEditEdital(activeEdital)}
                    onDelete={() => handleDeleteEdital(activeEdital)}
                />
            )}

            {topics.length === 0 ? (
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
                            onClick={() => setIsNewEditalModalOpen(true)}
                        >
                            importe
                        </button>
                        {' de um template.'}
                    </Text>
                </div>
            ) : (
                <div className={styles.topicsContainer}>
                    <div className={styles.topicsHeader}>
                        <Text variant="cardTitle">
                            Tópicos {activeFilter && activeEdital ? `- ${activeEdital.nome}` : ''}
                        </Text>
                        <Button
                            variant="primary"
                            icon={<span className="material-icons">add</span>}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Adicionar tópico
                        </Button>
                    </div>

                    <TopicList
                        topics={filteredTopics}
                        onTopicClick={handleTopicClick}
                    />
                </div>
            )}

            <NewEditalModal
                isOpen={isNewEditalModalOpen}
                onClose={handleCloseNewEditalModal}
                onImportClick={handleOpenImportModal}
                onEditalCreated={handleNewEditalCreated}
                editalParaEditar={editalParaEditar}
            />

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
