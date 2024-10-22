import React from "react";
import Layout from "@/app/widgets/layout/layout";
import Businesses from "@/app/components/Business/businesses/businesses";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

const role = 'owner'
const business_id = ''
const businesses = () => {
    return (
        <div>
            <ProtectedRoute>
                <Layout role={role} business_id={business_id}>
                    <Businesses user_role={role}/>
                </Layout>
            </ProtectedRoute>
        </div>
    );
};

export default businesses;
