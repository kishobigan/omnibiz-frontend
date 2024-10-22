import React from 'react';
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";
import Layout from "@/app/widgets/layout/layout";
import HomeDash from "@/app/components/homeDashboard/homeDash";

const role = 'higher-staff';
const business_id = ''

const HomeHS = () => {
    return (
        <div>
            <ProtectedRoute>
                <Layout role={role} business_id={business_id}>
                    <div className='mt-5'>
                        <HomeDash/>
                    </div>
                </Layout>
            </ProtectedRoute>
        </div>
    );
};

export default HomeHS;