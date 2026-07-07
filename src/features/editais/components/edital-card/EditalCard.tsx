import type { Edital } from '../../types/edital.types';
import styles from './EditalCard.module.css';

interface EditalCardProps {
    edital: Edital;
    onClick?: () => void;
}

export function EditalCard({ edital, onClick }: EditalCardProps) {
    const progress = edital.progresso || 0;
    const totalTopicos = edital.topicosCount || 0;

    const formatarData = (data: Date | string): string => {
        const dataProva = typeof data === 'string' ? new Date(data) : data;

        if (!(dataProva instanceof Date) || isNaN(dataProva.getTime())) {
            return 'Data inválida';
        }

        return dataProva.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.header}>
                <h3 className={styles.name}>{edital.nome}</h3>
                <span className={styles.badge}>{edital.banca}</span>
            </div>

            <div className={styles.metadata}>
                <span>{formatarData(edital.dataProva)}</span>
                <span>{edital.local}</span>
            </div>

            <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className={styles.progressInfo}>
                    <span>{progress}% concluído</span>
                    <span>{totalTopicos} tópicos</span>
                </div>
            </div>
        </div>
    );
}