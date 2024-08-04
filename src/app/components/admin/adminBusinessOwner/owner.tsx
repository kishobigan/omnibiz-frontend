'use client'
import React, {useEffect, useState} from 'react';
import Layout from "@/app/widgets/layout/layout";
import './adminBusinessOwner.css'
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import api from "@/app/utils/Api/api";
import SearchBar from "@/app/widgets/searchBar/searchBar";
import Notification from "@/app/widgets/notification/notification";

interface Owner {
    owner_name: string;
    business_names: string;
    business_count: number;
    phone_number: string;
    subscription_amount: number;
}

const AdminBusinessOwner: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [ownerData, setOwnerData] = useState<Owner[]>([]);
    const [filteredOwnerData, setFilteredOwnerData] = useState<Owner[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const role = 'admin';

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
                setFilteredOwnerData(businessOwnersData);
                console.log("business owners data", response.data);
                console.log("business owners data", businessOwnersData);
            } catch (error) {
                console.log("Error in fetching business owners data", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        filterOwners(searchText);
    }, [searchText, ownerData]);

    const filterOwners = (text: string) => {
        const filtered = ownerData.filter(owner =>
            owner.owner_name.toLowerCase().includes(text.toLowerCase()) ||
            owner.business_names.toLowerCase().includes(text.toLowerCase()) ||
            owner.phone_number.includes(text) ||
            owner.business_count.toString().includes(text) ||
            owner.subscription_amount.toString().includes(text)
        );
        setFilteredOwnerData(filtered);
    };

    const totalPages = Math.ceil(filteredOwnerData.length / rowsPerPage);

    return (
        <Layout role={role}>
            <div className='container-fluid row mt-4'>
                <div className="header-container">
                    <div className='topic'>
                        <h5><strong>Business Owner</strong></h5>
                    </div>
                    <Notification/>
                    <div className="filter-container">
                        <div className="search">
                            <SearchBar searchText={searchText} setSearchText={setSearchText} />
                        </div>
                    </div>
                </div>
                <div className="table-container">
                    <Table data={filteredOwnerData}
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
