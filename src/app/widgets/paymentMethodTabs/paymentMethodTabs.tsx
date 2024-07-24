import React from 'react';

interface PaymentMethodTabs {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const PaymentMethodTabs: React.FC<PaymentMethodTabs> = ({activeTab, onTabChange}) => {
    return (
        <div>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'cash' ? 'active' : ''} _font_black`}
                        onClick={() => onTabChange('cash')}
                        style={{cursor: 'pointer'}}
                    >
                        Cash
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'card' ? 'active' : ''} _font_black`}
                        onClick={() => onTabChange('card')}
                        style={{cursor: 'pointer'}}
                    >
                        Card
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'cheque' ? 'active' : ''} _font_black`}
                        onClick={() => onTabChange('cheque')}
                        style={{cursor: 'pointer'}}
                    >
                        Cheque
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default PaymentMethodTabs;
