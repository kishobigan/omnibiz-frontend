'use client'
import React from "react";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";
import DashboardLayout from "@/app/widgets/dashboardLayout/dashboardLayout";

const role = 'owner'

function Dashboard() {
    return (
        <div className='vh-100'>
            <ProtectedRoute>
                <DashboardLayout role={role}/>
            </ProtectedRoute>
        </div>
    );
}

export default Dashboard;
