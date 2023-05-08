"use client";
import { FC } from "react";

interface ButtonProps {
    text: string;
    onClick: () => void;
}

const Button: FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default Button
