import { useState } from 'react';
import { FormField } from '@/shared/components/ui/Form/FormField';
import { Input } from '@/shared/components/ui/Form/Input';
import { Select } from '@/shared/components/ui/Form/Select';
import { TagInput } from '@/shared/components/ui/Form/TagInput/TagInput';
import { Button } from '@/shared/components/ui/Button/Button';
import { useEditais } from '@/features/editais/hooks/useEditais';
import type { NotebookColor, DifficultyLevel, Tag } from '../../types/topic.types';
import styles from './CreateTopicModal.module.css';

interface Step1BasicInfoProps {
    initialData?: Partial<{
        name: string;
        notebookColor: NotebookColor;
        difficulty: DifficultyLevel;
        editalId?: string;
        tags: Tag[];
    }>;
    onNext: (data: any) => void;
    onCancel: () => void;
}

const notebookOptions = [
    { label: 'Azul', value: 'azul' },
    { label: 'Amarelo', value: 'amarelo' },
    { label: 'Vermelho', value: 'vermelho' },
    { label: 'Verde', value: 'verde' },
    { label: 'Rosa', value: 'rosa' },
    { label: 'Preto', value: 'preto' }
];

const difficultyOptions = [
    { label: 'Fácil', value: 'facil' },
    { label: 'Médio', value: 'medio' },
    { label: 'Difícil', value: 'dificil' }
];

export function Step1BasicInfo({ initialData, onNext, onCancel }: Step1BasicInfoProps) {
    const { editais, loading: editaisLoading } = useEditais();
    const [name, setName] = useState(initialData?.name || '');
    const [notebookColor, setNotebookColor] = useState<NotebookColor>(
        initialData?.notebookColor || 'azul'
    );
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(
        initialData?.difficulty || 'medio'
    );
    const [editalId, setEditalId] = useState<string | undefined>(initialData?.editalId);
    const [tags, setTags] = useState<Tag[]>(initialData?.tags || []);

    const editalOptions = [
        { label: 'Nenhum', value: '' },
        ...editais.map(e => ({ label: e.nome, value: e.id }))
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({ name, notebookColor, difficulty, editalId: editalId || undefined, tags });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <FormField label="Nome do tópico" required>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Direito Constitucional"
                    autoFocus
                />
            </FormField>

            <div className={styles.row}>
                <div className={styles.flex1}>
                    <FormField label="Caderno" required>
                        <Select
                            value={notebookColor}
                            onChange={(value) => setNotebookColor(value as NotebookColor)}
                            options={notebookOptions}
                        />
                    </FormField>
                </div>

                <div className={styles.flex1}>
                    <FormField label="Dificuldade" required>
                        <Select
                            value={difficulty}
                            onChange={(value) => setDifficulty(value as DifficultyLevel)}
                            options={difficultyOptions}
                        />
                    </FormField>
                </div>
            </div>

            <FormField label="Edital" helperText="Selecione o edital ao qual este tópico pertence">
                <Select
                    value={editalId || ''}
                    onChange={(value) => setEditalId(value || undefined)}
                    options={editalOptions}
                />
            </FormField>

            <FormField
                label="Tags"
                helperText="Digite uma tag e pressione Enter"
            >
                <TagInput
                    value={tags}
                    onChange={setTags}
                    maxTags={10}
                    placeholder="Ex: direito, constituição, artigos..."
                />
            </FormField>

            <div className={styles.footer}>
                <Button variant="ghost" type="button" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!name.trim()}
                >
                    Continuar
                </Button>
            </div>
        </form>
    );
}