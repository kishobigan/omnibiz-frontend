'use client'
import React, {useState} from 'react';
import Layout from "@/app/widgets/layout/layout";
import Button from "@/app/widgets/Button/Button";
import Card3 from "@/app/widgets/Card3/Card3";
import './adminDashboard.css';
import CreateAdminForm from "@/app/components/admin/adminDashboard/createAdmin/createAdmin";
import CreateAccessForm from "@/app/components/admin/adminDashboard/createAccess/createAccess";

function AdminDashboard() {
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showAccessModal, setShowAccessModal] = useState(false);
    const role = 'admin'

    const data = [
        {
            title: "Total Income",
            text: "11,000",
        },
        {
            title: "Total Expenses",
            text: "12,000",
        },
        {
            title: "Total Profit",
            text: "13,000",
        },
        {
            title: "Total Loss",
            text: "14,000",
        },
    ];

    return (
        <div className='vh-100'>
            <Layout role={role}>
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
                    <div className='_cards'>
                        {data.map((item, index) => (
                            <Card3 key={index} title={item.title} text={item.text} className=""/>
                        ))}
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