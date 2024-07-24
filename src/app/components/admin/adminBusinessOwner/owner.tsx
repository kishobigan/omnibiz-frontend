'use client'
import React, {useEffect, useState} from 'react';
import Layout from "@/app/widgets/layout/layout";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsAltH} from "@fortawesome/free-solid-svg-icons";
import Search from "@/app/widgets/search/search";
import './adminBusinessOwner.css'
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import api from "@/app/utils/Api/api";

const AdminBusinessOwner: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [ownerData, setOwnerData] = useState([])
    const role = 'admin'

    const columns = [
        {key: 'owner_name', header: 'Owner name'},
        {key: 'business_names', header: 'Business names'},
        {key: 'business_count', header: 'Business count'},
        {key: 'phone_number', header: 'Phone number'},
        {key: 'subscription_amount', header: 'Subscription amount'},
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/super/get-owners');
                const businessOwnersData = response.data.map((item: any) => ({
                    owner_name: item.owner_name,
                    business_names: item.businesses.map((business: any) => business.business_name).join(', '),
                    business_count: item.business_count,
                    phone_number: item.phone_number,
                    subscription_amount: item.subscription_amount,
                }));
                setOwnerData(businessOwnersData);
                console.log("business owners data", response.data)
                console.log("business owners data", businessOwnersData)
            } catch (error) {
                console.log("Error in fetching business owners data", error)
            }
        };

        fetchData();
    }, []);
    const totalPages = Math.ceil(ownerData.length / rowsPerPage);

    return (
        <Layout role={role}>
            <div className='container-fluid row mt-4'>
                <div className="header-container">
                    <div className='topic'>
                        <h5><strong>Business Owner</strong></h5>
                    </div>
                    <div className="filter-container">
                    <span>
                        {/*<FontAwesomeIcon icon={faArrowsAltH} className="filter-icon"/>*/}
                        Filter by:</span>
                        <div className="search">
                            <Search/>
                        </div>
                        {/*<div className="selector-container">*/}
                        {/*    <select className="form-select custom-select" aria-label="Default select example">*/}
                        {/*        <option selected>Subscription Type</option>*/}
                        {/*        <option value="1">Monthly</option>*/}
                        {/*        <option value="2">Monthly</option>*/}
                        {/*    </select>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="table-container">
                    <Table data={ownerData}
                           columns={columns}
                           currentPage={currentPage}
                           rowsPerPage={rowsPerPage}
                           emptyMessage='business owners'
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

export default AdminBusinessOwner;