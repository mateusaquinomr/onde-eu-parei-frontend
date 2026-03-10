import { useState } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import { Modal } from '@/shared/components/ui/Modal/Modal';
import type { Topic } from '../../../topics/types/topic.types';
import type { CycleConfig, CycleRule } from '../../types/cycle.types';
import { TopicSelector } from '../TopicSelector/TopicSelector';
import { AddRule } from '../AddRule/AddRule';
import { RulesList } from '../RulesList/RulesList';
import styles from './CreateCycleModal.module.css';

interface CreateCycleModalProps {
    isOpen: boolean;
    onClose: () => void;
    topics: Topic[];
    config: CycleConfig;
    currentStep: number;
    onNext: () => void;
    onPrev: () => void;
    onUpdateConfig: (updates: Partial<CycleConfig>) => void;
    onAddRule: (rule: Omit<CycleRule, 'id'>) => void;
    onRemoveRule: (ruleId: string) => void;
    onSelectTopics: (topicIds: string[]) => void;
    onGenerate: () => void;
}

export function CreateCycleModal({
    isOpen,
    onClose,
    topics,
    config,
    currentStep,
    onNext,
    onPrev,
    onUpdateConfig,
    onAddRule,
    onRemoveRule,
    onSelectTopics,
    onGenerate
}: CreateCycleModalProps) {
    const [hoursPerTopic, setHoursPerTopic] = useState(config.hoursPerTopic.toString());
    const [minHoursPerTopic, setMinHoursPerTopic] = useState(config.minHoursPerTopic.toString());

    const handleGenerate = () => {
        const max = parseFloat(hoursPerTopic);
        const min = parseFloat(minHoursPerTopic);

        if (isNaN(max) || isNaN(min) || min > max) {
            alert('Valores inválidos');
            return;
        }

        onUpdateConfig({ hoursPerTopic: max, minHoursPerTopic: min });
        onGenerate();
        onClose();
    };

    const handleNext = () => {
        if (currentStep === 1) {
            onNext();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="large" title="Criar Ciclo de Estudo">
            <div className={styles.container}>

                <div className={styles.stepIndicator}>
                    <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
                        <span className={styles.stepNumber}>1</span>
                        <span className={styles.stepLabel}>Configuração Básica</span>
                    </div>
                    <div className={styles.stepLine} />
                    <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
                        <span className={styles.stepNumber}>2</span>
                        <span className={styles.stepLabel}>Regras do Ciclo</span>
                    </div>
                </div>

                {currentStep === 1 && (
                    <>

                        <div className={styles.section}>
                            <Text variant="label">Horas por tópico</Text>
                            <div className={styles.hoursRow}>
                                <div className={styles.hoursField}>
                                    <Text variant="caption">Máximo</Text>
                                    <Input
                                        type="number"
                                        value={hoursPerTopic}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoursPerTopic(e.target.value)}
                                        placeholder="Ex: 4"
                                        min="0"
                                        step="0.5"
                                    />
                                </div>
                                <div className={styles.hoursField}>
                                    <Text variant="caption">Mínimo</Text>
                                    <Input
                                        type="number"
                                        value={minHoursPerTopic}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinHoursPerTopic(e.target.value)}
                                        placeholder="Ex: 1"
                                        min="0"
                                        step="0.5"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <TopicSelector
                                topics={topics}
                                selectedTopics={config.selectedTopics}
                                onSelect={onSelectTopics}
                            />
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <>

                        <div className={styles.section}>
                            <Text variant="label">Regras de ordenação</Text>
                            <Text variant="caption" className={styles.rulesHint}>
                                Defina a ordem de estudo dos tópicos
                            </Text>

                            <div className={styles.ruleInput}>
                                <AddRule
                                    topics={topics}
                                    onAdd={onAddRule}
                                />
                            </div>

                            <RulesList
                                topics={topics}
                                rules={config.rules}
                                onRemove={onRemoveRule}
                            />
                        </div>
                    </>
                )}

                <div className={styles.actions}>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>

                    {currentStep === 1 && (
                        <Button variant="primary" onClick={handleNext}>
                            Próximo
                        </Button>
                    )}

                    {currentStep === 2 && (
                        <>
                            <Button variant="secondary" onClick={onPrev}>
                                Voltar
                            </Button>
                            <Button variant="primary" onClick={handleGenerate}>
                                Gerar Ciclo
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
}