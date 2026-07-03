import { useState } from 'react';
import { Notes } from '../notes/Notes';
import { Checklist } from '../checklist/Checklist';
import { Questions } from '../questions/Questions';
import type { ChecklistItem, QuestionList } from '../../types/study.types';
import styles from './StudyTools.module.css';

interface StudyToolsProps {
    topicId: string;
    contentId: string;
    checklist?: ChecklistItem[];
    onUpdateChecklist?: (items: ChecklistItem[]) => void;
    questionLists?: QuestionList[];
    onUpdateQuestions?: (lists: QuestionList[]) => void;
}

export function StudyTools({
    topicId,
    contentId,
    checklist,
    onUpdateChecklist,
    questionLists,
    onUpdateQuestions,
}: StudyToolsProps) {
    const [activeTab, setActiveTab] = useState<'notes' | 'todo' | 'questions'>('notes');

    return (
        <div className={styles.studyTools}>
            <div className={styles.tabsHeader}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'notes' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('notes')}
                >
                    <span className="material-icons">description</span>
                    Notes
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'todo' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('todo')}
                >
                    <span className="material-icons">checklist</span>
                    To do
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'questions' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('questions')}
                >
                    <span className="material-icons">quiz</span>
                    Questões
                </button>
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'notes' && (
                    <Notes
                        topicId={topicId}
                        contentId={contentId}
                        showHeader={false}
                    />
                )}
                {activeTab === 'todo' && (
                    <Checklist
                        topicId={topicId}
                        contentId={contentId}
                        checklist={checklist}
                        onUpdateChecklist={onUpdateChecklist}
                    />
                )}
                {activeTab === 'questions' && (
                    <Questions
                        topicId={topicId}
                        contentId={contentId}
                        questionLists={questionLists}
                        onUpdateQuestions={onUpdateQuestions}
                    />
                )}
            </div>
        </div>
    );
}