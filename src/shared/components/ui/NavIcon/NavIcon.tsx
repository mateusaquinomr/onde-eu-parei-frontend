import { NavLink } from 'react-router-dom';
import styles from './NavIcon.module.css';

interface NavIconProps {
    to: string;
    iconOutline: React.ReactNode;
    iconFilled: React.ReactNode;
    label: string;
}

const NavIcon = ({ to, iconOutline, iconFilled, label }: NavIconProps) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `${styles.navIcon} ${isActive ? styles.active : ''}`
            }
            title={label}
        >
            <div className={styles.iconCircle}>
                <div className={styles.iconOutline}>
                    {iconOutline}
                </div>
                <div className={styles.iconFilled}>
                    {iconFilled}
                </div>
            </div>
        </NavLink>
    );
};

export default NavIcon;