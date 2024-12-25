import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ColorContext } from '../scenes/global/context/ColorContext';
import { useContext } from 'react';
import CardWrapper from './CardWrapper';
import BuyerMultiSelect from './ModelMultiSelect1';

const Bar3DChart = ({ overAllSuppCon, selected, setSelected, option }) => {
    const [showModel, setShowModel] = useState(false);

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };
    const { color } = useContext(ColorContext)
    function generateColorArray(color, count = 7) {
        const colorsArray = [];
        let hueShift = 0;

        for (let i = 0; i < count; i++) {
            hueShift = (i * 30) % 360;
            colorsArray.push(`hsl(${hueShift}, 70%, 50%)`);
        }
        console.log(colorsArray, "colorsArray")
        return colorsArray;
    }


    const baseColor = 'hsl(0, 70%, 50%)'; // Red base color
    const colorArray = generateColorArray(baseColor);
    console.log(colorArray); // Array of 7 distinct colors



    const [chartOptions, setChartOptions] = useState({
        series: [],
        chart: {
            height: 320, // Reduce overall chart height
            type: 'bar',
            toolbar: { show: false },
            zoom: { enabled: true },
            offsetX: 10, // Adjust offset for cleaner layout
            offsetY: 10,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 8, // Reduce border radius slightly
                distributed: true,
                columnWidth: '70%', // Adjust bar width for better spacing
                dataLabels: { position: 'top' },
                shadow: {
                    enabled: true,
                    blur: 6, // Reduced shadow blur for subtle effect
                    opacity: 0.3, // Lower shadow opacity
                    color: '#000',
                    x: 3,
                    y: 3,
                },
            },
        },

        colors: ['#525252', '#F7B900', '#1C2937', 'rgb(255, 140, 0)', '#101010'],
        dataLabels: {
            style: {
                colors: ['#000'],
                fontSize: '10px',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
            },
        },
        tooltip: {
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                const { fullX, y } = w.config.series[seriesIndex].data[dataPointIndex];
                return `<div style="padding: 4px; font-size: 10px;">${fullX}: ${y}</div>`;
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
        <CardWrapper heading={"Experience Distribution"} onFilterClick={() => { setShowModel(true) }} >
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
                <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="bar"
                    height={320}
                    className="text-black"
                />
            </div>
        </CardWrapper>
    );
};

export default Bar3DChart;
