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
    const [searchText, setSearchText] = useState<string>("");
    const rowsPerPage = 10;
    const role = 'admin'
    const token = Cookies.get(ACCESS_TOKEN) || '';
    const business_id = '72y3r1p5'

    const columns = [
        {key: 'owner', header: 'Owner ID'},
        {key: 'business', header: 'Business ID'},
        {key: 'amount', header: 'Amount'},
        {key: 'date', header: 'Date & Time'},
    ];

    useEffect(() => {
        const fetchTransactionData = async () => {
            try {
                const response = await api.get('payment/list-subscriptions');
                const transactionData = response.data.map((item: any) => ({
                    owner: item.owner,
                    business: item.business,
                    amount: item.amount,
                    date: item.created_at,
                }));
                setTransactionData(transactionData);
                setFilteredTransactionData(transactionData);
            } catch (error) {
                console.error('Error fetching transaction data:', error);
            }
        };

        fetchTransactionData();
    }, [update]);

    // useEffect(() => {
    //     filterOwners(searchText);
    // }, [searchText, transactionData]);

    // const filterOwners = (text: string) => {
    //     const filtered = transactionData.filter(owner =>
    //         owner.owner.toLowerCase().includes(text.toLowerCase()) ||
    //         owner.business.toLowerCase().includes(text.toLowerCase()) ||
    //         owner.phone_number.includes(text) ||
    //         owner.business_count.toString().includes(text) ||
    //         owner.subscription_amount.toString().includes(text)
    //     );
    //     setFilteredTransactionData(filtered);
    // };

    const totalPages = Math.ceil(transactionData.length / rowsPerPage);

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
                    <Table data={transactionData}
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