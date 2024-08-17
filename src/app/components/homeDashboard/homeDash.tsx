// 'use client';
// import React from 'react';
// import {ColumnChart} from "@/app/widgets/chart/columnChart";
// import LineChart from "@/app/widgets/chart/lineChart";
// import Card2 from "@/app/widgets/Card2/Card2";
// import "./homeDash.css"
//
// function HomeDash() {
//     const seriesBar = [
//         {
//             name: 'Daily Sales',
//             data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70],
//         },
//     ];
//     const seriesLine = [
//         {
//             name: 'Income',
//             data: [31, 40, 28, 51, 42, 109, 100, 125, 68, 74]
//         },
//         {
//             name: 'Expenses',
//             data: [11, 32, 45, 32, 34, 52, 41, 64, 85, 95]
//         },
//         {
//             name: 'Profit',
//             data: [8, 24, 34, 45, 21, 39, 30, 42, 44, 98]
//         }
//     ];
//
//     return (
//         <div className='container-fluid text-center d-flex flex-column'>
//             <div className='row'>
//                 <div className='col-md-3 col-sm-6'>
//                     <Card2
//                         title="Today Sales"
//                         text="Rs. 12,000.00"
//                     />
//                 </div>
//                 <div className='col-md-3 col-sm-6'>
//                     <Card2
//                         title="Incomes"
//                         text="Rs. 8,000.00"
//                     />
//                 </div>
//                 <div className='col-md-3 col-sm-6'>
//                     <Card2
//                         title="Expenses"
//                         text="Rs. 3,000.00"
//                     />
//                 </div>
//                 <div className='col-md-3 col-sm-6'>
//                     <Card2
//                         title="Profit"
//                         text="Rs. 4,000.00"
//                     />
//                 </div>
//             </div>
//             <div className='row flex-grow-1 mt-5'>
//                 <div className='col-md-6 d-flex flex-column align-items-center bg-primary'>
//                     <p className='fs-5 mb-1'>Daily Sales</p>
//                     <ColumnChart series={seriesBar}/>
//                 </div>
//                 <div className='col-md-6 d-flex flex-column align-items-center bg-success'>
//                     <p className='fs-5 mb-1'>Financial Metrics</p>
//                     <LineChart series={seriesLine}/>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default HomeDash;

'use client';
import React from 'react';
import {ColumnChart} from "@/app/widgets/chart/columnChart";
import LineChart from "@/app/widgets/chart/lineChart";
import Card2 from "@/app/widgets/Card2/Card2";
import "./homeDash.css";

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
            data: [31, 40, 28, 51, 42, 109, 100, 125, 68, 74],
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

    return (
        <div className='container-fluid text-center d-flex flex-column'>
            <div className='row'>
                <div className='col-md-3 col-sm-6'>
                    <Card2 title="Today Sales" text="Rs. 12,000.00"/>
                </div>
                <div className='col-md-3 col-sm-6'>
                    <Card2 title="Incomes" text="Rs. 8,000.00"/>
                </div>
                <div className='col-md-3 col-sm-6'>
                    <Card2 title="Expenses" text="Rs. 3,000.00"/>
                </div>
                <div className='col-md-3 col-sm-6'>
                    <Card2 title="Profit" text="Rs. 4,000.00"/>
                </div>
            </div>
            <div className='row flex-grow-1 mt-5 justify-content-center'>
                <div className='col-md-5 d-flex flex-column align-items-center bg-white me-5'>
                    <p className='fs-5 mb-1'>Daily Sales</p>
                    <div className="chart-container">
                        <ColumnChart series={seriesBar}/>
                    </div>
                </div>
                <div className='col-md-5 d-flex flex-column align-items-center bg-white'>
                    <p className='fs-5 mb-1'>Financial Metrics</p>
                    <div className="chart-container">
                        <LineChart series={seriesLine}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeDash;
