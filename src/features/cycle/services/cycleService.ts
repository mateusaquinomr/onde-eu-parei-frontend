import type { Cycle, CycleConfig, CycleRule, CycleBlock, CycleSummary } from '../types/cycle.types';
import type { Topic } from '../../topics/types/topic.types';

class CycleService {
    private cycles: Cycle[] = [];
    private currentCycle: Cycle | null = null;

    getCurrentCycle(): Cycle | null {
        return this.currentCycle;
    }

    getSummary(): CycleSummary {
        const totalCycles = this.cycles.length;
        const totalStudyHours = this.cycles.reduce((sum, cycle) => sum + cycle.completedHours, 0);

        return {
            totalCycles,
            totalStudyHours,
            currentCycle: this.currentCycle
        };
    }

    generateCycle(config: CycleConfig, topics: Topic[]): Cycle {

        let availableTopics = topics;
        if (config.selectedTopics.length > 0) {
            availableTopics = topics.filter(t => config.selectedTopics.includes(t.id));
        }

        const blocks = this.generateBlocks(availableTopics, config);
        const totalHours = blocks.reduce((sum, block) => sum + block.hours, 0);

        const cycleNumber = this.cycles.length + 1;

        const cycle: Cycle = {
            id: crypto.randomUUID(),
            number: cycleNumber,
            config,
            blocks,
            totalHours,
            completedHours: 0,
            remainingHours: totalHours,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
        };

        this.cycles.push(cycle);
        this.currentCycle = cycle;

        return cycle;
    }

    private generateBlocks(topics: Topic[], config: CycleConfig): CycleBlock[] {
        const blocks: CycleBlock[] = [];

        topics.forEach((topic, index) => {
            const hoursPerTopic = config.hoursPerTopic / topics.length;

            for (let i = 0; i < 3; i++) {
                blocks.push({
                    id: crypto.randomUUID(),
                    topicId: topic.id,
                    topicName: topic.name,
                    position: blocks.length,
                    hours: Number((hoursPerTopic / 3).toFixed(1)),
                    completed: false
                });
            }
        });

        return this.shuffleBlocks(blocks);
    }

    private shuffleBlocks(blocks: CycleBlock[]): CycleBlock[] {
        return blocks.sort(() => Math.random() - 0.5);
    }

    completeBlock(cycleId: string, blockId: string): Cycle | null {
        const cycle = this.cycles.find(c => c.id === cycleId);
        if (!cycle) return null;

        const block = cycle.blocks.find(b => b.id === blockId);
        if (!block || block.completed) return cycle;

        block.completed = true;
        block.completedAt = new Date();

        cycle.completedHours += block.hours;
        cycle.remainingHours -= block.hours;
        cycle.updatedAt = new Date();

        const allCompleted = cycle.blocks.every(b => b.completed);
        if (allCompleted) {
            cycle.completedAt = new Date();
            cycle.isActive = false;
            this.currentCycle = null;
        }

        return cycle;
    }

    resetCycle(): void {
        this.currentCycle = null;
    }
}

export const cycleService = new CycleService();