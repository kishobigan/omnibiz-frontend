import React from 'react';

interface CardProps {
    title: string;
    text: string;
    maxWidth?: string;
}

const Card2: React.FC<CardProps> = ({title, text, maxWidth = '15rem'}) => {
    return (
        <div className="card border-dark text-bg-secondary" style={{maxWidth}}>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-title py-3">{text}</p>
            </div>
        </div>
    );
}

export default Card2;
