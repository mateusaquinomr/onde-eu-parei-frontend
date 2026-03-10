import { Text } from "@/shared/components/ui/Text";
import type { TagItem } from "./types";
import "./tag.css";

interface TagProps {
    tag: TagItem;
    onRemove: () => void;
}

export function Tag({ tag, onRemove }: TagProps) {
    return (
        <span className="tag">
            <Text as="span" variant="caption">
                {tag.label}
            </Text>

            <button
                type="button"
                className="tag__remove"
                onClick={onRemove}
                aria-label={`Remove ${tag.label}`}
            >
                ×
            </button>
        </span>
    );
}
