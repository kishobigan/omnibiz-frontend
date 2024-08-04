import React from 'react';
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

function Page() {
    return (
        <ProtectedRoute>
            This is higher staff page
        </ProtectedRoute>
    );
}

export default Page;