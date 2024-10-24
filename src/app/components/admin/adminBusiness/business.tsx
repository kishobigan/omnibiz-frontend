'use client';
import React, {useEffect, useState} from 'react';
import Layout from "@/app/widgets/layout/layout";
import './adminBusiness.css';
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import api from "@/app/utils/Api/api";
import SearchBar from "@/app/widgets/searchBar/searchBar";
import ConfirmationDialog from "@/app/widgets/confirmationDialog/confirmationDialog";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock, faUnlock} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import Notification from "@/app/widgets/notification/notification";

interface Business {
    business_id: string;
    business_name: string;
    business_address: string;
    owner: string;
    phone_number: string;
    subscription_count: number;
    subscription_trial_ended_at: string;
    blocked: boolean;
    is_active: boolean;
}

const AdminBusiness: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [businessData, setBusinessData] = useState<Business[]>([]);
    const [filteredBusinessData, setFilteredBusinessData] = useState<Business[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [showDialog, setShowDialog] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [actionType, setActionType] = useState<'block' | 'unblock'>('unblock');
    const [update, setUpdate] = useState<boolean>(false);
    const rowsPerPage = 10;
    const role = 'admin';
    const token = Cookies.get(ACCESS_TOKEN) || '';
    const business_id = '72y3r1p5'

    const columns = [
        {key: 'business_name', header: 'Business name'},
        {key: 'business_address', header: 'Address'},
        {key: 'owner', header: 'Owner name'},
        {key: 'phone_number', header: 'Phone number'},
        {key: 'subscription_count', header: 'Subscription count'},
        {key: 'subscription_trial_ended_at', header: 'Trial end'},
        {key: 'action', header: 'Actions'},
    ];

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const response = await api.get('/super/get-businesses');
                const businessData = response.data.map((item: any) => ({
                    business_id: item.business_id,
                    business_name: item.business_name,
                    business_address: item.business_address,
                    owner: item.owner[0].owner,
                    phone_number: item.phone_number,
                    subscription_count: item.subscription_count,
                    subscription_trial_ended_at: new Date(item.subscription_trial_ended_at).toLocaleDateString('en-GB'),
                    blocked: item.blocked,
                    is_active: item.is_active
                }));
                setBusinessData(businessData);
                setFilteredBusinessData(businessData);
            } catch (error) {
                console.error('Error fetching business data:', error);
            }
        };

        fetchBusinessData();
    }, [update]);

    useEffect(() => {
        filterBusinesses(searchText);
    }, [searchText, businessData]);

    const filterBusinesses = (text: string) => {
        const filtered = businessData.filter(business =>
            business.business_name.toLowerCase().includes(text.toLowerCase()) ||
            business.business_address.toLowerCase().includes(text.toLowerCase()) ||
            business.owner.toLowerCase().includes(text.toLowerCase()) ||
            business.phone_number.includes(text) ||
            business.subscription_count.toString().includes(text) ||
            business.subscription_trial_ended_at.includes(text)
        );
        setFilteredBusinessData(filtered);
    };

    const handleLockClick = (business: Business, action: 'block' | 'unblock') => {
        setSelectedBusiness(business);
        setActionType(action);
        setShowDialog(true);
    };

    const handleConfirmAction = async () => {
        if (selectedBusiness) {
            try {
                const endpoint = actionType === 'block'
                    ? `/business/action-business/block/${selectedBusiness.business_id}`
                    : `/business/action-business/unblock/${selectedBusiness.business_id}`;

                await api.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setUpdate(prev => !prev)
            } catch (error) {
                console.error(`Error ${actionType === 'block' ? 'blocking' : 'unblocking'} business:`, error);
            } finally {
                setShowDialog(false);
                setSelectedBusiness(null);
            }
        }
    };

    const actions = [
        {
            icon: (row: Business) => (
                <FontAwesomeIcon
                    icon={row.is_active ? faUnlock : faLock}
                    style={{color: row.is_active ? 'blue' : 'red'}}
                    size="lg"
                />
            ),
            onClick: (row: Business) => handleLockClick(row, row.is_active ? 'block' : 'unblock')
        }
    ];

    const totalPages = Math.ceil(filteredBusinessData.length / rowsPerPage);

    return (
        <Layout role={role} business_id={business_id}>
            <div className='container-fluid row mt-2'>
                <div className="">
                    <div className='topic'>
                        <h5><strong>Business</strong></h5>
                    </div>
                    <Notification business_id={business_id} token={token}/>
                    <div className="filter-container">
                        <div className="search">
                            <SearchBar searchText={searchText} setSearchText={setSearchText}/>
                        </div>
                    </div>
                </div>
                <div className="table-container mt-5">
                    <Table
                        data={filteredBusinessData}
                        columns={columns}
                        actions={actions}
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
            <ConfirmationDialog
                show={showDialog}
                onHide={() => setShowDialog(false)}
                onConfirm={handleConfirmAction}
                message={`Are you sure you want to ${actionType} this business?`}
            />
        </Layout>
    );
};

export default AdminBusiness;

