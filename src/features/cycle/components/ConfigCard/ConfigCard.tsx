import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import type { Cycle } from '../../types/cycle.types';
import styles from './ConfigCard.module.css';

interface ConfigCardProps {
    cycle: Cycle;
    onReconfigure: () => void;
}

export function ConfigCard({ cycle, onReconfigure }: ConfigCardProps) {
    const getTopicName = (topicId: string) => {

        return topicId;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <Text variant="cardTitle" className={styles.title}>
                    Preferências do Ciclo
                </Text>
                <Button
                    variant="ghost"
                    icon={<span>*</span>}
                    onClick={onReconfigure}
                    className={styles.reconfigureButton}
                    aria-label="Reconfigurar ciclo"
                />
            </div>

            <div className={styles.dates}>
                <Text variant="caption" className={styles.dateItem}>
                    Criação: {formatDate(cycle.createdAt)}
                </Text>
                <Text variant="caption" className={styles.dateItem}>
                    Atualização: {formatDate(cycle.updatedAt)}
                </Text>
            </div>

            <div className={styles.section}>
                <Text variant="label">Horários</Text>
                <div className={styles.hoursRow}>
                    <div className={styles.hourItem}>
                        <Text variant="caption">Mínimo</Text>
                        <Text variant="body" className={styles.hourValue}>
                            {cycle.config.minHoursPerTopic}h
                        </Text>
                    </div>
                    <div className={styles.hourDivider}>→</div>
                    <div className={styles.hourItem}>
                        <Text variant="caption">Máximo</Text>
                        <Text variant="body" className={styles.hourValue}>
                            {cycle.config.hoursPerTopic}h
                        </Text>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <Text variant="label">Tópicos ({cycle.config.selectedTopics.length})</Text>
                <div className={styles.topicsList}>
                    {cycle.config.selectedTopics.map((topicId, index) => (
                        <div key={topicId} className={styles.topicItem}>
                            <span className={styles.topicNumber}>{index + 1}.</span>
                            <span className={styles.topicName}>{getTopicName(topicId)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {cycle.config.rules.length > 0 && (
                <div className={styles.section}>
                    <Text variant="label">Regras</Text>
                    <div className={styles.rulesList}>
                        {cycle.config.rules.map(rule => (
                            <div key={rule.id} className={styles.ruleItem}>
                                <span className={styles.ruleText}>
                                    {rule.topic1} {rule.logicalOperator} {rule.timeRelation} {rule.topic2}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}