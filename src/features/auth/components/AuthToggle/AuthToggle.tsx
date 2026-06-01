import styles from './AuthToggle.module.css';

interface AuthToggleProps {
    mode: 'login' | 'register';
    onToggle: (mode: 'login' | 'register') => void;
}

export function AuthToggle({ mode, onToggle }: AuthToggleProps) {
    return (
        <div className={styles.toggleContainer}>
            <button
                className={`${styles.toggleButton} ${mode === 'login' ? styles.active : ''}`}
                onClick={() => onToggle('login')}
            >
                Entrar
            </button>
            <button
                className={`${styles.toggleButton} ${mode === 'register' ? styles.active : ''}`}
                onClick={() => onToggle('register')}
            >
                Criar conta
            </button>
            <div
                className={`${styles.slider} ${mode === 'register' ? styles.sliderRight : ''}`}
            />
        </div>
    );
}