import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    size?: 'small' | 'medium' | 'large';
}

export function Modal({ isOpen, onClose, children, title, size = 'medium' }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={`${styles.modal} ${styles[size]}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    {title && <Text variant="cardTitle">{title}</Text>}
                    <Button
                        variant="ghost"
                        icon={<span>x</span>}
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label="Fechar"
                    />
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
}