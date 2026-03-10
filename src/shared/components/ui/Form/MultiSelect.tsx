import React from "react";
import { Text } from "@/shared/components/ui/Text"
import type { SelectOption } from "./Select";
import styles from "./Form.module.css";

interface MultiSelectProps {
    value: string[];
    onChange: (values: string[]) => void;
    options: SelectOption[];
}

export function MultiSelect({
    value,
    onChange,
    options,
}: MultiSelectProps) {
    function toggle(val: string) {
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            onChange([...value, val]);
        }
    }

    return (
        <div className={styles.multiSelect}>
            {options.map((opt) => (
                <label key={opt.value}>
                    <input
                        type="checkbox"
                        checked={value.includes(opt.value)}
                        onChange={() => toggle(opt.value)}
                    />

                    <Text as="span" variant="body">
                        {opt.label}
                    </Text>
                </label>
            ))}
        </div>
    );
}