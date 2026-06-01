import { useState } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import { useUser } from '../../hooks/useUser';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
    const { user, loading, updateProfile } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Carregando...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <Text variant="body">Usuário não encontrado</Text>
                    <Button variant="primary" onClick={() => window.location.href = '/login'}>
                        Fazer login
                    </Button>
                </div>
            </div>
        );
    }

    const handleEdit = () => {
        setFormData({
            name: user.name,
            username: user.username,
            email: user.email,
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setErrors({});
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name) newErrors.name = 'Nome é obrigatório';
        else if (formData.name.length < 3) newErrors.name = 'Mínimo 3 caracteres';

        if (!formData.username) newErrors.username = 'Usuário é obrigatório';
        else if (!/^[a-z0-9._]+$/.test(formData.username)) {
            newErrors.username = 'Use letras minúsculas, números, . ou _';
        }

        if (!formData.email) newErrors.email = 'E-mail é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        await updateProfile(formData);
        setIsEditing(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text as="h1" variant="pageTitle">Meu Perfil</Text>
            </div>

            <div className={styles.card}>

                <div className={styles.avatarSection}>
                    <div className={styles.avatar}>
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className={styles.avatarImage} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {getInitials(user.name)}
                            </div>
                        )}
                    </div>
                    <Button variant="secondary">
                        Alterar foto
                    </Button>
                </div>

                <div className={styles.form}>
                    {isEditing ? (
                        <>
                            <div className={styles.field}>
                                <Text variant="label">Nome completo</Text>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Seu nome"
                                />
                                {errors.name && (
                                    <Text variant="helper" className={styles.errorText}>
                                        {errors.name}
                                    </Text>
                                )}
                            </div>

                            <div className={styles.field}>
                                <Text variant="label">Usuário (@)</Text>
                                <Input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                                    placeholder="seudousuario"
                                />
                                {errors.username && (
                                    <Text variant="helper" className={styles.errorText}>
                                        {errors.username}
                                    </Text>
                                )}
                            </div>

                            <div className={styles.field}>
                                <Text variant="label">E-mail</Text>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="seu@email.com"
                                />
                                {errors.email && (
                                    <Text variant="helper" className={styles.errorText}>
                                        {errors.email}
                                    </Text>
                                )}
                            </div>

                            <div className={styles.buttonGroup}>
                                <Button variant="secondary" onClick={handleCancel}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={handleSave}>
                                    Salvar
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabel}>
                                    <Text variant="label">Nome completo</Text>
                                </div>
                                <div className={styles.infoValue}>
                                    <Text variant="body">{user.name}</Text>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.infoLabel}>
                                    <Text variant="label">Usuário (@)</Text>
                                </div>
                                <div className={styles.infoValue}>
                                    <Text variant="body">@{user.username}</Text>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.infoLabel}>
                                    <Text variant="label">E-mail</Text>
                                </div>
                                <div className={styles.infoValue}>
                                    <Text variant="body">{user.email}</Text>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.infoLabel}>
                                    <Text variant="label">Objetivo de estudo</Text>
                                </div>
                                <div className={styles.infoValue}>
                                    <Text variant="body">
                                        {user.studyGoal === 'enem' && 'ENEM'}
                                        {user.studyGoal === 'concurso' && 'Concurso público'}
                                        {user.studyGoal === 'faculdade' && 'Faculdade'}
                                        {user.studyGoal === 'outro' && user.studyGoalCustom}
                                        {!user.studyGoal && 'Não definido'}
                                    </Text>
                                </div>
                            </div>

                            <div className={styles.infoRow}>
                                <div className={styles.infoLabel}>
                                    <Text variant="label">Membro desde</Text>
                                </div>
                                <div className={styles.infoValue}>
                                    <Text variant="body">
                                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                    </Text>
                                </div>
                            </div>

                            <div className={styles.buttonGroup}>
                                <Button variant="primary" onClick={handleEdit}>
                                    Editar perfil
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}