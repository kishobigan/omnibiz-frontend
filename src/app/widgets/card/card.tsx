import React from "react";
import "./card.css";
import Image from 'next/image';


interface CardProps {
    title: React.ReactNode;
    logo?: string;
    body: React.ReactNode;
    footer?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    color?:string
}

const Card: React.FC<CardProps> = ({ title, logo, body, footer, actions, style, className, color }) => {
    return (
        <div className={`card mb-4 card-custom ${logo ? 'with-logo' : ''} ${className}`} style={{...style, backgroundColor: color}}>
            <div className="card-body">
                <div className="header">
                {logo && (
                        <div className="card-logo-container">
                            <Image 
                                src={logo} 
                                alt="Business Logo" 
                                className="card-logo" 
                                width={50} 
                                height={50} 
                                layout="fixed" 
                            />
                        </div>
                    )}
                    <h6 className="card-title fw-bold">{title}</h6>
                </div>
                <div className="card-text">{body}</div>
                {footer && <div className="card-footer">{footer}</div>}
                <div className="actions-container">
                    {actions && <div className="edit-icon">{actions}</div>}
                </div>
            </div>
        </div>
    );
};

export default Card;


