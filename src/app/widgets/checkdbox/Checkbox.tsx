'use client'
import React from 'react';
import './checkbox.css'

interface CheckboxProps {
    label: string;
    name: string;
    value: string;
    checked: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({label, name, value, checked, handleChange}) => {
    return (
        <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id={name}
                name={name}
                value={value}
                checked={checked}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={name}>
                {label}
            </label>
        </div>
    );
};

export default Checkbox;
