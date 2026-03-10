import React from "react";
import styles from "./Form.module.css";

interface DatePickerProps {
    value?: string;
    onChange: (value: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
    return (
        <input
            type="date"
            className={styles.datePicker}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
