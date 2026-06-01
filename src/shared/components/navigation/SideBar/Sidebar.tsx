import NavIcon from '@/shared/components/ui/NavIcon/NavIcon';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './Sidebar.module.css';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import TopicIcon from '@mui/icons-material/Topic';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import SpeedIcon from '@mui/icons-material/Speed';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

export const Sidebar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.navIconsContainer}>
                <NavIcon
                    to="/dashboard"
                    iconOutline={<DashboardOutlinedIcon />}
                    iconFilled={<DashboardIcon />}
                    label="Dashboard"
                />

                <NavIcon
                    to="/topics"
                    iconOutline={<TopicOutlinedIcon />}
                    iconFilled={<TopicIcon />}
                    label="Tópicos"
                />

                <NavIcon
                    to="/cycle"
                    iconOutline={<DonutLargeOutlinedIcon />}
                    iconFilled={<DonutLargeIcon />}
                    label="Ciclo"
                />

                <NavIcon
                    to="/performance"
                    iconOutline={<SpeedOutlinedIcon />}
                    iconFilled={<SpeedIcon />}
                    label="Performance"
                />
            </div>

            <div className={styles.themeContainer}>
                <div
                    className={`${styles.themeButton} ${theme === 'light' ? styles.active : ''}`}
                    onClick={() => theme !== 'light' && toggleTheme()}
                >
                    <LightModeOutlinedIcon />
                </div>

                <div
                    className={`${styles.themeButton} ${theme === 'dark' ? styles.active : ''}`}
                    onClick={() => theme !== 'dark' && toggleTheme()}
                >
                    <DarkModeOutlinedIcon />
                </div>
            </div>
        </aside>
    );
};