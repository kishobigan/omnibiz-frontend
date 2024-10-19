'use client';
import React, {useEffect, useState} from 'react';
import {ColumnChart} from "@/app/widgets/chart/columnChart";
import LineChart from "@/app/widgets/chart/lineChart";
import Card2 from "@/app/widgets/Card2/Card2";
import "./homeDash.css";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import Notification from "@/app/widgets/notification/notification";
import api from "@/app/utils/Api/api";
import {formatCurrency} from "@/app/utils/UtilFunctions/formatCurrency";

interface Transaction {
    cash_book_data: {
        transaction_type: string;
        transaction_amount: number;
        transaction_time: string;
    }[];
}

function HomeDash() {
    const [overallData, setOverallData] = useState({income: 0, expense: 0, profit: 0});
    const [dailyData, setDailyData] = useState<{ income: number[], expense: number[], profit: number[] }>({
        income: [],
        expense: [],
        profit: []
    });
    const [earliestDate, setEarliestDate] = useState<Date>();
    const token = Cookies.get(ACCESS_TOKEN) || '';
    const business_id = '72y3r1p5';

    useEffect(() => {
        const fetchTransactionData = async () => {
            try {
                const response = await api.get(`transaction/owner-accounts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (response.status === 200) {
                    const transactions: Transaction[] = response.data;
                    if (transactions.length === 0) {
                        console.log("No transactions available.");
                        return;
                    }

                    const parseDate = (dateString: string) => new Date(dateString);
                    const allTransactionDates = transactions.flatMap(transaction =>
                        transaction.cash_book_data.map(t => parseDate(t.transaction_time))
                    );

                    const earliestDateValue = new Date(Math.min(...allTransactionDates.map(date => date.getTime())));
                    setEarliestDate(earliestDateValue);
                    const latestDate = new Date(Math.max(...allTransactionDates.map(date => date.getTime())));
                    const totalDays = Math.ceil((latestDate.getTime() - earliestDateValue.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    const dailyIncome: number[] = Array(totalDays).fill(0);
                    const dailyExpense: number[] = Array(totalDays).fill(0);

                    allTransactionDates.forEach((date, index) => {
                        const dayIndex = Math.floor((date.getTime() - earliestDateValue.getTime()) / (1000 * 60 * 60 * 24));
                        const transaction = transactions.flatMap(t => t.cash_book_data)[index];
                        if (transaction.transaction_type === 'income') {
                            dailyIncome[dayIndex] += transaction.transaction_amount;
                        } else if (transaction.transaction_type === 'expense') {
                            dailyExpense[dayIndex] += transaction.transaction_amount;
                        }
                    });
                    const dailyProfit = dailyIncome.map((income, index) => income - dailyExpense[index]);

                    setDailyData({
                        income: dailyIncome,
                        expense: dailyExpense,
                        profit: dailyProfit,
                    });

                    const totalIncome = dailyIncome.reduce((acc, curr) => acc + curr, 0);
                    const totalExpense = dailyExpense.reduce((acc, curr) => acc + curr, 0);
                    const totalProfit = dailyProfit.reduce((acc, curr) => acc + curr, 0);

                    setOverallData({
                        income: totalIncome,
                        expense: totalExpense,
                        profit: totalProfit,
                    });
                } else {
                    console.error("Failed to fetch transactions:", response);
                }
            } catch (error) {
                console.error("An error occurred while fetching transaction data:", error);
            }
        };

        fetchTransactionData();
    }, [token]);

    useEffect(() => {
    }, [earliestDate]);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8001/ws/owner-dashboard/${business_id}/?token=${token}`);

        socket.onopen = () => {
            console.log("WebSocket connection opened");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setOverallData(prevData => ({
                income: prevData.income + data.total_income,
                expense: prevData.expense + data.total_expense,
                profit: prevData.income + data.total_income - (prevData.expense + data.total_expense),
            }));
            console.log("WebSocket graph data", data);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        socket.onerror = (error) => {
            console.error("WebSocket error", error);
        };

        return () => {
            socket.close();
        };
    }, [token]);

    const seriesBar = [
        {
            name: 'Daily Profit',
            data: dailyData.profit,
        },
    ];

    return (
        <div className='container-fluid text-center d-flex flex-column'>
            <div className=''>
                <Notification business_id={business_id} token={token}/>
            </div>
            <div className='row'>
                <div className='col-md-3 col-sm-6'>
                    <Card2 title="Overall income" text={`Rs. ${formatCurrency(overallData.income)}`}/>
                </div>
                <div className='col-md-3 col-sm-6'>
                    <Card2 title="Overall expense" text={`Rs. ${formatCurrency(overallData.expense)}`}/>
                </div>
                <div className='col-md-3 col-sm-6'>
                    <Card2 title="Overall profit" text={`Rs. ${formatCurrency(overallData.profit)}`}/>
                </div>
                <div className='col-md-3 col-sm-6'>
                    <Card2 title="Today sales" text="Rs. 12,000.00"/>
                </div>
            </div>
            <div className='row flex-grow-1 mt-5 justify-content-center'>
                <div className='col-md-5 d-flex flex-column align-items-center bg-white me-5'>
                    <p className='fs-5 mb-1'>Daily Profit</p>
                    <div className="chart-container">
                        <ColumnChart series={seriesBar} earliestDate={earliestDate || new Date()}/>
                    </div>
                </div>
                <div className='col-md-5 d-flex flex-column align-items-center bg-white'>
                    <p className='fs-5 mb-1'>Financial Metrics</p>
                    <div className="chart-container">
                        <LineChart series={[
                            {name: 'Income', data: dailyData.income},
                            {name: 'Expense', data: dailyData.expense},
                            {name: 'Profit', data: dailyData.profit},
                        ]} earliestDate={earliestDate || new Date()}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeDash;