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
            marginBottom: 100,
        },
        title: null,
        xAxis: {
            categories,
            title: {
                text: 'Branches',
                style: {
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    paddingTop: '20px'
                },
                margin: 25,
            },
            labels: {
                style: { color: '#6B7280', fontSize: '10px' },
                rotation: -45,
                align: 'right', 
                overflow: 'justify', 
                step: 1, 
                padding: 10, 
            },
            tickInterval: 1,
            min: 0, 
            max: categories.length - 1, 
            categories: categories.length > 10 ? categories.slice(0, 10) : categories,
        },
        
        yAxis: {
            title: {
                text: 'Number of Employees',
                style: {
                    fontSize: '12px',
                    color: '#374151',
                    fontWeight: 'bold',
                    paddingRight : '10px'
                },
                margin: 25,
            },
            labels: {
                style: {
                    fontSize: '10px',
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
                fontSize: '10px',
            },
            formatter: function () {
                return `
                    <b>${this.x}</b><br/>
                    ${this.points
                        .map(
                            point => `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b><br/>`
                        )
                        .join('')}`;
            },
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                depth: 40,
                pointWidth: 15,
                borderRadius: 5,
                pointPadding: 0.9, 
                groupPadding: 0.9, 
            },
        },
        
        legend: {
            align: 'center',
            verticalAlign: 'top',
            layout: 'horizontal',
            itemStyle: { color: '#374151', fontSize: '10px', fontWeight: '500' },
        },
        series,
    };
    
    
    
    return (
        <CardWrapper heading={"Employee Strength As On Date"} showFilter={false}>
                        <div id="chart" className=" pt-2 rounded">

            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                containerProps={{
                    style: {
                        minWidth: '100%',
                        height: '100%',
                        borderRadius : "10px"
                    }
                }}
            />
            </div>
        </CardWrapper>
    );
 };

export default YearlyComChart;
