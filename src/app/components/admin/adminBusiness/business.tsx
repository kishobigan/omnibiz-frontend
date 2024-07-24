'use client'
import React, {useEffect, useState} from 'react';
import Layout from "@/app/widgets/layout/layout";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsAltH} from "@fortawesome/free-solid-svg-icons";
import Search from "@/app/widgets/search/search";
import './adminBusiness.css'
import {DateSelector} from "@/app/widgets/datepicker/datepicker";
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import api from "@/app/utils/Api/api";

const AdminBusiness: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [businessData, setBusinessData] = useState([])
    const rowsPerPage = 10;
    const role = 'admin'

    const columns = [
        {key: 'business_name', header: 'Business name'},
        {key: 'business_address', header: 'Address'},
        {key: 'owner', header: 'Owner name'},
        {key: 'phone_number', header: 'Phone number'},
        {key: 'subscription_count', header: 'Subscription count'},
        {key: 'subscription_trial_ended_at', header: 'Trial end'},
    ];
    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const response = await api.get('/super/get-businesses');
                const businessData = response.data.map((item: any) => ({
                    business_name: item.business_name,
                    business_address: item.business_address,
                    owner: item.owner.owner,
                    phone_number: item.phone_number,
                    subscription_count: item.subscription_count,
                    subscription_trial_ended_at: item.subscription_trial_ended_at,
                }));
                setBusinessData(businessData);
            } catch (error) {
                console.error('Error fetching business data:', error);
            }
        };

        fetchBusinessData();
    }, []);
    const totalPages = Math.ceil(businessData.length / rowsPerPage);

    return (
        <Layout role={role}>
            <div className='container-fluid row mt-3'>
                <div className="">
                    <div className='topic'>
                        <h5><strong>Business</strong></h5>
                    </div>
                    <div className="filter-container">
                    <span>
                        {/*<FontAwesomeIcon icon={faArrowsAltH} className="filter-icon"/>*/}
                        Filter by:</span>
                        <div className="search">
                            <Search/>
                        </div>
                        <div className="selector-container">
                            {/*<DateSelector/>*/}
                        </div>
                    </div>
                </div>
                <div className="table-container mt-5">
                    <Table data={businessData}
                           columns={columns}
                           currentPage={currentPage}
                           rowsPerPage={rowsPerPage}
                           emptyMessage='business'
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default AdminBusiness;