import React from "react";
import type { ReactNode } from "react";
import { Text } from "@/shared/components/ui/Text";
import styles from "./FormField.module.css";

interface FormFieldProps {
    label?: string;
    helperText?: string;
    error?: string;
    required?: boolean;
    labelPosition?: "top" | "side";
    children: ReactNode;
}

export function FormField({
    label,
    helperText,
    error,
    required,
    labelPosition = "top",
    children,
}: FormFieldProps) {
    return (
        <div
            className={`${styles.field} ${styles[labelPosition]}`}
        >
            {label && (
                <Text
                    as="label"
                    variant="label"
                    className={styles.label}
                >
                    {label}
                    {required}
                </Text>
            )}

            <div className={styles.control}>
                {children}

                {helperText && !error && (
                    <Text variant="helper">{helperText}</Text>
                )}

                {error && <Text variant="note">{error}</Text>}
            </div>
        </div>
    );
}