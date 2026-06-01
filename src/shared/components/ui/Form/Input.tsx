import React from "react";
// import styles from "./Form.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export function Input(props: InputProps) {
    return <input className="input" {...props} />;
}
