import React from 'react';
import './Card3.css';

interface CardProps {
    title: string;
    text: string;
    className: string;
}

const Card3: React.FC<CardProps> = ({ title, text }) => {
    return (
        <div className='_card'>
            <h5>{title}</h5>
            <p className='mt-3 fw-bold'>{text}</p>
        </div>
    );
}

export default Card3;
