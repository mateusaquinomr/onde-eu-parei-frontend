import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { useTopics } from '../../../topics/hooks/useTopics';
import { useCycle } from '../../hooks/useCycle';
import { CreateCycleModal } from '../../components/CreateCycleModal/CreateCycleModal';
import { ProgressCard } from '../../components/ProgressCard/ProgressCard';
import { ConfigCard } from '../../components/ConfigCard/ConfigCard';
import { CyclePanel } from '../../components/CyclePanel/CyclePanel';
import styles from './CyclePage.module.css';

export function CyclePage() {
    const { topics, loading } = useTopics();
    const {
        currentCycle,
        cycleSummary,
        config,
        isConfigModalOpen,
        updateConfig,
        addRule,
        removeRule,
        selectTopics,
        generateCycle,
        openConfigModal,
        closeConfigModal,
        currentStep,
        nextStep,
        prevStep,
        updateBlocks
    } = useCycle();

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text as="h1" variant="pageTitle">
                    Ciclo de Estudo
                </Text>
            </div>

            <div className={styles.twoColumnLayout}>
                <div className={styles.leftColumn}>
                    <ProgressCard
                        currentCycle={currentCycle}
                        summary={cycleSummary}
                    />

                    {currentCycle && (
                        <ConfigCard
                            cycle={currentCycle}
                            topics={topics}
                            onReconfigure={openConfigModal}
                        />
                    )}
                </div>

                <div className={styles.rightColumn}>
                    {currentCycle ? (
                        <CyclePanel
                            cycle={currentCycle}
                            onReconfigure={openConfigModal}
                            onSaveBlocks={updateBlocks}
                        />
                    ) : (
                        <div className={styles.emptyWidget}>
                            <div className={styles.emptyContent}>
                                <span className={`${styles.emptyIcon} material-icons`}>book</span>
                                <Text variant="body">
                                    Nenhum ciclo ativo
                                </Text>
                                <Button
                                    variant="primary"
                                    onClick={openConfigModal}
                                >
                                    Criar Primeiro Ciclo
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CreateCycleModal
                isOpen={isConfigModalOpen}
                onClose={closeConfigModal}
                topics={topics}
                config={config}
                currentStep={currentStep}
                onNext={nextStep}
                onPrev={prevStep}
                onUpdateConfig={updateConfig}
                onAddRule={addRule}
                onRemoveRule={removeRule}
                onSelectTopics={selectTopics}
                onGenerate={generateCycle}
            />
        </div>
    );
}