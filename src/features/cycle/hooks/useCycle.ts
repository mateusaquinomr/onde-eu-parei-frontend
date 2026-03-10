import { useState, useCallback } from 'react';
import type { Cycle, CycleConfig, CycleRule, CycleSummary } from '../types/cycle.types';
import { cycleService } from '../services/cycleService';
import { useTopics } from '../../topics/hooks/useTopics';

export function useCycle() {
    const { topics } = useTopics();
    const [currentCycle, setCurrentCycle] = useState<Cycle | null>(() => cycleService.getCurrentCycle());
    const [cycleSummary, setCycleSummary] = useState<CycleSummary>(() => cycleService.getSummary());
    const [config, setConfig] = useState<CycleConfig>({
        hoursPerTopic: 4,
        minHoursPerTopic: 1,
        selectedTopics: [],
        rules: []
    });
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(!currentCycle);
    const [currentStep, setCurrentStep] = useState(1);

    const updateConfig = useCallback((updates: Partial<CycleConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    }, []);

    const addRule = useCallback((rule: Omit<CycleRule, 'id'>) => {
        const newRule: CycleRule = {
            ...rule,
            id: crypto.randomUUID()
        };
        setConfig(prev => ({
            ...prev,
            rules: [...prev.rules, newRule]
        }));
    }, []);

    const removeRule = useCallback((ruleId: string) => {
        setConfig(prev => ({
            ...prev,
            rules: prev.rules.filter(r => r.id !== ruleId)
        }));
    }, []);

    const selectTopics = useCallback((topicIds: string[]) => {
        setConfig(prev => ({
            ...prev,
            selectedTopics: topicIds
        }));
    }, []);

    const generateCycle = useCallback(() => {
        const cycle = cycleService.generateCycle(config, topics);
        setCurrentCycle(cycle);
        setCycleSummary(cycleService.getSummary());
        setIsConfigModalOpen(false);
        setCurrentStep(1);
        return cycle;
    }, [config, topics]);

    const nextStep = useCallback(() => {
        setCurrentStep(prev => prev + 1);
    }, []);

    const prevStep = useCallback(() => {
        setCurrentStep(prev => prev - 1);
    }, []);

    const openConfigModal = useCallback(() => {
        setIsConfigModalOpen(true);
        setCurrentStep(1);
    }, []);

    const closeConfigModal = useCallback(() => {
        setIsConfigModalOpen(false);
        setCurrentStep(1);
    }, []);

    return {
        currentCycle,
        cycleSummary,
        config,
        isConfigModalOpen,
        currentStep,
        updateConfig,
        addRule,
        removeRule,
        selectTopics,
        generateCycle,
        nextStep,
        prevStep,
        openConfigModal,
        closeConfigModal
    };
}