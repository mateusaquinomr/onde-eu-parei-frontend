import type { Topic, Content } from '../types/topic.types';

const createMockContent = (
    id: string,
    title: string,
    importance: 'pouco' | 'normal' | 'muita',
    order: number,
    notes?: string
): Content => ({
    id,
    title,
    importance,
    completed: false,
    order,
    createdAt: new Date(),
    checklist: [],
    studyData: {
        totalTimeSpent: 0,
        notes: notes || '',
        startedAt: null,
        completedAt: null,
        lastReviewDate: null,
        nextReviewDate: null,
        reviewHistory: []
    }
});

export const mockTopics: Topic[] = [
    {
        id: 'topic-1',
        name: 'Direito Constitucional',
        notebookColor: 'azul',
        difficulty: 'medio',
        tags: [],
        contents: [
            createMockContent(
                'content-1',
                'Art. 1º ao 4º - Princípios Fundamentais',
                'muita',
                0,
                '<strong>Princípios fundamentais</strong><br>Soberania popular<br>Cidadania<br>Dignidade da pessoa humana'
            ),
            createMockContent(
                'content-2',
                'Art. 5º - Direitos e Garantias Fundamentais',
                'muita',
                1,
                ''
            ),
            createMockContent(
                'content-3',
                'Art. 6º ao 11º - Direitos Sociais',
                'normal',
                2,
                ''
            )
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessed: new Date(),
        totalMinutes: 0  // 
    },
    {
        id: 'topic-2',
        name: 'Direito Administrativo',
        notebookColor: 'verde',
        difficulty: 'dificil',
        tags: [],
        contents: [
            createMockContent(
                'content-4',
                'Princípios da Administração Pública',
                'normal',
                0,
                '<strong>LIMPE</strong><br>Legalidade<br>Impessoalidade<br>Moralidade<br>Publicidade<br>Eficiência'
            ),
            createMockContent(
                'content-5',
                'Poderes Administrativos',
                'muita',
                1,
                ''
            )
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessed: new Date(),
        totalMinutes: 0
    },
    {
        id: 'topic-3',
        name: 'Direitos Humanos',
        notebookColor: 'vermelho',
        difficulty: 'facil',
        tags: [],
        contents: [
            createMockContent(
                'content-6',
                'Evolução Histórica dos Direitos Humanos',
                'normal',
                0,
                ''
            )
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessed: new Date(),
        totalMinutes: 0
    }
];