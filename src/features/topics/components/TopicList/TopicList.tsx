import type { Topic } from '../../types/topic.types';
import { TopicCard } from '../TopicCard/TopicCard';
import { Text } from '@/shared/components/ui/Text/Text';
import styles from './TopicList.module.css';

interface TopicListProps {
    topics: Topic[];
    onTopicClick: (topicId: string) => void;
}

export function TopicList({ topics, onTopicClick }: TopicListProps) {
    if (topics.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Text variant="body">Nenhum tópico ainda</Text>
                <Text variant="caption">Clique em "+ Adicionar tópico" para começar</Text>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {topics.map(topic => (
                <TopicCard
                    key={topic.id}
                    topic={topic}
                    onClick={() => onTopicClick(topic.id)}
                />
            ))}
        </div>
    );
}