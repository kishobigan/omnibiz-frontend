import React from 'react';
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";
import ChangePassword from "@/app/components/settings/changePassword/changePassword";

const Page = () => {
    return (
        <ProtectedRoute>
            <div className='d-flex justify-content-center align-items-center min-vh-100'>
                <div className='col-lg-5 col-md-10 col-12'>
                    <div className='border rounded shadow p-5'>
                        <ChangePassword/>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Page;