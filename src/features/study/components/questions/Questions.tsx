import { useState } from 'react';
import type { QuestionList } from '../../types/study.types';
import styles from './Questions.module.css';

interface QuestionsProps {
    topicId: string;
    contentId: string;
    questionLists?: QuestionList[];
    onUpdateQuestions?: (lists: QuestionList[]) => void;
}

export function Questions({
    questionLists = [],
    onUpdateQuestions
}: QuestionsProps) {
    const [editingQuestionListId, setEditingQuestionListId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [editingTotalId, setEditingTotalId] = useState<string | null>(null);
    const [editingHitsId, setEditingHitsId] = useState<string | null>(null);

    const addQuestionList = () => {
        const newList: QuestionList = {
            id: crypto.randomUUID(),
            title: `Lista de exercícios ${questionLists.length + 1}`,
            total: 0,
            hits: 0
        };
        onUpdateQuestions?.([...questionLists, newList]);
        setEditingQuestionListId(newList.id);
        setEditingTitle(newList.title);
    };

    const updateQuestionListTitle = (listId: string, newTitle: string) => {
        const updated = questionLists.map(list =>
            list.id === listId ? { ...list, title: newTitle } : list
        );
        onUpdateQuestions?.(updated);
        setEditingQuestionListId(null);
        setEditingTitle('');
    };

    const updateQuestionListTotal = (listId: string, total: number) => {
        const updated = questionLists.map(list =>
            list.id === listId ? { ...list, total: Math.max(0, total) } : list
        );
        onUpdateQuestions?.(updated);
        setEditingTotalId(null);
    };

    const updateQuestionListHits = (listId: string, hits: number) => {
        const updated = questionLists.map(list => {
            const newHits = Math.min(list.total, Math.max(0, hits));
            return list.id === listId ? { ...list, hits: newHits } : list;
        });
        onUpdateQuestions?.(updated);
        setEditingHitsId(null);
    };

    const deleteQuestionList = (listId: string) => {
        const updated = questionLists.filter(list => list.id !== listId);
        onUpdateQuestions?.(updated);
    };

    return (
        <div className={styles.questionsSection}>
            <div className={styles.questionsHeader}>
                <button className={styles.addQuestionsBtn} onClick={addQuestionList}>
                    <span className="material-icons">add</span>
                    Adicionar Lista de questões
                </button>
            </div>

            <div className={styles.questionsLists}>
                {questionLists.length === 0 ? (
                    <div className={styles.emptyQuestions}>
                        <span className="material-icons">quiz</span>
                        <span>Nenhum item adicionado</span>
                    </div>
                ) : (
                    questionLists.map((list) => {
                        const hitsPercent = list.total > 0 ? (list.hits / list.total) * 100 : 0;
                        const errorsPercent = list.total > 0 ? ((list.total - list.hits) / list.total) * 100 : 0;
                        const errors = list.total - list.hits;

                        return (
                            <div key={list.id} className={styles.questionCard}>
                                <div className={styles.questionCardHeader}>
                                    {editingQuestionListId === list.id ? (
                                        <input
                                            type="text"
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            onBlur={() => updateQuestionListTitle(list.id, editingTitle)}
                                            onKeyDown={(e) => e.key === 'Enter' && updateQuestionListTitle(list.id, editingTitle)}
                                            autoFocus
                                            className={styles.questionTitleInput}
                                        />
                                    ) : (
                                        <span
                                            className={styles.questionTitle}
                                            onClick={() => {
                                                setEditingQuestionListId(list.id);
                                                setEditingTitle(list.title);
                                            }}
                                        >
                                            {list.title}
                                        </span>
                                    )}
                                    <button
                                        className={styles.deleteQuestionList}
                                        onClick={() => deleteQuestionList(list.id)}
                                    >
                                        <span className="material-icons">delete_outline</span>
                                    </button>
                                </div>

                                <div className={styles.questionStats}>
                                    <div className={styles.questionTotal}>
                                        {editingTotalId === list.id ? (
                                            <input
                                                type="number"
                                                value={list.total}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || 0;
                                                    updateQuestionListTotal(list.id, value);
                                                }}
                                                onBlur={() => setEditingTotalId(null)}
                                                onKeyDown={(e) => e.key === 'Enter' && setEditingTotalId(null)}
                                                autoFocus
                                                className={styles.questionNumberInput}
                                            />
                                        ) : (
                                            <span
                                                className={styles.questionNumber}
                                                onClick={() => setEditingTotalId(list.id)}
                                            >
                                                {list.total}
                                            </span>
                                        )}
                                        <span className={styles.questionLabel}>questões</span>
                                    </div>

                                    <div className={styles.progressBarContainer}>
                                        {list.total > 0 && (list.hits > 0 || errors > 0) ? (
                                            <>
                                                {list.hits > 0 && (
                                                    <div
                                                        className={styles.progressBarFillHits}
                                                        style={{ width: `${hitsPercent}%` }}
                                                    />
                                                )}
                                                {errors > 0 && (
                                                    <div
                                                        className={styles.progressBarFillErrors}
                                                        style={{ width: `${errorsPercent}%` }}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <div className={styles.progressBarEmpty} style={{ width: '100%' }} />
                                        )}
                                    </div>

                                    <div className={styles.questionResults}>
                                        <div className={styles.hitsRow}>
                                            <span className={styles.hitsLabel}>Acertos:</span>
                                            {editingHitsId === list.id ? (
                                                <input
                                                    type="number"
                                                    value={list.hits}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value) || 0;
                                                        updateQuestionListHits(list.id, value);
                                                    }}
                                                    onBlur={() => setEditingHitsId(null)}
                                                    onKeyDown={(e) => e.key === 'Enter' && setEditingHitsId(null)}
                                                    autoFocus
                                                    className={styles.hitsInput}
                                                />
                                            ) : (
                                                <span
                                                    className={styles.hitsValue}
                                                    onClick={() => setEditingHitsId(list.id)}
                                                >
                                                    {list.hits}
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.errorsRow}>
                                            <span className={styles.errorsLabel}>Erros:</span>
                                            <span className={styles.errorsValue}>{errors}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}