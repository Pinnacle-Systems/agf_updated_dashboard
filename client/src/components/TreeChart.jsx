import React, { useEffect, useState, useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import { ColorContext } from '../scenes/global/context/ColorContext';
import CardWrapper from './CardWrapper';
import BuyerMultiSelect from './ModelMultiSelect1';

// Initialize Highcharts 3D module
Highcharts3D(Highcharts);

const Bar3DChart = ({ overAllSuppCon, selected, setSelected, option }) => {
    const [showModel, setShowModel] = useState(false);

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const { color } = useContext(ColorContext);

    const colorArray = ['#8A37DE', '#005E72', '#E5181C', '#056028', '#1F2937'];

    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'column',
            height: 360,
            options3d: {
                enabled: true,
                alpha: 12,
                beta: 12,
                depth: 50,
                viewDistance: 25,
            },
            backgroundColor: '#FFFFFF',
            borderRadius: "10px" // Add background color for better contrast
        },
        title: null, // Remove the title
        legend: {
            enabled: false, // Disable the legend since series name is not needed
        },
        tooltip: {
            headerFormat: '<b>{point.key}</b><br/>',
            pointFormat: 'Value: {point.y}', // Update tooltip format to avoid showing series name
            style: {
                fontSize: '12px',
                color: '#374151',
            },
        },
        xAxis: {
            categories: [],
            labels: {
                style: {
                    fontSize: '10px',
                    color: '#6B7280', // Subtle color for x-axis labels
                },
            },
            title: {
                text: 'Experience', // Add a title to the x-axis
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#374151',
                },
            },
        },
        yAxis: {
            title: {
                text: 'No of Employees', // Title for y-axis
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold', // Bold the y-axis title
                    color: '#374151',
                },
            },
            labels: {
                style: {
                    fontSize: '10px',
                    color: '#6B7280', // Subtle color for y-axis labels
                },
            },
        },
        plotOptions: {
            column: {
                depth: 25,
                colorByPoint: true,
                borderRadius: 5, // Add rounded corners for a modern look
            },
        },
        colors: colorArray,
        series: [
            {
                name: '', // Remove series name
                data: [],
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '10px',
                        color: '#333', // Dark color for data labels
                    },
                },
            },
        ],
    });
    useEffect(() => {
        if (overAllSuppCon && overAllSuppCon.length > 0) {
            const categories = overAllSuppCon.map(item => truncateText(item.supplier, 10));
            const data = overAllSuppCon.map(item => item.poQty);

            setChartOptions(prevOptions => ({
                ...prevOptions,
                xAxis: { ...prevOptions.xAxis, categories },
                series: [{ ...prevOptions.series[0], data }],
            }));
        }
    }, [overAllSuppCon]);
    console.log(selected,"selected")

    return (
        <CardWrapper heading="Experience Distribution" onFilterClick={() => setShowModel(true)}>
            <div id="chart" className="rounded mt-2">
                {showModel && (
                    <BuyerMultiSelect
                        selected={selected}
                        setSelected={setSelected}
                        color={color}
                        showModel={showModel}
                        setShowModel={setShowModel}
                    />
                )}
                     {selected && (
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />) }
            </div>
        </CardWrapper>
    );
};

export default Bar3DChart;
