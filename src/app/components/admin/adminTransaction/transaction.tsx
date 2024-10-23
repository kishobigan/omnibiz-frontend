'use client'
import React, {useEffect, useState} from 'react';
import Layout from "@/app/widgets/layout/layout";
import './adminTransaction.css'
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import api from "@/app/utils/Api/api";
import Notification from "@/app/widgets/notification/notification";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";

const Transaction: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [update, setUpdate] = useState<boolean>(false)
    const [transactionData, setTransactionData] = useState([])
    const [filteredTransactionData, setFilteredTransactionData] = useState([])
    const rowsPerPage = 10;
    const role = 'admin'
    const token = Cookies.get(ACCESS_TOKEN) || '';
    const business_id = '72y3r1p5'

    const columns = [
        {key: 'id', header: 'Id'},
        {key: 'owner', header: 'Business Owner'},
        {key: 'description', header: 'Description'},
        {key: 'date', header: 'Date & Time'},
        {key: 'debit', header: 'Debit'},
    ];

    const data = [
        {id: 1, owner: 'John Doe', description: 'Lorem ipsum dolor sit amet', date: '2024-06-03 10:00:00', debit: 100},
        {
            id: 2,
            owner: 'Jane Smith',
            description: 'Consectetur adipiscing elit',
            date: '2024-06-04 12:30:00',
            debit: 150
        },
        {
            id: 3,
            owner: 'Alice Johnson',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            date: '2024-06-05 15:45:00',
            debit: 200
        },
        {id: 4, owner: 'Bob Brown', description: 'Ut enim ad minim veniam', date: '2024-06-06 09:20:00', debit: 120},
        {
            id: 5,
            owner: 'Alice Johnson',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            date: '2024-06-05 15:45:00',
            debit: 200
        },
        {
            id: 6,
            owner: 'Alice Johnson',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            date: '2024-06-05 15:45:00',
            debit: 200
        },
        {
            id: 7,
            owner: 'Alice Johnson',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            date: '2024-06-05 15:45:00',
            debit: 200
        },
        {
            id: 8,
            owner: 'Alice Johnson',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            date: '2024-06-05 15:45:00',
            debit: 200
        },
        {
            id: 3,
            owner: 'Alice Johnson',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            date: '2024-06-05 15:45:00',
            debit: 200
        },
        {
            id: 3,
            owner: 'Alice Johnson',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            date: '2024-06-05 15:45:00',
            debit: 200
        },
    ];

    useEffect(() => {
        const fetchTransactionData = async () => {
            try {
                const response = await api.get('payment/list-subscriptions');
                const transactionData = response.data.map((item: any) => ({
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
                setTransactionData(transactionData);
                setFilteredTransactionData(transactionData);
            } catch (error) {
                console.error('Error fetching transaction data:', error);
            }
        };

        fetchTransactionData();
    }, [update]);

    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <Layout role={role} business_id={business_id}>
            <div className='container-fluid row mt-2'>
                <div className="header-container">
                    <div className='topic'>
                        <h5><strong>Transactions</strong></h5>
                    </div>
                </div>
                <Notification business_id={business_id} token={token}/>
                <div className="table-container">
                    <Table data={data}
                           columns={columns}
                           currentPage={currentPage}
                           rowsPerPage={rowsPerPage}
                           emptyMessage='transactions'
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

export default Transaction;