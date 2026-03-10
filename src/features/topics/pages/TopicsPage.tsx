import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { TopicList } from '../components/topic/TopicList/TopicList';
import { CreateTopicModal } from '../components/topic/CreateTopicModal/CreateTopicModal';
import { useTopics } from '../hooks/useTopics';
import styles from './TopicsPage.module.css';

export function TopicsPage() {
    const navigate = useNavigate();
    const { topics, loading, createTopic } = useTopics();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTopicClick = (topicId: string) => {
        navigate(`/topics/${topicId}`);
    };

    const handleCreateTopic = async (topicData: any) => {
        await createTopic(topicData);
        setIsModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text as="h1" variant="pageTitle">
                    Tópicos
                </Text>
                <Button
                    variant="primary"
                    icon={<span>+</span>}
                    onClick={() => setIsModalOpen(true)}
                >
                    Adicionar tópico
                </Button>
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
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreateTopic}
            />
        </div>
    );
}