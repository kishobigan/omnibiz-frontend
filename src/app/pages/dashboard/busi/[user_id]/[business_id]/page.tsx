'use client'
import React from "react";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";
import DashboardLayout from "@/app/widgets/dashboardLayout/dashboardLayout";
import Billing from "@/app/components/Billing/billing/billing";
import Supplier from "@/app/components/Supplier/supplier/supplier";
import Staff from "@/app/components/Staff/staff/staff";
import Inventory from "@/app/components/Inventory/inventory/inventory";
import Accounts from "@/app/components/accounts/accounts";

const role = 'owner'
const tabItems = [
    {label: "Billing", component: <Billing/>},
    {label: "Supplier", component: <Supplier/>},
    {label: "Staffs", component: <Staff/>},
    {label: "Inventory", component: <Inventory/>},
    {label: "Accounts", component: <Accounts/>},
]

function Dashboard() {
    return (
        <div className='vh-100'>
            <ProtectedRoute>
                <DashboardLayout role={role} tabItems={tabItems}/>
            </ProtectedRoute>
        </div>
    );
}

export default Dashboard;
