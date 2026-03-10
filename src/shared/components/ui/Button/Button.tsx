import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";
import { Text } from "../Text/Text";
import styles from "./Button.module.css";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
    variant?: "primary" | "secondary" | "ghost";
}

export function Button({
    icon,
    children,
    variant = "primary",
    ...props
}: ButtonProps) {
    const iconOnly = !children && icon;

    return (
        <button
            {...props}
            className={`${styles.button} ${styles[variant]} ${iconOnly ? styles.iconOnly : ""
                }`}
        >
            {icon && <span className={styles.icon}>{icon}</span>}

            {children && (
                <Text as="span" variant="buttonText">
                    {children}
                </Text>
            )}
        </button>
    );
}