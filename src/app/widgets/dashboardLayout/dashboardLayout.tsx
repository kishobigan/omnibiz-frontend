'use client'
import React from 'react';
import Layout from "@/app/widgets/layout/layout";
import Tabs from "@/app/widgets/tabs/Tabs";

interface DashboardLayoutProps {
    role: 'owner' | 'admin' | 'staff' | 'higher-staff';
    tabItems: { label: string, component: JSX.Element }[];
    business_id: string;
    token: string;
}

export default function DashboardLayout({role, tabItems, business_id, token}: DashboardLayoutProps) {
    return (
        <div className='vh-100'>
            <Layout role={role} business_id={business_id}>
                <div className=''>
                    <Tabs tabItems={tabItems} business_id={business_id} token={token}/>
                </div>
            </Layout>
        </div>
    );
}
