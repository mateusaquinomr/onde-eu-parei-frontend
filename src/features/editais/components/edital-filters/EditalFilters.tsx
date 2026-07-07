import { useEditais } from '../../hooks/useEditais';
import { useTopics } from '@/features/topics/hooks/useTopics';
import styles from './EditalFilters.module.css';

interface EditalFiltersProps {
    activeFilter: string | null;
    onFilterChange: (editalId: string | null) => void;
}

export function EditalFilters({ activeFilter, onFilterChange }: EditalFiltersProps) {
    const { editais, loading } = useEditais();
    const { topics } = useTopics();

    console.log('🔍 EditalFilters - editais:', editais);
    console.log('🔍 EditalFilters - topics:', topics);

    const getTopicCount = (editalId: string) => {
        return topics.filter(t => t.editalId === editalId).length;
    };

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (!editais || editais.length === 0) {
        return <div className={styles.empty}>Nenhum edital encontrado</div>;
    }

    return (
        <div className={styles.filters}>
            <button
                key="todos"
                className={`${styles.filterBtn} ${activeFilter === null ? styles.active : ''}`}
                onClick={() => onFilterChange(null)}
            >
                <span className="material-icons">apps</span>
                Todos
                <span className={styles.count}>{topics.length}</span>
            </button>
            {editais.map(edital => {
                const count = getTopicCount(edital.id);
                const isActive = activeFilter === edital.id;
                console.log(`🔘 ${edital.nome} - id: ${edital.id}, active: ${isActive}`);
                return (
                    <button
                        key={edital.id}
                        className={`${styles.filterBtn} ${isActive ? styles.active : ''}`}
                        onClick={() => {
                            console.log(`🖱️ Clicou em: ${edital.nome} (${edital.id})`);
                            onFilterChange(edital.id);
                        }}
                    >
                        <span className="material-icons">folder</span>
                        {edital.nome}
                        <span className={styles.count}>{count}</span>
                    </button>
                );
            })}
        </div>
    );
}