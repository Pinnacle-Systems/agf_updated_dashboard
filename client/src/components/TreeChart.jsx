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

    const colorArray = ['#544FC5', '#19FB8B', '#FF834E', '#056028', '#1F2937'];

    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'column',
            height: 350,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25,
            },
        },
        title: {
            text: '', // Set the title to an empty string
        },
        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
        },
        tooltip: {
            headerFormat: '<b>{point.key}</b><br/>',
            pointFormat: '{series.name}: {point.y}',
        },
        xAxis: {
            categories: [],
            labels: {
                style: {
                    fontSize: '10px',
                    color: '#333',
                },
            },
        },
        yAxis: {
            title: {
                text: 'Quantity',
            },
        },
        plotOptions: {
            column: {
                depth: 25,
                colorByPoint: true,
            },
        },
        colors: colorArray,
        series: [
            {
                name: 'Quantity',
                data: [],
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

    return (
        <CardWrapper heading="Experience Distribution" onFilterClick={() => setShowModel(true)}>
            <div id="chart" className="p-4">
                {showModel && (
                    <BuyerMultiSelect
                        selected={selected}
                        setSelected={setSelected}
                        color={color}
                        showModel={showModel}
                        setShowModel={setShowModel}
                    />
                )}
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </div>
        </CardWrapper>
    );
};

export default Bar3DChart;
