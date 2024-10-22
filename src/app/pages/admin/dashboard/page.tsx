import React from 'react';
import AdminDashboard from "@/app/components/admin/adminDashboard/adminDashboard";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

function Page() {
    return (
        <ProtectedRoute>
            <AdminDashboard />
        </ProtectedRoute>
    );
}

export default Page;