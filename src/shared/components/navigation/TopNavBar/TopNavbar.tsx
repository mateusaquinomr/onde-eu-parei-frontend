import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { useUser } from '@/features/user/hooks/useUser';
import styles from './TopNavbar.module.css';

export const TopNavbar = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userName = user?.name || "Usuário";
    const userInitial = userName.charAt(0).toUpperCase();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleProfile = () => {
        setIsDropdownOpen(false);
        navigate('/profile');
    };

    const handleSettings = () => {
        setIsDropdownOpen(false);
        navigate('/settings');
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
        <nav className={styles.topNavbar}>
            <div className={styles.logo}>
                <div className={styles.logoPlaceholder}>OndeEuParei?</div>
            </div>

            <div className={styles.userButtonContainer} ref={dropdownRef}>
                <button
                    className={styles.userButton}
                    onClick={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                >
                    <div className={styles.userAvatar}>
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={userName}
                                className={styles.avatarImage}
                            />
                        ) : (
                            <span className={styles.avatarInitials}>
                                {getInitials(userName)}
                            </span>
                        )}
                    </div>
                    <Text variant="body" className={styles.userName}>
                        {userName}
                    </Text>
                    <span className={`material-icons ${styles.dropdownIcon} ${isDropdownOpen ? styles.rotated : ''}`}>
                        expand_more
                    </span>
                </button>

                {isDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                        <button
                            className={styles.dropdownItem}
                            onClick={handleProfile}
                        >
                            <span className="material-icons">person_outline</span>
                            <span className={styles.dropdownItemText}>Perfil</span>
                        </button>
                        <button
                            className={styles.dropdownItem}
                            onClick={handleSettings}
                        >
                            <span className={`material-icons ${styles.settingsIcon}`}>settings_outline</span>
                            <span className={styles.dropdownItemText}>Configurações</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}