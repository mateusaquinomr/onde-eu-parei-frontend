import { Outlet } from 'react-router-dom';
import { TopNavbar } from '@/shared/components/navigation/TopNavBar/TopNavbar';
import { Sidebar } from '@/shared/components/navigation/SideBar/Sidebar';
import styles from './PrivateLayout.module.css';

export const PrivateLayout = () => {
    return (
        <div className={styles.layout}>
            <div className={styles.topNavbar}>
                <TopNavbar />
            </div>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
};