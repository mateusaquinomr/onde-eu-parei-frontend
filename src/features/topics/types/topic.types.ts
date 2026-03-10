export type NotebookColor = 'azul' | 'amarelo' | 'vermelho' | 'verde' | 'rosa' | 'preto';
export type DifficultyLevel = 'facil' | 'medio' | 'dificil';
export type ImportanceLevel = 'pouco' | 'normal' | 'muita';

export interface Tag {
    id: string;
    label: string;
    color?: string;
}

export interface Content {
    id: string;
    title: string;
    importance: ImportanceLevel;
    completed: boolean;
    order: number;
    createdAt: Date;
}

export interface Topic {
    id: string;
    name: string;
    notebookColor: NotebookColor;
    difficulty: DifficultyLevel;
    tags: Tag[];
    contents: Content[];
    createdAt: Date;
    updatedAt: Date;
    progress?: number;
    lastAccessed?: Date;
    totalHours?: number;
}

export interface CreateTopicDTO {
    name: string;
    notebookColor: NotebookColor;
    difficulty: DifficultyLevel;
    tags: Tag[];
    contents: Omit<Content, 'id' | 'completed' | 'createdAt' | 'order'>[];
}

export interface UpdateTopicDTO extends Partial<CreateTopicDTO> {
    id: string;
}