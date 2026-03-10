import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button/Button';
import { Select } from '@/shared/components/ui/Form/Select';
import type { Topic } from '../../../topics/types/topic.types';
import type { CycleRule, LogicalOperator, TimeRelation } from '../../types/cycle.types';
import styles from './AddRule.module.css';

const logicalOperatorOptions = [
    { label: 'deve', value: 'deve' },
    { label: 'não deve', value: 'não deve' }
];

const timeRelationOptions = [
    { label: 'antes', value: 'antes' },
    { label: 'depois', value: 'depois' },
    { label: 'entre', value: 'entre' }
];

interface AddRuleProps {
    topics: Topic[];
    onAdd: (rule: Omit<CycleRule, 'id'>) => void;
}

export function AddRule({ topics, onAdd }: AddRuleProps) {
    const [topic1, setTopic1] = useState('');
    const [logicalOperator, setLogicalOperator] = useState<LogicalOperator>('deve');
    const [timeRelation, setTimeRelation] = useState<TimeRelation>('antes');
    const [topic2, setTopic2] = useState('');

    const topicOptions = [
        { label: 'Selecione um tópico', value: '' },
        ...topics.map(t => ({ label: t.name, value: t.id }))
    ];

    const handleAdd = () => {
        if (!topic1 || !topic2) return;

        onAdd({
            topic1,
            logicalOperator,
            timeRelation,
            topic2
        });

        setTopic1('');
        setLogicalOperator('deve');
        setTimeRelation('antes');
        setTopic2('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <Select
                        value={topic1}
                        onChange={(val) => setTopic1(val)}
                        options={topicOptions}
                    />
                </div>

                <div className={styles.operator}>
                    <Select
                        value={logicalOperator}
                        onChange={(val) => setLogicalOperator(val as LogicalOperator)}
                        options={logicalOperatorOptions}
                    />
                </div>

                <div className={styles.relation}>
                    <Select
                        value={timeRelation}
                        onChange={(val) => setTimeRelation(val as TimeRelation)}
                        options={timeRelationOptions}
                    />
                </div>

                <div className={styles.field}>
                    <Select
                        value={topic2}
                        onChange={(val) => setTopic2(val)}
                        options={topicOptions}
                    />
                </div>

                <Button
                    variant="primary"
                    onClick={handleAdd}
                    disabled={!topic1 || !topic2}
                >
                    Add
                </Button>
            </div>
        </div>
    );
}