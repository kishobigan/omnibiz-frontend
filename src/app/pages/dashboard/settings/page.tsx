import React from 'react';
import Settings from "@/app/components/settings/settings/settings";
import Layout from "@/app/widgets/layout/layout";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

const role = 'owner'
const business_id = ''

const settings = () => {
    return (
        <ProtectedRoute>
            <Layout role={role} business_id={business_id}>
                <Settings/>
            </Layout>
        </ProtectedRoute>
    );
}

export default settings;