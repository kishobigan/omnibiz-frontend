'use client'
import React from 'react';
import Layout from "@/app/widgets/layout/layout";
import Tabs from "@/app/widgets/tabs/Tabs";
import Supplier from "@/app/components/Supplier/supplier/supplier";
import Inventory from '@/app/components/Inventory/inventory/inventory';
import Accounts from '@/app/components/accounts/accounts';
import Staff from '@/app/components/Staff/staff/staff';
import Billing from "@/app/components/Billing/billing/billing";

const tabItems = [
    {label: "Inventory", component: <Inventory/>},
    {label: "Billing", component: <Billing/>},
    {label: "Supplier", component: <Supplier/>},
    {label: "Staffs", component: <Staff/>},
    {label: "Accounts", component: <Accounts/>},
]
interface DashboardLayoutProps {
    role: 'owner' | 'admin' | 'staff' | 'higher_staff';
}

export default function DashboardLayout({role}: DashboardLayoutProps) {
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
