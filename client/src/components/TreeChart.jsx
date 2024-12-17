import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import DropdownDt from '../Ui Component/dropDownParam';

const Bar3DChart = ({ overAllSuppCon, selected, setSelected, option }) => {
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const [chartOptions, setChartOptions] = useState({
        series: [],
        chart: {
            height: 330,
            type: 'bar', 
            toolbar: { show: false },
            perspective: 0.3, // Add more depth with perspective
            zoom: {
                enabled: true,
            },
            offsetX: 20,  // Adjust for rotation effect
            offsetY: 20,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 12,
                distributed: true,
                columnWidth: '60%',  // Adjust width for 3D depth
                barHeight: '50%',
                dataLabels: {
                    position: 'top',
                },
                // Enhanced shadow for 3D effect
                shadow: {
                    enabled: true,
                    blur: 12,
                    opacity: 0.5, // Increased opacity for shadow to enhance 3D feel
                    color: '#000',
                    x: 6,
                    y: 6,
                },
            },
        },
        colors: [
            '#525252',
            '#F7B900',
            '#1C2937', 
            'rgb(255, 140, 0)', 
            '#101010'
        ],
        dataLabels: {
            style: {
                colors: ['black'],
                fontSize: '12px',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            },
        },
        tooltip: {
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                const { fullX, y } = w.config.series[seriesIndex].data[dataPointIndex];
                return `<div>${fullX}: ${y}</div>`;
            },
        },
    });

    useEffect(() => {
        if (overAllSuppCon && overAllSuppCon.length > 0) {
            const data = overAllSuppCon.map(item => ({
                x: truncateText(item.supplier, 10),
                y: item.poQty,
                fullX: item.supplier,
            }));

            setChartOptions(prevOptions => ({
                ...prevOptions,
                series: [{ data }],
            }));
        }
    }, [overAllSuppCon]);

    return (
        <div id="chart">
            <DropdownDt selected={selected} setSelected={setSelected} option={option} />
            <Chart options={chartOptions} series={chartOptions.series} type="bar" height={350} className="text-black" />
        </div>
    );
};

export default Bar3DChart;
