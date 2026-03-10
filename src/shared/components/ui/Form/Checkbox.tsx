import React from "react";
import { Text } from "@/shared/components/ui/Text"
import styles from "./Form.module.css";

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
    return (
        <label className={styles.checkbox}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <Text as="span" variant="label">
                {label}
            </Text>
        </label>
    );
}
