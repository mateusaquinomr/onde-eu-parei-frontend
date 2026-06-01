import { Outlet } from 'react-router-dom';
import { TopNavbar } from '../navigation/TopNavBar/TopNavbar';
import { Sidebar } from '../navigation/SideBar/Sidebar';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
    return (
        <div className={styles.layout}>
            <TopNavbar />
            <Sidebar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};