'use client'
import React, {useState} from "react";

interface TabItem {
    label: string;
    component: React.ReactNode;
}

interface TabProps {
    tabItems: TabItem[];
    defaultActiveTab?: number;
}

const Tabs: React.FC<TabProps> = ({tabItems, defaultActiveTab = 0}) => {
    const [activeTab, setActiveTab] = useState<number>(defaultActiveTab);
    return (
        <div className='vh-100'>
            <ul className="nav nav-tabs">
                {tabItems.map((item, index) => (
                    <li className="nav-item" key={index}>
                        <button
                            className={`nav-link _font_black ${index === activeTab ? 'active' : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
            <div>
                {tabItems[activeTab] && tabItems[activeTab].component}
            </div>
        </div>
    )
}

export default Tabs;
