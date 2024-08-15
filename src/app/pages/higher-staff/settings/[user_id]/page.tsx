import React from 'react';
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";
import Layout from "@/app/widgets/layout/layout";

const role = 'higher-staff'

const Settings = () => {
    return (
        <div>
            <ProtectedRoute>
                <Layout role={role}>
                    This is higher-staff settings page.
                </Layout>
            </ProtectedRoute>
        </div>
    );
};

export default Settings;