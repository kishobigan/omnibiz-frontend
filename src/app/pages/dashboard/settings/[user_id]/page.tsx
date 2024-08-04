import React from 'react';
import Settings from "@/app/components/settings/settings/settings";
import Layout from "@/app/widgets/layout/layout";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

const role = 'owner'

const settings = () => {
    return (
        <ProtectedRoute>
            <Layout role={role}>
                <Settings/>
            </Layout>
        </ProtectedRoute>
    );
}

export default settings;