'use client';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import {getLast10Days} from "@/app/utils/DateUtils/dateUtils";

const ApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface ColumnChartProps {
    series: { name: string; data: number[] }[];
}

export function ColumnChart({series}: ColumnChartProps) {
    const last10Days = getLast10Days();
    const options: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
                borderRadius: 5,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: last10Days,
            title: {
                text: 'Last 10 Days',
            }
        },
        yaxis: {
            title: {
                text: 'Daily Sales',
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return `${val}`;
                },
            },
        },
    };

    return (
        <div>
            <ApexChart type="bar" options={options} series={series} height={350} width={600}/>
        </div>
    );
}
