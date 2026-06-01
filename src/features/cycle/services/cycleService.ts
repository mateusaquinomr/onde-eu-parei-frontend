import api from '@/shared/services/api/api';
import type { Cycle, CycleConfig, CycleBlock, CycleSummary } from '../types/cycle.types';
import type { Topic } from '../../topics/types/topic.types';

class CycleService {
    private currentCycle: Cycle | null = null;

    async getCurrentCycle(): Promise<Cycle | null> {
        try {
            const response = await api.get('/cycles/active');
            this.currentCycle = response.data;
            return this.currentCycle;
        } catch (error) {
            console.error('Erro ao buscar ciclo ativo:', error);
            return null;
        }
    }

    async getSummary(): Promise<CycleSummary> {
        try {
            const response = await api.get('/cycles/summary');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar resumo:', error);
            return { totalCycles: 0, totalStudyMinutes: 0, currentCycle: null };
        }
    }

    async generateCycle(config: CycleConfig, topics: Topic[]): Promise<Cycle> {
        let availableTopics = topics;
        if (config.selectedTopics.length > 0) {
            availableTopics = topics.filter(t => config.selectedTopics.includes(t.id));
        }

        const blocks = this.generateBlocks(availableTopics, config);
        const totalMinutes = blocks.reduce((sum, block) => sum + block.minutes, 0);
        const cycleNumber = await this.getNextCycleNumber();

        const cycleData = {
            number: cycleNumber,
            config,
            blocks,
            totalMinutes,
            completedMinutes: 0,
            remainingMinutes: totalMinutes,
            createdAt: new Date(),
            updatedAt: new Date(),
            startedAt: new Date(),
            isActive: true
        };

        const response = await api.post('/cycles', cycleData);
        this.currentCycle = response.data;
        return this.currentCycle as Cycle;
    }

    async completeBlock(cycleId: string, blockId: string, topics: Topic[]): Promise<Cycle | null> {
        if (!cycleId || cycleId === 'undefined') {
            console.error('completeBlock: cycleId inválido:', cycleId);
            return null;
        }

        try {
            console.log(`Completando bloco ${blockId} no ciclo ${cycleId}`);

            const response = await api.put(`/cycles/${cycleId}/blocks/${blockId}/complete`);
            let updatedCycle = response.data;
            if (!updatedCycle) return null;

            const completedBlock = updatedCycle.blocks.find((b: CycleBlock) => b.id === blockId);

            if (completedBlock) {
                const topic = topics.find(t => t.id === completedBlock.topicId);
                if (topic) {
                    const currentContent = topic.contents.find(c => c.title === completedBlock.currentContent);
                    if (currentContent && !currentContent.completed) {
                        try {
                            await api.put(`/topics/${topic.id}/contents/${currentContent.id}/complete`);
                        } catch (err) {
                            console.error('Erro ao marcar conteúdo como concluído:', err);
                        }
                    }

                    const nextContent = topic.contents.find(c => !c.completed);
                    if (nextContent && updatedCycle.blocks.some((b: CycleBlock) => b.id === blockId)) {
                        const updatedBlocks = updatedCycle.blocks.map((b: CycleBlock) =>
                            b.id === blockId ? { ...b, currentContent: nextContent.title } : b
                        );
                        try {
                            const updateResponse = await api.put(`/cycles/${cycleId}`, { blocks: updatedBlocks });
                            updatedCycle = updateResponse.data;
                        } catch (err) {
                            console.error('Erro ao atualizar bloco:', err);
                        }
                    }
                }
            }

            this.currentCycle = updatedCycle;
            if (updatedCycle.blocks.every((b: CycleBlock) => b.completed)) {
                this.currentCycle = null;
            }
            return updatedCycle;
        } catch (error) {
            console.error('Erro ao completar bloco:', error);
            return null;
        }
    }

    async decrementBlockMinutes(cycleId: string, blockId: string, minutesToDecrement: number): Promise<Cycle | null> {
        if (!cycleId || cycleId === 'undefined') {
            console.error('x decrementBlockMinutes: cycleId inválido:', cycleId);
            return null;
        }

        const decrement = Math.min(minutesToDecrement, 1);

        try {
            console.log(`Decrementando ${decrement} min do bloco ${blockId} no ciclo ${cycleId}`);

            const response = await api.put(`/cycles/${cycleId}/blocks/${blockId}/decrement`, {
                minutesToDecrement: decrement
            });
            this.currentCycle = response.data;
            return this.currentCycle;
        } catch (error) {
            console.error('Erro ao decrementar minutos:', error);
            return null;
        }
    }

    async syncWithTopics(cycleId: string, topics: Topic[]): Promise<Cycle | null> {
        if (!cycleId || cycleId === 'undefined') {
            console.error('x syncWithTopics: cycleId inválido:', cycleId);
            return null;
        }

        try {
            const response = await api.get(`/cycles/${cycleId}`);
            const cycle = response.data;
            if (!cycle) return null;

            let hasChanges = false;
            for (const block of cycle.blocks) {
                const topic = topics.find(t => t.id === block.topicId);
                if (topic) {
                    const newCurrentContent = this.getCurrentContent(topic);
                    if (newCurrentContent && block.currentContent !== newCurrentContent.title) {
                        block.currentContent = newCurrentContent.title;
                        hasChanges = true;
                    }
                }
            }

            if (hasChanges) {
                const updateResponse = await api.put(`/cycles/${cycleId}`, { blocks: cycle.blocks });
                this.currentCycle = updateResponse.data;
                return this.currentCycle;
            }

            this.currentCycle = cycle;
            return cycle;
        } catch (error) {
            console.error('Erro ao sincronizar com tópicos:', error);
            return null;
        }
    }

    resetCycle(): void {
        this.currentCycle = null;
    }

    private roundToMultipleOf5(minutes: number): number {
        return Math.round(minutes / 5) * 5;
    }

    private readonly difficultyWeight = {
        facil: 0,
        medio: 0.5,
        dificil: 1
    };

    private generateBlocks(topics: Topic[], config: CycleConfig): CycleBlock[] {
        const blocks: CycleBlock[] = [];
        if (topics.length === 0) return blocks;

        const minTime = config.minMinutesPerTopic;
        const maxTime = config.minutesPerTopic;
        const range = maxTime - minTime;

        topics.forEach((topic) => {
            const weight = this.difficultyWeight[topic.difficulty] || 0.5;
            let topicTotalMinutes = minTime + (range * weight);
            topicTotalMinutes = this.roundToMultipleOf5(topicTotalMinutes);
            topicTotalMinutes = Math.min(topicTotalMinutes, maxTime);
            topicTotalMinutes = Math.max(topicTotalMinutes, minTime);

            const currentContent = this.getCurrentContent(topic);
            const contentTitle = currentContent?.title || "Estudo do tópico";

            blocks.push({
                id: crypto.randomUUID(),
                topicId: topic.id,
                topicName: topic.name,
                position: blocks.length,
                minutes: topicTotalMinutes,
                originalMinutes: topicTotalMinutes,
                completed: false,
                currentContent: contentTitle
            });
        });
        return blocks;
    }

    private getCurrentContent(topic: Topic): { title: string } | null {
        const pendingContents = topic.contents
            .filter(c => !c.completed)
            .sort((a, b) => a.order - b.order);
        if (pendingContents.length > 0) {
            return { title: pendingContents[0].title };
        }
        if (topic.contents.length > 0) {
            const lastContent = topic.contents.sort((a, b) => a.order - b.order)[topic.contents.length - 1];
            return { title: lastContent.title };
        }
        return null;
    }

    private async getNextCycleNumber(): Promise<number> {
        try {
            const response = await api.get('/cycles');
            const cycles = response.data;
            return cycles.length + 1;
        } catch {
            return 1;
        }
    }
}

export const cycleService = new CycleService();