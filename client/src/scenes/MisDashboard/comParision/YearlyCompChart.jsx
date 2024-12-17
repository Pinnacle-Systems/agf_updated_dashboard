import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import { useGetYearlyCompQuery } from '../../../redux/service/misDashboardService';
import { HiOutlineRefresh } from 'react-icons/hi';

// Initialize 3D module
Highcharts3D(Highcharts);

const YearlyComChart = () => {
    const { data: comparisionData, refetch } = useGetYearlyCompQuery({ params: {} });
    const yearlyComparision = comparisionData?.data || [];

    const groupedData = yearlyComparision.reduce((acc, curr) => {
        if (!acc[curr.year]) {
            acc[curr.year] = [];
        }
        acc[curr.year].push(curr);
        return acc;
    }, {});

    const years = Object.keys(groupedData);
    const categories = [...new Set(yearlyComparision.map(order => order.customer))];

    const series = years.flatMap(year => [
        {
            name: ` Male`,
            data: categories.map(customer => {
                const order = groupedData[year].find(o => o.customer === customer);
                return order ? order.male : 0;
            }),
            color: '#DE9A07',
        },
        {
            name: ` Female`,
            data: categories.map(customer => {
                const order = groupedData[year].find(o => o.customer === customer);
                return order ? order.female : 0;
            }),
            color: '#1F2937',
        },
    ]);

    const options = {
        chart: {
            type: 'column',
            height: 360,
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 10,
                depth: 40,
                viewDistance: 30,
            },
            backgroundColor: '#FFFFFF',
        },
        title: {
            text: 'Yearly Employee Distribution',
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#374151',
            },
        },
        xAxis: {
            categories: categories,
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#6B7280',
                },
            },
        },
        yAxis: {
            title: {
                text: 'Number of Employees',
                style: {
                    fontSize: '14px',
                    color: '#374151',
                },
            },
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#9CA3AF',
                },
            },
        },
        tooltip: {
            shared: true,
            useHTML: true,
            backgroundColor: '#FFFFFF',
            borderColor: '#D1D5DB',
            shadow: true,
            style: {
                color: '#374151',
                fontSize: '12px',
            },
            formatter: function () {
                return `
                    <b>Company: ${this.x}</b><br/>
                    ${this.points.map(
                        point => `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b><br/>`
                    ).join('')}
                `;
            },
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                depth: 40,
                pointWidth: 15,
                borderRadius: 5,
            },
        },
        series: series,
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-end mb-3">
                <HiOutlineRefresh
                    onClick={refetch}
                    className="text-gray-500 hover:text-blue-500 cursor-pointer text-2xl"
                />
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                containerProps={{ style: { minWidth: '100%', minHeight: '400px' } }}
            />
        </div>
    );
};

export default YearlyComChart;
