import React, {useEffect, useState} from 'react';

interface Option {
    value: string;
    label: string;
}

interface InputDropdownProps {
    label: string;
    options: Option[];
    value: string;
    onChange: (name: string, value: string) => void;
    name: string;
}

const InputDropdown: React.FC<InputDropdownProps> = ({label, options, value, onChange, name}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const option = options.find(option => option.value === value);
        setSelectedOption(option || null);
    }, [value, options]);

    const handleSelectChange = (selectedValue: string) => {
        const selectedOption = options.find(option => option.value === selectedValue);
        setSelectedOption(selectedOption || null);
        onChange(name, selectedValue);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setIsOpen(true);
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleBlur = () => {
        setTimeout(() => setIsOpen(false), 100);
    };

    const clearSelection = () => {
        onChange(name, '');
        setSelectedOption(null);
        setSearchTerm('');
    };

    return (
        <div className="form-group" style={{position: 'relative'}}>
            <label>{label}</label>
            <input
                type="text"
                placeholder={`Search ${label}`}
                value={selectedOption ? selectedOption.label : searchTerm}
                onChange={handleSearchChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="form-control mb-2"
                style={{zIndex: 2}}
            />
            {isOpen && filteredOptions.length > 0 && (
                <ul className="list-group" style={{position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1}}>
                    {filteredOptions.map(option => (
                        <li
                            key={option.value}
                            className="list-group-item list-group-item-action"
                            onMouseDown={() => handleSelectChange(option.value)}
                            style={{cursor: 'pointer'}}
                        >
                            {option.label}
                        </li>
                    ))}
                    <li
                        className="list-group-item list-group-item-action"
                        onMouseDown={clearSelection}
                        style={{cursor: 'pointer'}}
                    >
                        <b>Clear Selection</b>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default InputDropdown;

