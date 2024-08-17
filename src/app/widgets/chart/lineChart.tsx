// 'use client';
// import React from 'react';
// import dynamic from 'next/dynamic';
// import {ApexOptions} from 'apexcharts';
// import {getLast10Days} from "@/app/utils/DateUtils/dateUtils";
//
// const ApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});
//
// interface SeriesData {
//     name: string;
//     data: number[];
// }
//
// interface LineChartProps {
//     series: SeriesData[];
// }
//
// const LineChart: React.FC<LineChartProps> = ({series}) => {
//     const last10Days = getLast10Days();
//     const options: ApexOptions = {
//         chart: {
//             height: 200,
//             type: 'area',
//             toolbar: {
//                 show: false,
//             }
//         },
//         dataLabels: {
//             enabled: false
//         },
//         stroke: {
//             curve: 'smooth'
//         },
//         xaxis: {
//             categories: last10Days,
//             title: {
//                 text: 'Last 10 Days',
//             },
//         },
//     };
//
//     return (
//         <div>
//             <ApexChart options={options} series={series} type="line" height={250} width={500}/>
//         </div>
//     );
// };
//
// export default LineChart;

'use client';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {getLast10Days} from "@/app/utils/DateUtils/dateUtils";

const ApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface SeriesData {
    name: string;
    data: number[];
}

interface LineChartProps {
    series: SeriesData[];
}

const LineChart: React.FC<LineChartProps> = ({series}) => {
    const last10Days = getLast10Days();
    const options: ApexOptions = {
        chart: {
            type: 'area',
            toolbar: {show: false},
            width: '100%',
            height: 'auto',
        },
        dataLabels: {enabled: false},
        stroke: {curve: 'smooth'},
        xaxis: {
            categories: last10Days,
            title: {text: 'Last 10 Days'},
        },
    };

    return (
        <div style={{width: '100%', height: '100%'}}>
            <ApexChart options={options} series={series} type="line" height="100%" width="100%"/>
        </div>
    );
};

export default LineChart;
