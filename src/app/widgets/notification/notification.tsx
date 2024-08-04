'use client';
import React, { useState, useEffect, useRef } from 'react';
import './notification.css';
import { FaBell} from 'react-icons/fa';
import axios from 'axios';

interface Notification {
    id: number;
    message: string;
}

const Notification: React.FC = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = async () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            await fetchNotifications();
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div className='notification' ref={dropdownRef}>
            <FaBell className='bellIcon' onClick={toggleDropdown} />
            {notifications.length > 0 && (
                <span className='badge'>{notifications.length}</span>
            )}
            {showDropdown && (
                <div className='dropdown show'>
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <div key={notification.id} className='notificationItem'>
                                {notification.message}
                            </div>
                        ))
                    ) : (
                        <div className='noNotifications'>No notifications</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
