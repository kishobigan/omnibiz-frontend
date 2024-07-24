'use client';
import React from 'react';
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
            height: 350,
            type: 'area',
            toolbar: {
                show: false,
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: last10Days,
            title: {
                text: 'Last 10 Days',
            },
        },
    };

    return (
        <div>
            <ApexChart options={options} series={series} type="area" height={350} width={600}/>
        </div>
    );
};

export default LineChart;
