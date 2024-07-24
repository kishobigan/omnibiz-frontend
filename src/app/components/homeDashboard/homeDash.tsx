'use client'
import React from 'react';
import {ColumnChart} from "@/app/widgets/chart/columnChart";
import LineChart from "@/app/widgets/chart/lineChart";
import DonutChart from "@/app/widgets/chart/donutChart";
import Card2 from "@/app/widgets/Card2/Card2";

function HomeDash() {
    const seriesBar = [
        {
            name: 'Daily Sales',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70],
        },
    ];
    const seriesLine = [
        {
            name: 'Income',
            data: [31, 40, 28, 51, 42, 109, 100, 125, 68, 74]
        },
        {
            name: 'Expenses',
            data: [11, 32, 45, 32, 34, 52, 41, 64, 85, 95]
        },
        {
            name: 'Profit',
            data: [8, 24, 34, 45, 21, 39, 30, 42, 44, 98]
        }
    ];
    const donutSeries = [44, 55, 41, 24];

    return (
        <div className='container-fluid text-center vh-100'>
            <div className='row h-50'>
                <div className='col-sm-6'>
                    <p className='fs-5'>Daily Sales</p>
                    <ColumnChart series={seriesBar}/>
                </div>
                <div className='col-sm-6'>
                    <p className='fs-5'>Financial Metrics</p>
                    <LineChart series={seriesLine}/>
                </div>
            </div>
            <div className='row h-50'>
                <div className='col-sm-6 bg-bg-info'>
                    <div className="row row-cols-1 row-cols-md-2 ">
                        <div className='col-sm-6'>
                            <Card2
                                title="Today Sales"
                                text="Rs. 12,000.00"
                            />
                        </div>
                        <div className='col-sm-6'>
                            <Card2
                                title="Incomes"
                                text="Rs. 8,000.00"
                            />
                        </div>
                        <div className='col-sm-6'>
                            <Card2
                                title="Expenses"
                                text="Rs. 3,000.00"
                            />
                        </div>
                        <div className='col-sm-6'>
                            <Card2
                                title="Profit"
                                text="Rs. 4,000.00"
                            />
                        </div>
                    </div>
                </div>
                <div className='col-sm-6'>
                    <p className='fs-5 mb-2'>Weekly Analysis</p>
                    <DonutChart series={donutSeries}/>
                </div>
            </div>
        </div>
    );
}

export default HomeDash;


