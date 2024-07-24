import React from "react";
import Layout from "@/app/widgets/layout/layout";
import Businesses from "@/app/components/Business/businesses/businesses";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

const role = 'owner'
const businesses = () => {
    return (
        <div>
            <ProtectedRoute>
                <Layout role={role}>
                    <Businesses/>
                </Layout>
            </ProtectedRoute>
        </div>
    );
};

export default businesses;
