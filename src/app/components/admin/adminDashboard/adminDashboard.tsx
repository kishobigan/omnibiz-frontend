'use client';
import React, {useState, useEffect} from 'react';
import Layout from "@/app/widgets/layout/layout";
import Button from "@/app/widgets/Button/Button";
import Card3 from "@/app/widgets/Card3/Card3";
import './adminDashboard.css';
import CreateAdminForm from "@/app/components/admin/adminDashboard/createAdmin/createAdmin";
import CreateAccessForm from "@/app/components/admin/adminDashboard/createAccess/createAccess";
import api from "@/app/utils/Api/api";

function AdminDashboard() {
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [businessCount, setBusinessCount] = useState(null);
    const [ownerCount, setOwnerCount] = useState(null);
    const role = 'admin';
    const business_id = '';

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const businessResponse = await api.get('/super/get-businesses');
                const ownerResponse = await api.get('/super/get-owners');
                setBusinessCount(businessResponse.data.length);
                setOwnerCount(ownerResponse.data.length);
            } catch (error) {
                console.error("Error fetching business or owner data:", error);
            }
        };

        fetchCounts();
    }, []);

    const data = [
        {
            title: "Business Owners",
            text: ownerCount !== null ? ownerCount : '0',
        },
        {
            title: "Business",
            text: businessCount !== null ? businessCount : '0',
        },
    ];

    return (
        <div className='vh-100'>
            <Layout role={role} business_id={business_id}>
                <div className='container-fluid row mt-5 overflow-auto'>
                    <div className='d-flex justify-content-end mb-5'>
                        <Button
                            onClick={() => setShowAdminModal(true)}
                            variant="dark"
                            className="me-4"
                        >
                            Create Admin
                        </Button>
                        <Button
                            onClick={() => setShowAccessModal(true)}
                            variant="dark"
                        >
                            Create Access
                        </Button>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <div className='_cards'>
                            {data.map((item, index) => (
                                <Card3 key={index} title={item.title} text={item.text} className=""/>
                            ))}
                        </div>
                    </div>
                    <CreateAdminForm
                        show={showAdminModal}
                        onHide={() => {
                            setShowAdminModal(false);
                        }}
                    />
                    <CreateAccessForm
                        show={showAccessModal}
                        onHide={() => {
                            setShowAccessModal(false);
                        }}
                    />
                </div>
            </Layout>
        </div>
    );
}

export default AdminDashboard;