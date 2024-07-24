import React from 'react';

interface DropdownProps {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    // onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    name: string;
}

const Dropdown: React.FC<DropdownProps> = ({label, options, value, onChange, name}) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <select className="form-control" value={value} onChange={onChange} name={name}>
                <option value="">Select {label}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
