import React from "react";
import styles from "./Form.module.css";

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export function Textarea(props: TextareaProps) {
    return <textarea className={styles.textarea} {...props} />;
}