import React from "react";
import "./input.css";

interface InputProps {
    placeholder?: string;
    label?: string;
    icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type?: string;
    name?: string;
    className?: string;
}

const Input: React.FC<InputProps> = ({placeholder, label, icon, value, onChange, type = "text", name, className}) => {
    return (
        <div className={`mb-3 ${className}`}>
            <div className="row">
                <div className="col">
                    {label && <label className="form-label">{label}</label>}
                    <div className="input-group">
                        {icon && <span className="input-group-text">{icon}</span>}
                        <input
                            type={type}
                            className="form-control input-placeholder"
                            placeholder={placeholder}
                            value={value}
                            onChange={onChange}
                            name={name}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Input;
