import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import { Text } from '@/shared/components/ui/Text/Text';
import { authService } from '../../services/auth.service';
import type { ValidationErrors } from '../../types/auth.types';
import styles from './RegisterForm.module.css';

export function RegisterForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!email) newErrors.email = 'E-mail é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';

        if (!password) newErrors.password = 'Senha é obrigatória';
        else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

        if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);

        try {

            authService.saveStep1({ email, password });

            navigate('/register/info');
        } catch (error: any) {
            setErrors({ general: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {errors.general && (
                <div className={styles.generalError}>
                    <Text variant="helper" className={styles.errorText}>
                        {errors.general}
                    </Text>
                </div>
            )}

            <div className={styles.field}>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
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

            <div className={styles.field}>
                <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar senha"
                    disabled={isLoading}
                />
                {errors.confirmPassword && (
                    <Text variant="helper" className={styles.errorText}>
                        {errors.confirmPassword}
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
                    {isLoading ? 'Carregando...' : 'Continuar'}
                </Button>
            </div>
        </form>
    );
}