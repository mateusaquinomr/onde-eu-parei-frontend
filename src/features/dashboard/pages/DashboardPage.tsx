import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudyWidget } from '@/features/study/components/study-widget/StudyWidget';
import { studyTimerService } from '@/features/study/services/studyTimerService';
import { TasksWidget } from '@/features/tasks/components/tasks-widget/TasksWidget';
import { TimelineInfinite } from '@/features/cycle/components/TimelineInfinite/TimelineInfinite';
import { Widget } from '../components/Widget/Widget';
import { Button } from '@/shared/components/ui/Button/Button';
import { useTopics } from '@/features/topics/hooks/useTopics';
import { useCycle } from '@/features/cycle/hooks/useCycle';
import type { CycleBlock } from '@/features/cycle/types/cycle.types';
import type { Content, ChecklistItem, QuestionList } from '@/features/topics/types/topic.types';
import type { Note } from '@/features/study/types/study.types';
import styles from './DashboardPage.module.css';

const PlaceholderCard = () => {
    return (
        <div className={styles.placeholderCard}>
            <div className={styles.placeholderSkeleton} />
        </div>
    );
};

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { topics, loading: topicsLoading, updateTopic, addStudyMinutes } = useTopics();
    const { currentCycle, loading: cycleLoading, completeBlock, decrementBlockMinutes } = useCycle();

    const [activeBlockId, setActiveBlockId] = useState<string | undefined>();
    const [currentContent, setCurrentContent] = useState<{
        contentId: string;
        contentTitle: string;
        estimatedTime: number;
        initialElapsedTime: number;
        checklist?: ChecklistItem[];
        questionLists?: QuestionList[];
        notes?: Note[];
    } | null>(null);

    const isProcessingMinute = useRef(false);
    const hasTopics = topics.length > 0;
    const hasCycle = currentCycle !== null && currentCycle.blocks.length > 0;
    const isLoading = topicsLoading || cycleLoading;

    const getCurrentContentFromTopic = useCallback((topicId: string): Content | null => {
        const topic = topics.find(t => t.id === topicId);
        if (!topic) return null;
        const pendingContent = topic.contents.find(c => !c.completed);
        if (pendingContent) return pendingContent;
        return topic.contents.length > 0 ? topic.contents[topic.contents.length - 1] : null;
    }, [topics]);

    const getContentTitle = useCallback((topicId: string, blockContent?: string): string => {
        if (blockContent && blockContent !== "Clique para começar") {
            return blockContent;
        }
        const content = getCurrentContentFromTopic(topicId);
        if (!content) return "Nenhum conteúdo";
        if (content.completed) return "✓ Concluído";
        return content.title;
    }, [getCurrentContentFromTopic]);

    const cycleBlocks: CycleBlock[] = useMemo(() => {
        if (!currentCycle?.blocks) return [];

        return currentCycle.blocks.map(block => ({
            id: block.id,
            topicId: block.topicId,
            topicName: block.topicName,
            position: block.position,
            minutes: block.minutes,

            originalMinutes: block.originalMinutes ?? block.minutes,
            completed: block.completed || false,
            currentContent: block.currentContent || getContentTitle(block.topicId),
        }));
    }, [currentCycle, getContentTitle]);

    useEffect(() => {
        if (cycleBlocks.length > 0 && !activeBlockId) {
            const firstPendingBlock = cycleBlocks.find(block => !block.completed);
            setActiveBlockId(firstPendingBlock?.id || cycleBlocks[0]?.id);
        }
    }, [cycleBlocks, activeBlockId]);

    const parseNotes = (notesString?: string): Note[] => {
        if (!notesString) return [];
        try {
            return JSON.parse(notesString) as Note[];
        } catch {
            return [];
        }
    };

    useEffect(() => {
        if (!activeBlockId) {
            setCurrentContent(null);
            return;
        }

        const activeBlock = cycleBlocks.find(block => block.id === activeBlockId);
        if (!activeBlock) return;

        const content = getCurrentContentFromTopic(activeBlock.topicId);

        if (content) {
            setCurrentContent({
                contentId: content.id,
                contentTitle: content.title,
                estimatedTime: activeBlock.originalMinutes ?? activeBlock.minutes,
                initialElapsedTime: 0,
                checklist: content.checklist,
                questionLists: content.studyData?.questionLists,
                notes: parseNotes(content.studyData?.notes),
            });
        } else {
            setCurrentContent(null);
        }
    }, [activeBlockId, cycleBlocks, topics, getCurrentContentFromTopic]);

    const handleBlockSelect = (blockId: string) => {
        setActiveBlockId(blockId);
    };

    const handleUpdateChecklist = async (items: ChecklistItem[]) => {
        if (!activeBlockId || !currentContent) return;
        const activeBlock = cycleBlocks.find(block => block.id === activeBlockId);
        if (!activeBlock) return;
        const topic = topics.find(t => t.id === activeBlock.topicId);
        if (topic) {
            const updatedContents = topic.contents.map(c =>
                c.id === currentContent.contentId
                    ? { ...c, checklist: items }
                    : c
            );
            await updateTopic(topic.id, { contents: updatedContents });
            setCurrentContent(prev => prev ? { ...prev, checklist: items } : null);
        }
    };

    const handleUpdateQuestions = async (lists: QuestionList[]) => {
        if (!activeBlockId || !currentContent) return;
        const activeBlock = cycleBlocks.find(block => block.id === activeBlockId);
        if (!activeBlock) return;
        const topic = topics.find(t => t.id === activeBlock.topicId);
        if (topic) {
            const updatedContents = topic.contents.map(c =>
                c.id === currentContent.contentId
                    ? {
                        ...c,
                        studyData: {
                            ...c.studyData,
                            questionLists: lists
                        }
                    }
                    : c
            );
            await updateTopic(topic.id, { contents: updatedContents });
            setCurrentContent(prev => prev ? { ...prev, questionLists: lists } : null);
        }
    };

    const handleUpdateNotes = async (notes: Note[]) => {
        if (!activeBlockId || !currentContent) return;
        const activeBlock = cycleBlocks.find(block => block.id === activeBlockId);
        if (!activeBlock) return;
        const topic = topics.find(t => t.id === activeBlock.topicId);
        if (topic) {
            const serialized = JSON.stringify(notes);
            const updatedContents = topic.contents.map(c =>
                c.id === currentContent.contentId
                    ? {
                        ...c,
                        studyData: {
                            ...c.studyData,
                            notes: serialized
                        }
                    }
                    : c
            );
            await updateTopic(topic.id, { contents: updatedContents });
            setCurrentContent(prev => prev ? { ...prev, notes } : null);
        }
    };

    const handleTimeUpdate = async (contentId: string, elapsedSeconds: number) => {

        return;
    };

    const handleMinuteTick = async (contentId: string, minutes: number) => {
        if (!activeBlockId) return;

        if (isProcessingMinute.current) {
            console.log('Já processando um minuto, ignorando...');
            return;
        }
        isProcessingMinute.current = true;

        try {

            const minutesToProcess = minutes;
            console.log(`Processando ${minutesToProcess} minuto(s) estudado(s)`);

            await decrementBlockMinutes(activeBlockId, minutesToProcess);

            const activeBlock = cycleBlocks.find(block => block.id === activeBlockId);


            const topic = topics.find(t => t.id === activeBlock?.topicId);
            if (topic) {
                const content = topic.contents.find(c => c.id === contentId);
                if (content) {
                    const currentTime = content.studyData?.totalTimeSpent || 0;
                    const updatedContents = topic.contents.map(c =>
                        c.id === contentId
                            ? {
                                ...c,
                                studyData: {
                                    ...c.studyData,
                                    totalTimeSpent: currentTime + minutesToProcess,
                                    startedAt: c.studyData?.startedAt || new Date()
                                }
                            }
                            : c
                    );
                    await updateTopic(topic.id, { contents: updatedContents });
                    await addStudyMinutes(topic.id, minutesToProcess);
                }
            }
        } catch (error) {
            console.error('Erro no handleMinuteTick:', error);
        } finally {
            isProcessingMinute.current = false;
        }
    };

    const handleCompleteWithConfirmation = async (contentId: string, totalSeconds: number, contentCompleted: boolean) => {
        if (!activeBlockId) return;

        const activeBlock = cycleBlocks.find(block => block.id === activeBlockId);
        if (!activeBlock) return;

        const topic = topics.find(t => t.id === activeBlock.topicId);
        if (topic) {
            if (contentCompleted) {
                const roundedSeconds = Math.floor(totalSeconds);
                const updatedContents = topic.contents.map(c =>
                    c.id === contentId
                        ? {
                            ...c,
                            completed: true,
                            studyData: {
                                ...c.studyData,
                                completedAt: new Date(),
                                totalTimeSpent: roundedSeconds / 60
                            }
                        }
                        : c
                );
                await updateTopic(topic.id, { contents: updatedContents });
                studyTimerService.clearProgress(contentId);
            }

            await completeBlock(activeBlockId);

            const currentBlockIndex = cycleBlocks.findIndex(b => b.id === activeBlockId);
            const nextBlock = cycleBlocks.find((b, idx) => idx > currentBlockIndex && !b.completed);

            if (nextBlock) {
                setActiveBlockId(nextBlock.id);
            } else {
                const firstPendingBlock = cycleBlocks.find(b => !b.completed);
                if (firstPendingBlock) {
                    setActiveBlockId(firstPendingBlock.id);
                } else {
                    setActiveBlockId(undefined);
                    setCurrentContent(null);
                    alert(`Parabéns! Você completou todos os blocos do ciclo!`);
                }
            }
        }
    };

    const handleFinishContent = async (contentId: string, totalSeconds: number) => {
        if (!activeBlockId) return;

        const activeBlock = cycleBlocks.find(block => block.id === activeBlockId);
        if (!activeBlock) return;

        const topic = topics.find(t => t.id === activeBlock.topicId);
        if (!topic) return;

        const roundedSeconds = Math.floor(totalSeconds);
        const updatedContents = topic.contents.map(c =>
            c.id === contentId
                ? {
                    ...c,
                    completed: true,
                    studyData: {
                        ...c.studyData,
                        completedAt: new Date(),
                        totalTimeSpent: roundedSeconds / 60
                    }
                }
                : c
        );
        await updateTopic(topic.id, { contents: updatedContents });
        studyTimerService.clearProgress(contentId);
    };

    const handleContinue = async (contentId: string) => {
        console.log('Continuando estudo do conteúdo:', contentId);
    };

    const activeBlock = cycleBlocks.find(block => block.id === activeBlockId);

    if (isLoading) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.centerColumnFull}>
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Carregando seu ciclo de estudos...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    if (!hasTopics && !hasCycle) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.centerColumnFull}>
                    <Widget title="Comece por aqui">
                        <div className={styles.setupSteps}>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>1</div>
                                <div className={styles.stepContent}>
                                    <h3 className={styles.stepTitle}>Adicionar tópicos</h3>
                                    <p className={styles.stepDescription}>
                                        Crie ou importe os tópicos que você quer estudar
                                    </p>
                                    <Button
                                        variant="primary"
                                        icon={<span className="material-icons">add</span>}
                                        onClick={() => navigate('/topics')}
                                    >
                                        Adicionar tópicos
                                    </Button>
                                </div>
                            </div>
                            <div className={styles.stepSeparator}>
                                <span className="material-icons">arrow_forward</span>
                            </div>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>2</div>
                                <div className={styles.stepContent}>
                                    <h3 className={styles.stepTitle}>Configurar ciclo</h3>
                                    <p className={styles.stepDescription}>
                                        Defina os blocos de estudo do seu ciclo
                                    </p>
                                    <Button
                                        variant="secondary"
                                        icon={<span className="material-icons">settings</span>}
                                        onClick={() => navigate('/cycle')}
                                        disabled={!hasTopics}
                                    >
                                        Configurar ciclo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>
            </div>
        );
    }

    if (hasTopics && !hasCycle) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.leftColumn}>
                    <Widget>
                        <TimelineInfinite
                            blocks={cycleBlocks}
                            activeBlockId={activeBlockId}
                            onBlockSelect={handleBlockSelect}
                        />
                    </Widget>
                </div>

                <div className={styles.centerColumn}>
                    <Widget title="Configurar Ciclo">
                        <div className={styles.setupCycleCard}>
                            <div className={styles.setupCycleIcon}>
                                <span className="material-icons">schedule</span>
                            </div>
                            <h3 className={styles.setupCycleTitle}>Configure seu ciclo de estudos</h3>
                            <p className={styles.setupCycleDescription}>
                                Defina os blocos de estudo para organizar melhor seu tempo
                            </p>
                            <Button
                                variant="primary"
                                icon={<span className="material-icons">settings</span>}
                                onClick={() => navigate('/cycle')}
                            >
                                Configurar ciclo agora
                            </Button>
                        </div>
                    </Widget>
                </div>

                <div className={styles.rightColumn}>
                    <Widget title="Tarefas">
                      <TasksWidget/>
                    </Widget>
                    <PlaceholderCard />
                    <PlaceholderCard />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.leftColumn}>
                <Widget>
                    <TimelineInfinite
                        blocks={cycleBlocks}
                        activeBlockId={activeBlockId}
                        onBlockSelect={handleBlockSelect}
                    />
                </Widget>
            </div>

            <div className={styles.centerColumn}>
                {activeBlock && currentContent ? (
                    <Widget title="Estude agora">
                        <StudyWidget
                            key={activeBlockId}
                            topicId={activeBlock.topicId}
                            contentId={currentContent.contentId}
                            topicName={activeBlock.topicName}
                            contentTitle={currentContent.contentTitle}
                            estimatedTime={currentContent.estimatedTime}
                            initialElapsedTime={currentContent.initialElapsedTime}
                            onTimeUpdate={handleTimeUpdate}
                            onMinuteTick={handleMinuteTick}
                            onCompleteWithConfirmation={handleCompleteWithConfirmation}
                            onFinishContent={handleFinishContent}
                            onContinue={handleContinue}
                            checklist={currentContent.checklist}
                            onUpdateChecklist={handleUpdateChecklist}
                            questionLists={currentContent.questionLists}
                            onUpdateQuestions={handleUpdateQuestions}
                            notes={currentContent.notes}
                            onUpdateNotes={handleUpdateNotes}
                        />
                    </Widget>
                ) : (
                    <Widget title="Estudo Atual">
                        <div className={styles.emptyState}>
                            <p>Selecione um bloco para começar</p>
                        </div>
                    </Widget>
                )}
            </div>

            <div className={styles.rightColumn}>
                <Widget>
                       <TasksWidget/>
                </Widget>
                <PlaceholderCard />
                <PlaceholderCard />
            </div>
        </div>
    );
};
