import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import type { Topic } from '../../../topics/types/topic.types';
import type { CycleRule } from '../../types/cycle.types';
import styles from './RulesList.module.css';

interface RulesListProps {
    topics: Topic[];
    rules: CycleRule[];
    onRemove: (id: string) => void;
}

export function RulesList({ topics, rules, onRemove }: RulesListProps) {
    if (rules.length === 0) {
        return (
            <div className={styles.empty}>
                <Text variant="caption">Nenhuma regra adicionada</Text>
            </div>
        );
    }

    const getTopicName = (topicId: string) => {
        const topic = topics.find(t => t.id === topicId);
        return topic?.name || 'Tópico não encontrado';
    };

    return (
        <div className={styles.container}>
            {rules.map(rule => (
                <div key={rule.id} className={styles.ruleItem}>
                    <div className={styles.ruleContent}>
                        <Text variant="body" className={styles.ruleText}>
                            <span className={styles.topicName}>{getTopicName(rule.topic1)}</span>
                            <span className={styles.operator}>{rule.logicalOperator}</span>
                            <span className={styles.relation}>{rule.timeRelation}</span>
                            <span className={styles.topicName}>{getTopicName(rule.topic2)}</span>
                        </Text>
                        <Button
                            variant="ghost"
                            icon={<span>x</span>}
                            onClick={() => onRemove(rule.id)}
                            className={styles.removeButton}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}