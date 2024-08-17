'use client'
import React from "react";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";
import DashboardLayout from "@/app/widgets/dashboardLayout/dashboardLayout";
import Billing from "@/app/components/Billing/billing/billing";
import Supplier from "@/app/components/Supplier/supplier/supplier";
import Staff from "@/app/components/Staff/staff/staff";
import Inventory from "@/app/components/Inventory/inventory/inventory";
import Accounts from "@/app/components/accounts/accounts";
import {useParams} from "next/navigation";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";

const tabItems = [
    {label: "Billing", component: <Billing/>},
    {label: "Inventory", component: <Inventory/>},
    {label: "Supplier", component: <Supplier/>},
    {label: "Staffs", component: <Staff/>},
    {label: "Accounts", component: <Accounts/>},
]

function Dashboard() {
    const role = 'owner'
    const {business_id} = useParams();
    const businessId = Array.isArray(business_id) ? business_id[0] : business_id ?? '';
    const token = Cookies.get(ACCESS_TOKEN) || ''
    return (
        <div className='vh-100'>
            <ProtectedRoute>
                <DashboardLayout role={role} tabItems={tabItems} business_id={businessId} token={token}/>
            </ProtectedRoute>
        </div>
    );
}

export default Dashboard;
