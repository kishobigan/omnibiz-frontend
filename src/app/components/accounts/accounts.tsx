"use client";
import React, {useEffect, useState} from "react";
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import Card from "@/app/widgets/card/card";
import api from "@/app/utils/Api/api";
import {useParams} from "next/navigation";
import {format, parseISO, isValid} from "date-fns";

interface AccountItem {
    description: string;
    dateAndTime: string;
    transaction_amount: number;
    balance: number;
    transaction_type: string;
}

const columns = [
    {key: "description", header: "Description"},
    {key: "transaction_amount", header: "Transaction Amount"},
    {key: "transaction_type", header: "Type"},
    {key: "balance", header: "Balance"},
];

function Accounts() {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 13;
    const [accountData, setAccountData] = useState<AccountItem[]>([]);
    const {business_id} = useParams();
    const [summaryData, setSummaryData] = useState([
        {title: "Total Income", cost: "0", percentage: ""},
        {title: "Total Expenses", cost: "0", percentage: ""},
        {title: "Total Profit", cost: "0", percentage: ""},
        {title: "Total Loss", cost: "0", percentage: ""},
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`cashbook/view-cashbook/${business_id}`);
                const data = response.data.map((item: any) => {
                    const transactionTime = item.transaction_time;
                    return {
                        ...item,
                        dateAndTime: transactionTime && isValid(parseISO(transactionTime)) ? parseISO(transactionTime) : null,
                    };
                });
                setAccountData(data);

                const totalIncome = data
                    .filter((item: AccountItem) => item.transaction_type === "income")
                    .reduce((sum: number, item: AccountItem) => sum + item.transaction_amount, 0);

                const totalExpenses = data
                    .filter((item: AccountItem) => item.transaction_type === "expense")
                    .reduce((sum: number, item: AccountItem) => sum + item.transaction_amount, 0);

                const totalProfit = totalIncome - totalExpenses;
                const totalLoss = totalProfit < 0 ? Math.abs(totalProfit) : 0;

                setSummaryData([
                    {title: "Total Income", cost: totalIncome, percentage: "5%"},
                    {title: "Total Expenses", cost: totalExpenses, percentage: "5%"},
                    {
                        title: "Total Profit",
                        cost: totalProfit > 0 ? totalProfit.toLocaleString() : "0",
                        percentage: "5%",
                    },
                    {
                        title: "Total Loss",
                        cost: totalLoss > 0 ? totalLoss.toLocaleString() : "0",
                        percentage: "5%",
                    },
                ]);
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
    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = startRow + rowsPerPage;
    const currentAccountData = accountData.slice(startRow, endRow).map((item) => ({
        ...item,
        dateAndTime: item.dateAndTime ? format(item.dateAndTime, "yyyy-MM-dd HH:mm:ss") : "",
    }));

    const cellRenderer = (columnKey: string, cellData: any, row: AccountItem) => {
        const cellStyle = {color: row.transaction_type === "income" ? "blue" : "red"};
        return <span style={cellStyle}>{cellData}</span>;
    };

    return (
        <div className="container-fluid">
            <h5 className="mt-5 mb-3">Welcome back!</h5>
            <div className="row justify-content-center">
                {summaryData.map((data, index) => (
                    <div className="col-12 col-md-6 col-lg-3 mb-3" key={index}>
                        <Card
                            className='cardWithBorderRadius shadow'
                            title={data.title}
                            body={
                                <div>
                                    <p>
                                        <b>{data.cost}</b>
                                    </p>
                                    <p>
                                        <b>{data.percentage}</b>
                                    </p>
                                </div>
                            }
                            color={'#ffffff'}
                        />
                    </div>
                ))}
            </div>
            <Table
                data={currentAccountData}
                columns={columns}
                cellRenderer={cellRenderer}
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


