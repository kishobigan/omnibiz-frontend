import React from 'react';
import Layout from "@/app/widgets/layout/layout";
import HomeDash from "@/app/components/homeDashboard/homeDash";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

const role = 'owner'

function Page() {
    return (
        <ProtectedRoute>
            <Layout role={role}>
                <HomeDash/>
            </Layout>
        </ProtectedRoute>
    );
}

export default Page;