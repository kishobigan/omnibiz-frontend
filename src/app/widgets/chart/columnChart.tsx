'use client';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {getDatesInRange} from "@/app/utils/UtilFunctions/dateUtils";

const ApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ColumnChartProps {
    series: { name: string; data: number[] }[];
    earliestDate: Date;
}

export function ColumnChart({series, earliestDate}: ColumnChartProps) {
    const now = new Date()
    const dateRange = getDatesInRange(earliestDate, now);
    const options: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: {show: false},
            width: '100%',
            height: 'auto',
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
                borderRadius: 3,
            },
        },
        dataLabels: {enabled: false},
        stroke: {show: true, width: 2, colors: ['transparent']},
        xaxis: {
            categories: dateRange,
            title: {text: 'Date'},
            tickAmount: 11,
        },
        yaxis: {
            title: {text: 'Daily profit'},
        },
        fill: {opacity: 1},
        tooltip: {
            y: {
                formatter: (val: number) => `${val}`,
            },
        },
    };

    return (
        <div style={{width: '100%', height: '100%'}}>
            <ApexChart type="bar" options={options} series={series} height="100%" width="100%"/>
        </div>
    );
}