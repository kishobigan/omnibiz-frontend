import React from 'react';
import AdminBusinessOwner from "@/app/components/admin/adminBusinessOwner/owner";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

function Page() {
    return (
        <ProtectedRoute>
            <AdminBusinessOwner/>
        </ProtectedRoute>
    );
}

export default Page;