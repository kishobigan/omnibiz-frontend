'use client'
import React from 'react';
import Layout from "@/app/widgets/layout/layout";
import Tabs from "@/app/widgets/tabs/Tabs";

interface DashboardLayoutProps {
    role: 'owner' | 'admin' | 'staff' | 'higher_staff';
    tabItems: { label: string, component: JSX.Element }[];
}

export default function DashboardLayout({role, tabItems}: DashboardLayoutProps) {
    return (
        <div className='vh-100'>
            <Layout role={role}>
                <div className=''>
                    <Tabs tabItems={tabItems}/>
                </div>
            </Layout>
        </div>
    );
}
