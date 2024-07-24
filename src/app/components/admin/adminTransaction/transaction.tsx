'use client'
import React, {useState} from 'react';
import Layout from "@/app/widgets/layout/layout";
import './adminTransaction.css'
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";

const Transaction: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const role = 'admin'

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
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className='container-fluid row vh-100'>
            <Layout role={role}>
                <div className="header-container">
                    <div className='topic'>
                        <h5><strong>Transactions</strong></h5>
                    </div>
                </div>
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
            </Layout>
        </div>
    );
};

export default Transaction;