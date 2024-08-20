import React from 'react';
import "./card2.css"

interface CardProps {
    title: string;
    text: string;
    maxWidth?: string;
}

const Card2: React.FC<CardProps> = ({title, text, maxWidth = '15rem'}) => {
    return (
        <div className="card custom-card" style={{maxWidth}}>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-title py-3 fw-bold fs-5">{text}</p>
            </div>
        </div>
    );
}

export default Card2;
