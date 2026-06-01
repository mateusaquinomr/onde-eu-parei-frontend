import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { AuthToggle } from '../components/AuthToggle/AuthToggle';
import { LoginForm } from '../components/LoginForm/LoginForm';
import { RegisterForm } from '../components/RegisterForm/RegisterForm';
import { SocialButtons } from '../components/SocialButtons/SocialButtons';
import styles from './AuthPage.module.css';

export function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const getModeFromPath = () => {
        return location.pathname === '/register' ? 'register' : 'login';
    };

    const [mode, setMode] = useState<'login' | 'register'>(getModeFromPath());

    const handleToggle = (newMode: 'login' | 'register') => {
        setMode(newMode);
        navigate(newMode === 'login' ? '/login' : '/register');
    };

    useEffect(() => {
        const newMode = getModeFromPath();
        if (newMode !== mode) {
            setMode(newMode);
        }
    }, [location.pathname]);

    const title = mode === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta';
    const subtitle = mode === 'login'
        ? 'Faça login para continuar'
        : 'Preencha os dados abaixo para começar';

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <AuthToggle mode={mode} onToggle={handleToggle} />

                <div className={styles.header}>
                    <Text as="h2" variant="pageTitle" className={styles.title}>
                        {title}
                    </Text>
                    <Text variant="body" className={styles.subtitle}>
                        {subtitle}
                    </Text>
                </div>

                {mode === 'login' ? <LoginForm /> : <RegisterForm />}

                <SocialButtons />

                {mode === 'register' && (
                    <div className={styles.footer}>
                        <Text variant="caption">Já tem uma conta?</Text>
                        <button
                            className={styles.linkButton}
                            onClick={() => navigate('/login')}
                        >
                            Faça login
                        </button>
                    </div>
                )}

                {mode === 'login' && (
                    <div className={styles.footer}>
                        <Text variant="caption">Não tem uma conta?</Text>
                        <button
                            className={styles.linkButton}
                            onClick={() => navigate('/register')}
                        >
                            Cadastre-se
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}