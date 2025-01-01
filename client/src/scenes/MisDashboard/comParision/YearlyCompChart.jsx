import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import { useGetYearlyCompQuery } from '../../../redux/service/misDashboardService';
import { ColorContext } from '../../global/context/ColorContext';
import { useContext } from "react";
import CardWrapper from '../../../components/CardWrapper';

Highcharts3D(Highcharts);

const YearlyComChart = () => {
    const { data: comparisionData } = useGetYearlyCompQuery({ params: {} });
    const { color } = useContext(ColorContext);
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
            name: 'Male',
            data: categories.map(customer => {
                const order = groupedData[year]?.find(o => o.customer === customer);
                return order ? order.male : 0;
            }),
            color: color ? color : '#DE9A07',
        },

        {
            name: 'Female',
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
        title: null,
        xAxis: {
            categories: categories,
            labels: {
                rotation: 90,
                align: 'center',
                style: {
                    fontSize: '12px',
                    color: '#6B7280',
                },
            },
            tickLength: 0,
        },
        yAxis: {
            title: {
                text: 'Number of Employees',
                style: {
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: 'bold',
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
            formatter: function () {
                return `
                    <b>Company: ${this.x}</b><br/>
                    ${this.points.map(
                        point => `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b><br/>`
                    ).join('')}`;
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
        <CardWrapper heading="Branch-wise Employee Overview" showFilter={false}>
            <div
                id="chart"
                className="p-4 pt-2 mt-2 mb-2"
                style={{
                    width: '100%', // Ensures full width
                    height: '360px',
                    borderRadius: '5px', // Rounded border
                    backgroundColor: '#fff', // Chart background
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
                }}
            >
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    containerProps={{
                        style: {
                            width: '100%', // Stretch container width
                            height: '350px', // Fixed height
                            borderRadius: '5px', // Ensures the chart respects border-radius
                            overflow: 'hidden', // Prevents overflow of child elements
                        },
                    }}
                />
            </div>
        </CardWrapper>
    );
};

export default YearlyComChart;
