import { Outlet } from 'react-router-dom';
import { PublicHeader } from '../../navigation/PublicHeader/PublicHeader';
import { Footer } from '../../navigation/Footer/Footer';
import styles from './PublicLayout.module.css';

export const PublicLayout = () => {
    return (
        <div className={styles.layout}>
            <PublicHeader />
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};