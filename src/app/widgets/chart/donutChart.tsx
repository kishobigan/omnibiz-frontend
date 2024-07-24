'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import {ApexOptions} from 'apexcharts';
import './donutChart.css';

const ApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

interface DonutChartProps {
    series: number[];
}

const DonutChart: React.FC<DonutChartProps> = ({series}) => {
    const options: ApexOptions = {
        chart: {
            type: 'donut',
        },
        labels: ["Income", "Expenses", "Profit", "Lost"],
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <div className='chartContainer'>
            <ApexChart options={options} series={series} type="donut" height={300} width={400}/>
        </div>
    );
}

export default DonutChart;
