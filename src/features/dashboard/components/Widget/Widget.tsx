import { type ReactNode } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import styles from './Widget.module.css';

type WidgetVariant = 'default' | 'primary' | 'secondary' | 'transparent' | 'none';

interface WidgetProps {
    title?: string;
    children: ReactNode;
    className?: string;
    headerAction?: ReactNode;
    variant?: WidgetVariant;
}

export const Widget = ({
    title,
    children,
    className = '',
    headerAction,
    variant = 'default'
}: WidgetProps) => {
    return (
        <div className={`${styles.widget} ${styles[variant]} ${className}`}>
            <div className={styles.widgetHeader}>
                <Text variant="cardTitle" className={styles.widgetTitle}>
                    {title}
                </Text>
                {headerAction && (
                    <div className={styles.widgetAction}>
                        {headerAction}
                    </div>
                )}
            </div>
            <div className={styles.widgetContent}>
                {children}
            </div>
        </div>
    );
};