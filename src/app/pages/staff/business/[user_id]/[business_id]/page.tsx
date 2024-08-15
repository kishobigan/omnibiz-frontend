'use client'
import React, {useEffect, useState} from 'react';
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";
import {useParams} from "next/navigation";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import DashboardLayout from "@/app/widgets/dashboardLayout/dashboardLayout";
import Billing from "@/app/components/Billing/billing/billing";
import Supplier from "@/app/components/Supplier/supplier/supplier";
import Inventory from "@/app/components/Inventory/inventory/inventory";
import Accounts from "@/app/components/accounts/accounts";
import Staff from '@/app/components/Staff/staff/staff';
import api from "@/app/utils/Api/api";

type TabItem = {
    label: string;
    component: JSX.Element;
    permission: string;
};

const allTabItems: TabItem[] = [
    {label: "Billing", component: <Billing/>, permission: 'billing'},
    {label: "Supplier", component: <Supplier/>, permission: 'suppliers'},
    {label: "Staffs", component: <Staff/>, permission: 'staffs'},
    {label: "Inventory", component: <Inventory/>, permission: 'inventory'},
    {label: "Accounts", component: <Accounts/>, permission: 'accounts'},
];

const tabItems: TabItem[] = [
    {label: "Billing", component: <Billing/>, permission: 'billing'},
    // {label: "Supplier", component: <Supplier/>, permission: 'suppliers'},
    // {label: "Staffs", component: <Staff/>, permission: 'staffs'},
    {label: "Inventory", component: <Inventory/>, permission: 'inventory'},
    // {label: "Accounts", component: <Accounts/>, permission: 'accounts'},
];

const StaffDashboard = () => {
    const {user_id, business_id} = useParams();
    console.log("user_id", user_id);
    const token = Cookies.get(ACCESS_TOKEN)
    // const [tabItems, setTabItems] = useState<TabItem[]>([]);
    const role = 'staff';

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await api.get(`staff/list-staff-access/${user_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const permissions = response.data.permissions;
                    console.log("Staff permissions", permissions)

                    const filteredTabs = allTabItems.filter(tab =>
                        permissions.includes(tab.permission)
                    );

                    // setTabItems(filteredTabs);
                } else {
                    console.log('Failed to fetch permissions.');
                }
            } catch (error) {
                console.log('An error occurred while fetching permissions:', error);
            }
        };

        fetchPermissions();
    }, []);

    return (
        <ProtectedRoute>
            <DashboardLayout role={role} tabItems={tabItems}/>
        </ProtectedRoute>
    );
}

export default StaffDashboard;
