import type { Topic, CreateTopicDTO } from '../types/topic.types';

let MOCK_TOPICS: Topic[] = [
    {
        id: '1',
        name: 'Direito Constitucional',
        notebookColor: 'azul',
        difficulty: 'medio',
        tags: [
            { id: '1', label: 'direito' },
            { id: '2', label: 'constituição' }
        ],
        contents: [
            {
                id: '1',
                title: 'Art. 1º ao 4º - Princípios Fundamentais',
                importance: 'muita',
                completed: false,
                order: 0,
                createdAt: new Date()
            },
            {
                id: '2',
                title: 'Art. 5º - Direitos e Garantias',
                importance: 'muita',
                completed: true,
                order: 1,
                createdAt: new Date()
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessed: new Date(),
        totalHours: 12.5
    },
    {
        id: '2',
        name: 'Direito Administrativo',
        notebookColor: 'vermelho',
        difficulty: 'dificil',
        tags: [
            { id: '3', label: 'administrativo' },
            { id: '4', label: 'servidores' }
        ],
        contents: [
            {
                id: '3',
                title: 'Princípios da Administração',
                importance: 'normal',
                completed: false,
                order: 0,
                createdAt: new Date()
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessed: new Date(),
        totalHours: 8.0
    }
];

export const topicsService = {
    async getAll(): Promise<Topic[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return JSON.parse(JSON.stringify(MOCK_TOPICS));
    },

    async getById(id: string): Promise<Topic | undefined> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const topic = MOCK_TOPICS.find(t => t.id === id);
        return topic ? JSON.parse(JSON.stringify(topic)) : undefined;
    },

    async create(data: CreateTopicDTO): Promise<Topic> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const now = new Date();
        const newTopic: Topic = {
            id: crypto.randomUUID(),
            ...data,
            contents: data.contents.map((c, index) => ({
                id: crypto.randomUUID(),
                ...c,
                completed: false,
                order: index,
                createdAt: now
            })),
            createdAt: now,
            updatedAt: now,
            lastAccessed: now,
            totalHours: 0
        };
        MOCK_TOPICS.push(newTopic);
        return JSON.parse(JSON.stringify(newTopic));
    },

    async update(id: string, data: Partial<CreateTopicDTO>): Promise<Topic> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const index = MOCK_TOPICS.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Tópico não encontrado');

        const existingTopic = MOCK_TOPICS[index];

        const updatedTopic: Topic = {
            ...existingTopic,
            ...data,

            contents: data.contents
                ? data.contents.map((newContent, idx) => {

                    const existingContent = existingTopic.contents.find(ec => ec.title === newContent.title);
                    return {
                        id: existingContent?.id || crypto.randomUUID(),
                        title: newContent.title,
                        importance: newContent.importance,
                        completed: existingContent?.completed || false,
                        order: idx,
                        createdAt: existingContent?.createdAt || new Date()
                    };
                })
                : existingTopic.contents,
            updatedAt: new Date()
        };

        MOCK_TOPICS[index] = updatedTopic;
        console.log('Service - Tópico atualizado:', JSON.parse(JSON.stringify(updatedTopic)));
        return JSON.parse(JSON.stringify(updatedTopic));
    },

    async delete(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        MOCK_TOPICS = MOCK_TOPICS.filter(t => t.id !== id);
    },


    async updateLastAccessed(id: string): Promise<Topic> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = MOCK_TOPICS.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Tópico não encontrado');

        const updatedTopic = {
            ...MOCK_TOPICS[index],
            lastAccessed: new Date(),
            updatedAt: new Date()
        };

        MOCK_TOPICS[index] = updatedTopic;
        console.log(' Service - Último acesso atualizado:', updatedTopic.lastAccessed);
        return JSON.parse(JSON.stringify(updatedTopic));
    },

    async addStudyHours(id: string, hours: number): Promise<Topic> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = MOCK_TOPICS.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Tópico não encontrado');

        const currentHours = MOCK_TOPICS[index].totalHours || 0;
        const updatedTopic = {
            ...MOCK_TOPICS[index],
            totalHours: Number((currentHours + hours).toFixed(1)),
            lastAccessed: new Date(),
            updatedAt: new Date()
        };

        MOCK_TOPICS[index] = updatedTopic;
        console.log(' Service - Horas adicionadas:', { horasAdicionadas: hours, totalHoras: updatedTopic.totalHours });
        return JSON.parse(JSON.stringify(updatedTopic));
    },

    async registerStudySession(id: string, hoursStudied: number): Promise<Topic> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = MOCK_TOPICS.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Tópico não encontrado');

        const currentHours = MOCK_TOPICS[index].totalHours || 0;
        const now = new Date();

        const updatedTopic = {
            ...MOCK_TOPICS[index],
            totalHours: Number((currentHours + hoursStudied).toFixed(1)),
            lastAccessed: now,
            updatedAt: now
        };

        MOCK_TOPICS[index] = updatedTopic;
        console.log(' Service - Sessão de estudo registrada:', {
            horasEstudadas: hoursStudied,
            totalHoras: updatedTopic.totalHours,
            ultimoAcesso: updatedTopic.lastAccessed
        });
        return JSON.parse(JSON.stringify(updatedTopic));
    }
};