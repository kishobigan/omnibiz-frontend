"use client";
import React, {useEffect, useState} from "react";
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import Card from "@/app/widgets/card/card";
import api from "@/app/utils/Api/api";
import {useParams} from "next/navigation";
import {format, parseISO, isValid} from "date-fns";
import "./accounts.css"

interface AccountItem {
    description: string;
    dateAndTime: Date | null;
    debit: number;
    credit: number;
    balance: number;
}

const columns = [
    {key: "description", header: "Description"},
    // {key: "dateAndTime", header: "Date & Time"},
    {key: "transaction_amount", header: "Transaction Amount"},
    {key: "transaction_type", header: "Type"},
    {key: "balance", header: "Balance"},
];

function Accounts() {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [accountData, setAccountData] = useState<AccountItem[]>([]);
    const {business_id} = useParams();

    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = startRow + rowsPerPage;
    const currentData = accountData.slice(startRow, endRow).map((item) => ({
        ...item,
        dateAndTime: item.dateAndTime ? format(item.dateAndTime, "yyyy-MM-dd HH:mm:ss") : "",
    }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`cashbook/view-cashbook/${business_id}`);
                const data = response.data.map((item: any) => {
                    const transactionTime = item.transaction_time;
                    // if (!transactionTime) {
                    //     console.error("Missing transaction_time for item:", item);
                    // }
                    return {
                        ...item,
                        dateAndTime: transactionTime && isValid(parseISO(transactionTime)) ? parseISO(transactionTime) : null,
                    };
                });
                setAccountData(data);
                console.log("Accounts data:", data);
            } catch (error) {
                console.error("Error fetching account data:", error);
            }
        };

        fetchData();
    }, [business_id]);

    const totalPages = Math.ceil(accountData.length / rowsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const data = [
        {
            title: "Total Income",
            cost: "12,000",
            percentage: "5%",
            color: "#4fe399",
            className: "card-income"
        },
        {
            title: "Total Expenses",
            cost: "12,000",
            percentage: "5%",
            color: "#B7B7B7",
            className: "card-expenses"
        },
        {
            title: "Total Profit",
            cost: "12,000",
            percentage: "5%",
            color: "#b699c2",
            className: "card-profit"
        },
        {
            title: "Total Loss",
            cost: "12,000",
            percentage: "5%",
            color: "#f5f77e",
            className: "card-loss"
        },
    ];

    return (
        <div className="container-fluid">
            <h5 className="mt-5 mb-3">Welcome back!</h5>
            {/*<p className="mb-3" style={{color: "gray"}}>*/}
            {/*    1 April 2024*/}
            {/*</p>*/}
            <div className="row justify-content-center">
                {data.map((data, index) => (
                    <div className="col-12 col-md-6 col-lg-3 mb-3" key={index}>
                        <Card
                            title={data.title}
                            body={
                                <div>
                                    <p>
                                        <b> {data.cost}</b>
                                    </p>
                                    <p>
                                        <b>{data.percentage}</b>
                                    </p>
                                </div>
                            }
                            className={data.className}
                        />
                    </div>
                ))}
            </div>
            <Table
                data={currentData}
                columns={columns}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                emptyMessage="accounts"
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default Accounts;


