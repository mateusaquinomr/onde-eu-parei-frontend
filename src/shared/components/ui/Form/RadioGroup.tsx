import { Text } from "@/shared/components/ui/Text";
import styles from "./Form.module.css";

interface RadioOption {
    label: string;
    value: string;
}

interface RadioGroupProps {
    value: string;
    onChange: (value: string) => void;
    options: RadioOption[];
}

export function RadioGroup({
    value,
    onChange,
    options,
}: RadioGroupProps) {
    return (
        <div className={styles.radioGroup}>
            {options.map((opt) => (
                <label key={opt.value}>
                    <input
                        type="radio"
                        checked={value === opt.value}
                        onChange={() => onChange(opt.value)}
                    />

                    <Text as="span" variant="body">
                        {opt.label}
                    </Text>
                </label>
            ))}
        </div>
    );
}