import React from 'react';
import Layout from "@/app/widgets/layout/layout";
import HomeDash from "@/app/components/homeDashboard/homeDash";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

const role = 'owner'
const business_id = ''

function Page() {
    return (
        <ProtectedRoute>
            <Layout role={role} business_id={business_id}>
                <div className='mt-5'>
                    <HomeDash/>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}

export default Page;