import type { StudyProgress } from '../types/study.types';

class StudyTimerService {
    private readonly STORAGE_KEY = 'study_progress';

    saveProgress(contentId: string, elapsedSeconds: number): void {
        try {
            const progress = this.getAllProgress();
            progress[contentId] = {
                contentId,
                elapsedSeconds,
                lastUpdated: new Date().toISOString(),
                completed: false
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error('Erro ao salvar progresso:', error);
        }
    }

    getProgress(contentId: string): StudyProgress | null {
        try {
            const all = this.getAllProgress();
            return all[contentId] || null;
        } catch {
            return null;
        }
    }

    getAllProgress(): Record<string, StudyProgress> {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch {
            return {};
        }
    }

    clearProgress(contentId: string): void {
        try {
            const all = this.getAllProgress();
            delete all[contentId];
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        } catch (error) {
            console.error('Erro ao limpar progresso:', error);
        }
    }

    markAsCompleted(contentId: string): void {
        try {
            const progress = this.getAllProgress();
            if (progress[contentId]) {
                progress[contentId].completed = true;
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
            }
        } catch (error) {
            console.error('Erro ao marcar como completo:', error);
        }
    }
}

export const studyTimerService = new StudyTimerService();