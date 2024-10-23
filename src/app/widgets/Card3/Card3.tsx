import React from 'react';
import './Card3.css';

interface CardProps {
    title: string;
    text: string;
    className: string;
}

const Card3: React.FC<CardProps> = ({title, text}) => {
    return (
        <div className='_card'>
            <h5 className='fw-bold fs-4'>{title}</h5>
            <p className='mt-4 fs-3 fw-bold'>{text}</p>
        </div>
    );
}

export default Card3;