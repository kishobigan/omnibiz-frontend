import React from 'react';
import AdminBusiness from "@/app/components/admin/adminBusiness/business";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

function Page() {
    return (
        <ProtectedRoute>
            <AdminBusiness/>
        </ProtectedRoute>
    );
}

export default Page;