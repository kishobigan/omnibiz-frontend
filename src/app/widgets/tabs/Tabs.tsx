'use client'
import React, {useState, useEffect} from "react";
import Notification from "@/app/widgets/notification/notification";

interface TabItem {
    label: string;
    component: React.ReactNode;
}

interface TabProps {
    tabItems: TabItem[];
    business_id: string;
    token: string;
}

const Tabs: React.FC<TabProps> = ({tabItems, business_id, token}) => {
    const [activeTab, setActiveTab] = useState<number>(0);

    useEffect(() => {
        const savedActiveTab = localStorage.getItem("activeTab");
        if (savedActiveTab) {
            setActiveTab(parseInt(savedActiveTab, 10));
        }
    }, []);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
        localStorage.setItem("activeTab", index.toString());
    };

    return (
        <div className='vh-100'>
            <ul className="nav nav-tabs">
                {tabItems.map((item, index) => (
                    <li className="nav-item" key={index}>
                        <button
                            className={`nav-link _font_black ${index === activeTab ? 'active' : ''}`}
                            onClick={() => handleTabClick(index)}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
            <Notification business_id={business_id} token={token}/>
            <div>
                {tabItems[activeTab] && tabItems[activeTab].component}
            </div>
        </div>
    );
}

export default Tabs;
