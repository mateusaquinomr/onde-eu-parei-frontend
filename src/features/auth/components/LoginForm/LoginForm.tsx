import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import { Text } from '@/shared/components/ui/Text/Text';
import { useAuth } from '../../hooks/useAuth';
import type { ValidationErrors } from '../../types/auth.types';
import styles from './LoginForm.module.css';

export function LoginForm() {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validate = (): boolean => {
        const newErrors: ValidationErrors = {};
        if (!email) newErrors.email = 'E-mail é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
        if (!password) newErrors.password = 'Senha é obrigatória';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {

            console.error('Login failed:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
                <div className={styles.generalError}>
                    <Text variant="helper" className={styles.errorText}>
                        {error}
                    </Text>
                </div>
            )}

            <div className={styles.field}>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail ou usuário"
                    disabled={isLoading}
                />
                {errors.email && (
                    <Text variant="helper" className={styles.errorText}>
                        {errors.email}
                    </Text>
                )}
            </div>

            <div className={styles.field}>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    disabled={isLoading}
                />
                {errors.password && (
                    <Text variant="helper" className={styles.errorText}>
                        {errors.password}
                    </Text>
                )}
            </div>

            <div className={styles.buttonWrapper}>
                <Button
                    type="submit"
                    variant="primary"
                    className={styles.submitButton}
                    style={{ padding: '0.75rem 1.5rem', width: '100%' }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
            </div>
        </form>
    );
}