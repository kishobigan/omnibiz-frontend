'use client'
import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import logo from 'public/img/logo_white_crop.jpg'
import './sidebar.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faHome,
    faGear,
    faBriefcase,
    faSignOutAlt,
    faUsers,
    faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {usePathname} from 'next/navigation';
import useLogout from "@/app/components/logout/logout";

interface MenuItem {
    label: string;
    icon: IconProp;
    link?: string;
    onClick?: () => void;
}

interface SidebarProps {
    userId: string;
    business_id: string;
    role: 'owner' | 'admin' | 'staff' | 'higher-staff';
}

function Sidebar({userId, business_id, role}: SidebarProps) {
    const currentPath = usePathname();
    const {logout} = useLogout();

    const ownerMenuItems: MenuItem[] = [
        {label: "Home", icon: faHome, link: `/pages/dashboard/home`},
        {label: "Business", icon: faBriefcase, link: `/pages/dashboard/businesses`},
        {label: "Settings", icon: faGear, link: `/pages/dashboard/settings`},
    ];

    const adminMenuItems: MenuItem[] = [
        {label: "Home", icon: faHome, link: `/pages/admin/dashboard`},
        {label: "Business Owners", icon: faUsers, link: `/pages/admin/owners`},
        {label: "Business", icon: faBriefcase, link: `/pages/admin/business`},
        {label: "Transactions", icon: faExchangeAlt, link: `/pages/admin/transaction`},
    ];

    const staffMenuItems: MenuItem[] = [
        {label: "Business", icon: faBriefcase, link: `/pages/staff/business/${business_id}`},
        {label: "Settings", icon: faGear, link: `/pages/staff/settings`},
    ];

    const higherStaffMenuItems: MenuItem[] = [
        {label: "Home", icon: faHome, link: `/pages/higher-staff/home`},
        {label: "Business", icon: faBriefcase, link: `/pages/higher-staff/business`},
        {label: "Settings", icon: faGear, link: `/pages/higher-staff/settings`},
    ];

    function getMenuItems(role: string): MenuItem[] {
        switch (role) {
            case 'owner':
                return ownerMenuItems;
            case 'admin':
                return adminMenuItems;
            case 'staff':
                return staffMenuItems;
            case 'higher-staff':
                return higherStaffMenuItems;
            default:
                return [];
        }
    }

    const menuItems = getMenuItems(role);
    const logoutItem: MenuItem = {label: "Log out", icon: faSignOutAlt, onClick: logout};

    return (
        <div className='d-flex flex-column flex-shrink-0 px-3 w-100 side_bar_body sticky-top'>
            <div className='w-100 align-items-center align-content-center text-center side_bar_logo'>
                <Link href="/" className='text-decoration-none'>
                    <Image
                        className='mt-2'
                        src={logo}
                        alt="OmniBiz logo"
                        width={150}
                        height={50}
                    />
                </Link>
            </div>
            <div className='flex-grow-1'>
                <ul className='nav nav-pills flex-column mb-auto mt-5 gap-2'>
                    {menuItems.map((item: MenuItem, index) => (
                        <li className='nav-item' key={index}>
                            {item.link ? (
                                <Link href={item.link}
                                      className={`nav-link ${currentPath === item.link ? 'active' : ''}`}>
                                    <div className='d-flex gap-3 align-items-center'>
                                        <div>
                                            <FontAwesomeIcon className='side_bar_icon' icon={item.icon}/>
                                        </div>
                                        <div className='d-none d-lg-block item_label'>
                                            {item.label}
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div onClick={item.onClick} className='nav-link' style={{cursor: 'pointer'}}>
                                    <div className='d-flex gap-3 align-items-center'>
                                        <div>
                                            <FontAwesomeIcon className='side_bar_icon' icon={item.icon}/>
                                        </div>
                                        <div className='d-none d-lg-block item_label'>
                                            {item.label}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='mt-auto mb-4'>
                <ul className='nav nav-pills flex-column gap-2'>
                    <li className='nav-item'>
                        <div onClick={logoutItem.onClick} className='nav-link' style={{cursor: 'pointer'}}>
                            <div className='d-flex gap-3 align-items-center'>
                                <div>
                                    <FontAwesomeIcon className='side_bar_icon' icon={logoutItem.icon}/>
                                </div>
                                <div className='d-none d-lg-block item_label'>
                                    {logoutItem.label}
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;