import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button/Button';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Contents } from './Step2Contents';
import type { CreateTopicDTO, Content } from '../../../types/topic.types';
import styles from './CreateTopicModal.module.css';

interface CreateTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (topicData: CreateTopicDTO) => void;
}

export function CreateTopicModal({ isOpen, onClose, onSave }: CreateTopicModalProps) {
    const [step, setStep] = useState(1);
    const [topicData, setTopicData] = useState<Partial<CreateTopicDTO>>({});

    if (!isOpen) return null;

    const handleNext = (data: any) => {
        setTopicData(prev => ({ ...prev, ...data }));
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSave = (contents: Content[]) => {
        onSave({
            name: topicData.name!,
            notebookColor: topicData.notebookColor!,
            difficulty: topicData.difficulty!,
            tags: topicData.tags!,
            contents: contents.map(({ title, importance }) => ({ title, importance }))
        });
        setStep(1);
        setTopicData({});
        onClose();
    };

    const handleClose = () => {
        setStep(1);
        setTopicData({});
        onClose();
    };

    const initialContentsForStep2: Content[] = (topicData.contents || []).map((c, index) => ({
        id: crypto.randomUUID(),
        title: c.title,
        importance: c.importance,
        completed: false,
        order: index,
        createdAt: new Date()
    }));

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Criar Novo Tópico</h2>
                    <Button variant="ghost" onClick={handleClose} icon={<span>✕</span>} />
                </div>

                <div className={styles.content}>
                    {step === 1 ? (
                        <Step1BasicInfo
                            initialData={topicData}
                            onNext={handleNext}
                            onCancel={handleClose}
                        />
                    ) : (
                        <Step2Contents
                            initialContents={initialContentsForStep2}
                            onSave={handleSave}
                            onBack={handleBack}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}