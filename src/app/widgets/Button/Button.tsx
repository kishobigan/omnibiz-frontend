'use client'
import React from "react";
import './Button.css';

interface ButtonProps {
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    children: React.ReactNode,
    variant?: 'dark' | 'light',
    className?: string
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({onClick, children, variant = 'dark', className = '', type}) => {
    const buttonClass = variant === 'dark' ? 'btn-dark' : 'btn-outline-secondary text-dark';
    return (
        <button
            onClick={onClick}
            className={`btn btn-md ${buttonClass} ${className}`}
            type={type}
        >
            {children}
        </button>

    );
};
export default Button;