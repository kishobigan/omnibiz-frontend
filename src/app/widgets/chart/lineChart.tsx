'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {getDatesInRange} from "@/app/utils/UtilFunctions/dateUtils";

const ApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface SeriesData {
    name: string;
    data: number[];
}

interface LineChartProps {
    series: SeriesData[];
    earliestDate: Date;
}

const LineChart: React.FC<LineChartProps> = ({series, earliestDate}) => {
    const now = new Date();
    const dateRange = getDatesInRange(earliestDate, now);

    const options: ApexOptions = {
        chart: {
            type: 'area',
            toolbar: {show: false},
            width: '100%',
            height: 'auto',
        },
        colors: ['#0000FF', '#FF3131', '#0BDA51'],
        dataLabels: {enabled: false},
        stroke: {curve: 'smooth'},
        xaxis: {
            categories: dateRange,
            title: {text: 'Date'},
            tickAmount: 11,
        },
        yaxis: {
            title: {text: 'Amount'},
        }
    };

    return (
        <div style={{width: '100%', height: '100%'}}>
            <ApexChart options={options} series={series} type="line" height="100%" width="100%"/>
        </div>
    );
};

export default LineChart;

