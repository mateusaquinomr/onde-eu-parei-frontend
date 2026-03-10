import React from "react";
import styles from "./Form.module.css";

export interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    value?: string;
    onChange: (value: string) => void;
    options: SelectOption[];
}

export function Select({ value, onChange, options }: SelectProps) {
    return (
        <select
            className={styles.select}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Selecione</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
