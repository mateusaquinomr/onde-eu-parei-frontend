import { useRef, useState } from "react";
import { Tag } from "./Tag";
import { Text } from "@/shared/components/ui/Text";
import type { TagItem } from "./types";
import "./tag.css";

interface TagInputProps {
    value: TagItem[];
    onChange: (tags: TagItem[]) => void;
    maxTags?: number;
    placeholder?: string;
}

export function TagInput({
    value,
    onChange,
    maxTags = 10,
    placeholder = "Digite a tag e clique enter",
}: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    function addTag(label: string) {
        const normalized = label.trim();
        if (!normalized || value.length >= maxTags) return;

        if (
            value.some(
                (t) => t.label.toLowerCase() === normalized.toLowerCase()
            )
        ) {
            return;
        }

        onChange([
            ...value,
            { id: crypto.randomUUID(), label: normalized },
        ]);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputValue.replace(",", ""));
            setInputValue("");
        }

        if (e.key === "Backspace" && !inputValue && value.length) {
            onChange(value.slice(0, -1));
        }
    }

    return (
        <div className="tag-input">
            <div className="tag-input__container">
                {value.map((tag) => (
                    <Tag
                        key={tag.id}
                        tag={tag}
                        onRemove={() =>
                            onChange(value.filter((t) => t.id !== tag.id))
                        }
                    />
                ))}

                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                />
            </div>

            {/* <Text as="span" variant="helper">
                {maxTags - value.length}
            </Text> */}
        </div>
    );
}
