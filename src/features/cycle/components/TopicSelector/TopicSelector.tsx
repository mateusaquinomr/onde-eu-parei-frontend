import { useState, useRef, useEffect } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import type { Topic } from '../../../topics/types/topic.types';
import styles from './TopicSelector.module.css';

interface TopicSelectorProps {
    topics: Topic[];
    selectedTopics: string[];
    onSelect: (topicIds: string[]) => void;
}

export function TopicSelector({ topics, selectedTopics, onSelect }: TopicSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const allTopicIds = topics.map(t => t.id);
    const isAllSelected = selectedTopics.length === allTopicIds.length && allTopicIds.length > 0;
    const isNothingSelected = selectedTopics.length === 0;

    const toggleTopic = (topicId: string) => {
        if (topicId === 'todos') {

            if (isAllSelected) {
                onSelect([]);
            } else {
                onSelect(allTopicIds);
            }
            return;
        }

        let newSelection: string[];
        if (selectedTopics.includes(topicId)) {
            newSelection = selectedTopics.filter(id => id !== topicId);
        } else {
            newSelection = [...selectedTopics, topicId];
        }

        onSelect(newSelection);
        setIsOpen(false);
    };

    const filteredTopics = topics.filter(topic =>
        topic.name.toLowerCase().includes(search.toLowerCase())
    );

    const getDisplayText = () => {
        if (isAllSelected) return 'Todos os tópicos';
        if (isNothingSelected) return 'Nenhum tópico selecionado';
        if (selectedTopics.length === 1) {
            const topic = topics.find(t => t.id === selectedTopics[0]);
            return topic?.name || '1 tópico selecionado';
        }
        return `${selectedTopics.length} tópicos selecionados`;
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <Text variant="label">Tópicos para estudar</Text>

            <div
                className={`${styles.dropdownButton} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={styles.selectedText}>{getDisplayText()}</span>
                <span className={styles.arrow}>
                    <span className="material-icons" style={{ fontSize: '16px' }}>
                        {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                </span>
            </div>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Buscar tópico..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <div className={styles.optionsList}>
                        <label className={styles.option}>
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={() => toggleTopic('todos')}
                            />
                            <span className={styles.optionLabel}>Todos os tópicos</span>
                        </label>

                        {filteredTopics.map(topic => (
                            <label key={topic.id} className={styles.option}>
                                <input
                                    type="checkbox"
                                    checked={selectedTopics.includes(topic.id)}
                                    onChange={() => toggleTopic(topic.id)}
                                />
                                <span className={styles.optionLabel}>
                                    {topic.name}
                                    <span className={styles.topicCount}>
                                        ({topic.contents.length} conteúdos)
                                    </span>
                                </span>
                            </label>
                        ))}

                        {filteredTopics.length === 0 && (
                            <div className={styles.noResults}>
                                Nenhum tópico encontrado
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Text variant="caption" className={styles.hint}>
                {isAllSelected
                    ? 'Todos os tópicos selecionados'
                    : isNothingSelected
                        ? 'Nenhum tópico selecionado'
                        : `${selectedTopics.length} tópico(s) selecionado(s)`
                }
            </Text>
        </div>
    );
}