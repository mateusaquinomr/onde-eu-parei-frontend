import { Text } from '@/shared/components/ui/Text/Text';
import styles from './Footer.module.css';

export const Footer = () => {

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <Text variant="caption" className={styles.copyright}>
                    {/* © OndeEuParei  */}
                    Todos os direitos reservados.
                </Text>
                <div className={styles.links}>
                    {/* <a href="#" className={styles.link}>Sobre</a>
                    <a href="#" className={styles.link}>Termos</a>
                   */}
                </div>
            </div>
        </footer>
    );
};