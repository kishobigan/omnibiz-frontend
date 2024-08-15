import React from 'react';
import Billing from "@/app/components/Billing/billing/billing";
import Inventory from "@/app/components/Inventory/inventory/inventory";
import Supplier from "@/app/components/Supplier/supplier/supplier";
import Staff from "@/app/components/Staff/staff/staff";
import Accounts from "@/app/components/accounts/accounts";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";
import DashboardLayout from "@/app/widgets/dashboardLayout/dashboardLayout";

const role = 'higher-staff'
const tabItems = [
    {label: "Billing", component: <Billing/>},
    {label: "Inventory", component: <Inventory/>},
    {label: "Supplier", component: <Supplier/>},
    {label: "Staffs", component: <Staff/>},
    {label: "Accounts", component: <Accounts/>},
]

const DashboardHS = () => {
    return (
        <div className='min-vh-100'>
            <ProtectedRoute>
                <DashboardLayout role={role} tabItems={tabItems}/>
            </ProtectedRoute>
        </div>
    );
};

export default DashboardHS;