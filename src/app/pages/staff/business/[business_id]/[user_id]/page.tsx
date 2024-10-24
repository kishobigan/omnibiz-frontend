'use client'
import React, {useEffect} from 'react';
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
import axios from "axios";

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
    const {user_id, business_id} = useParams() as { user_id: string, business_id: string };
    console.log("user_id", user_id);
    const token = Cookies.get(ACCESS_TOKEN) || '';
    console.log("token: ", token)
    // const [tabItems, setTabItems] = useState<TabItem[]>([]);
    const role = 'staff';
    // const business_id = '72y3r1p5'
    console.log("user id", user_id)

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                // const response = await api.get(`staff/list-staff-access/${user_id}`,
                const response = await axios.get(`http://127.0.0.1:8000/api/staff/list-staff-access/0aafe063-0850-4c31-bdf8-bbc1742af8c1`,
                    // headers: {
                    //     Authorization: `Bearer ${token}`,
                    // }
                );
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
            <DashboardLayout role={role} tabItems={tabItems} business_id={business_id} token={token}/>
        </ProtectedRoute>
    );
}

export default StaffDashboard;