'use client'
import React, {useEffect, useState} from 'react';
import Layout from "@/app/widgets/layout/layout";
import './adminBusinessOwner.css'
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import api from "@/app/utils/Api/api";
import SearchBar from "@/app/widgets/searchBar/searchBar";
import Notification from "@/app/widgets/notification/notification";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock, faUnlock} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import ConfirmationDialog from "@/app/widgets/confirmationDialog/confirmationDialog";

interface Owner {
    user_id: string;
    owner_name: string;
    business_names: string;
    business_count: number;
    phone_number: string;
    is_active: boolean;
    subscription_amount: number;
}

const AdminBusinessOwner: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [ownerData, setOwnerData] = useState<Owner[]>([]);
    const [filteredOwnerData, setFilteredOwnerData] = useState<Owner[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [actionType, setActionType] = useState<'block' | 'unblock'>('unblock')
    const [update, setUpdate] = useState<boolean>(false)
    const role = 'admin';
    const token = Cookies.get(ACCESS_TOKEN) || '';
    const business_id = '72y3r1p5';

    const columns = [
        {key: 'owner_name', header: 'Owner name'},
        {key: 'business_names', header: 'Business names'},
        {key: 'business_count', header: 'Business count'},
        {key: 'phone_number', header: 'Phone number'},
        {key: 'subscription_amount', header: 'Subscription amount'},
        {key: 'action', header: 'Actions'},
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/super/get-owners');
                const businessOwnersData = response.data.map((item: any) => ({
                    user_id: item.user_id,
                    owner_name: item.owner_name,
                    business_names: item.businesses.map((business: any) => business.business_name).join(', '),
                    business_count: item.business_count,
                    is_active: item.is_active,
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
    }, [update]);

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

    const handleLockClick = (owner: Owner, action: 'block' | 'unblock') => {
        setSelectedOwner(owner);
        setActionType(action);
        setShowDialog(true);
    };

    const handleConfirmAction = async () => {
        if (selectedOwner) {
            try {
                const endpoint = `auth/owner-action/${selectedOwner.user_id}`;
                const action = actionType === 'block' ? 'block' : 'unblock';
                const response = await api.put(endpoint, {action: action}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    console.log("business owner block or unblock successfully!")
                } else if (response.status === 404) {
                    console.log("Page not found.")
                } else {
                    console.log("Oops! something went wrong")
                }
                setUpdate(!update);
                console.log('user id is ', selectedOwner.user_id)
            } catch (error) {
                console.log('user id is ', selectedOwner.user_id)
                console.error(`Error ${actionType === 'block' ? 'blocking' : 'unblocking'} owner:`, error);
            } finally {
                setShowDialog(false);
                setSelectedOwner(null);
            }
        }
    };

    const actions = [
        {
            icon: (row: Owner) => (
                <FontAwesomeIcon
                    icon={row.is_active ? faUnlock : faLock}
                    style={{color: row.is_active ? 'blue' : 'red'}}
                />
            ),
            onClick: (row: Owner) => handleLockClick(row, row.is_active ? 'block' : 'unblock')
        }
    ];
    const totalPages = Math.ceil(filteredOwnerData.length / rowsPerPage);

    return (
        <Layout role={role} business_id={business_id}>
            <div className='container-fluid row mt-4'>
                <div className="header-container">
                    <div className='topic'>
                        <h5><strong>Business Owner</strong></h5>
                    </div>
                    <Notification business_id={business_id} token={token}/>
                    <div className="filter-container">
                        <div className="search">
                            <SearchBar searchText={searchText} setSearchText={setSearchText}/>
                        </div>
                    </div>
                </div>
                <div className="table-container">
                    <Table data={filteredOwnerData}
                           columns={columns}
                           actions={actions}
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
            <ConfirmationDialog
                show={showDialog}
                onHide={() => setShowDialog(false)}
                onConfirm={handleConfirmAction}
                message={`Are you sure you want to ${actionType} this business owner?`}
            />
        </Layout>
    );
};

export default AdminBusinessOwner;