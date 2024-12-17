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
                fontSize: '10px', // Reduce font size for data labels
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // Subtle text shadow
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
        <div id="chart" className="p-4">
            <DropdownDt selected={selected} setSelected={setSelected} option={option} />
            <Chart
                options={chartOptions}
                series={chartOptions.series}
                type="bar"
                height={320} // Reduce chart height further for compact UI
                className="text-black"
            />
        </div>
    );
};

export default Bar3DChart;
