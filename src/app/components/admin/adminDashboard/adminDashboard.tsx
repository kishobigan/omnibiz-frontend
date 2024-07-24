import React from 'react';
import Layout from "@/app/widgets/layout/layout";

function AdminDashboard() {
    const role = 'admin'
    return (
        <div>
            <Layout role={role}>
                This is admin dashboard.
            </Layout>
        </div>
    );
}

export default AdminDashboard;