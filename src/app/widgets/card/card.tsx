import React from "react";
import "./card.css";

interface CardProps {
    title: React.ReactNode;
    logo?: string;
    body: React.ReactNode;
    footer?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ title, logo, body, footer, actions, style, className }) => {
    return (
        <div className={`card mb-4 card-custom ${logo ? 'with-logo' : ''} ${className}`} style={style}>
            <div className="card-body">
                <div className="header">
                    {logo && <img src={logo} alt="Business Logo" className="card-logo" />}
                    <h6 className="card-title">{title}</h6>
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


