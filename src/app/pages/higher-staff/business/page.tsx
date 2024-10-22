import React from 'react';
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";
import Layout from "@/app/widgets/layout/layout";
import Businesses from "@/app/components/Business/businesses/businesses";

const role = 'higher-staff'
const business_id = ''

const BusinessHS = () => {
    return (
        <div>
            <ProtectedRoute>
                <Layout role={role} business_id={business_id}>
                    <Businesses user_role={role}/>
                </Layout>
            </ProtectedRoute>
        </div>
    );
}

export default BusinessHS;