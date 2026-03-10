import type { ReactNode, ElementType } from "react";
import styles from "./Text.module.css";

type TextVariant =
    | "pageTitle"
    | "cardSectionTitle"
    | "cardTitle"
    | "body"
    | "label"
    | "buttonText"
    | "caption"
    | "helper"
    | "note";

interface TextProps {
    as?: ElementType;
    variant?: TextVariant;
    className?: string;
    children: ReactNode;
}

export function Text({
    as: Tag = "span",
    variant = "body",
    className,
    children,
}: TextProps) {
    return (
        <Tag className={`${styles[variant]} ${className ?? ""}`}>
            {children}
        </Tag>
    );
}