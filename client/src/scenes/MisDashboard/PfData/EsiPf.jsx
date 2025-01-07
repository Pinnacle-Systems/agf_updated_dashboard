import React, { useEffect, useState, useContext, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import CardWrapper from '../../../components/CardWrapper';
import { useGetBuyerNameQuery, useGetFinYearQuery, useGetMonthQuery } from '../../../redux/service/commonMasters';
import { useGetYFActVsPlnQuery } from '../../../redux/service/orderManagement';
import { ColorContext } from '../../global/context/ColorContext';
import ModelMultiSelectChart4 from '../../../components/ModelMultiSelectChart4';
import { useGetEsiPfQuery } from '../../../redux/service/misDashboardService';

const Pf = () => {

    // Add a click event for points
    Highcharts.addEvent(Highcharts.Point, 'click', function () {
        if (this.series.options.className?.includes('popup-on-click')) {
            const chart = this.series.chart;
            const date = chart.time.dateFormat('%A, %b %e, %Y', this.x);
            const text = `<b>${date}</b><br/>${this.y} ${this.series.name}`;

            const anchorX = this.plotX + this.series.xAxis.pos;
            const anchorY = this.plotY + this.series.yAxis.pos;
            const align = anchorX < chart.chartWidth - 200 ? 'left' : 'right';
            const x = align === 'left' ? anchorX + 10 : anchorX - 10;
            const y = anchorY - 30;

            if (!chart.sticky) {
                chart.sticky = chart.renderer
                    .label(text, x, y, 'callout', anchorX, anchorY)
                    .attr({
                        align,
                        fill: 'rgba(0, 0, 0, 0.75)',
                        padding: 10,
                        zIndex: 7, // Above series, below tooltip
                    })
                    .css({ color: 'white' })
                    .on('click', function () {
                        chart.sticky = chart.sticky.destroy();
                    })
                    .add();
            } else {
                chart.sticky
                    .attr({ align, text })
                    .animate({ anchorX, anchorY, x, y }, { duration: 250 });
            }
        }
    });

    // Highcharts options
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [buyerNm, setBuyerNm] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const { color } = useContext(ColorContext);
    const { data: buyer } = useGetBuyerNameQuery({});
    const { data: month } = useGetMonthQuery({ params: { filterYear: selectedYear, filterBuyer: selectedBuyer } });
    const { data: year } = useGetFinYearQuery({});
    const { data: fabPlVsActFull } = useGetEsiPfQuery({
        params: { filterMonth: selectedMonth, filterSupplier: selectedBuyer, filterYear: selectedYear },
    });

    useEffect(() => {
        if (buyer?.data || month?.data || year?.data) {
            setBuyerNm(buyer?.data.map((item) => item.buyerName) || []);
            setMonthData(month?.data.map((mon) => mon.month) || []);
            setYearData(year?.data.map((year) => year.finYear) || []);
        }
    }, [buyer, month, year]);

    const fabPlVsActFullDt = fabPlVsActFull?.data || [];
    const orderCount = fabPlVsActFullDt.length;


    const esiData = fabPlVsActFullDt.map((item) => item.esi);
    const pfData = fabPlVsActFullDt.map((item) => item.pf);

    const options = {
        chart: {
            scrollablePlotArea: {
                minWidth: 700,
            },
            type: 'line',
        },
        xAxis: {
            categories: fabPlVsActFullDt.map((order) => {
                const month = new Date(order.month);
                const monthAbbr = month.toLocaleString('default', { month: 'short' }); // 3-letter month abbreviation
                const year = month.getFullYear().toString().slice(-2); // Last 2 digits of the year
                return `${monthAbbr} ${year}`;
            }),
            title: {
                text: 'Month',
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Amount',
            },
            labels: {
                formatter: function () {
                    return this.value; // Display raw values without formatting to millions
                },
            },
        },
        tooltip: {
            shared: true,
            pointFormat: '<b>{series.name}</b>: {point.y:,.0f}<br/>',
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true, // Enable markers by default
                    radius: 4, // Marker size
                    symbol: 'circle', // Marker shape
                },
            },
        },
        title: null,
        series: [
            {
                name: 'PF',
                data: pfData,
                color: '#000000',
                marker: {
                    fillColor: '#000000', // Marker color for this series
                    lineWidth: 2, // Outline width
                    lineColor: '#ffffff', // Outline color
                },
            },
        ],
    };

    const [showModel, setShowModel] = useState(false);
    return (
        <CardWrapper heading="PF Breakup" onFilterClick={() => { setShowModel(true) }}>
            {orderCount > 0 ? (
                <HighchartsReact highcharts={Highcharts} options={options} />
            ) : (
                <div>No Data Available</div>
            )}
            {showModel &&
                <ModelMultiSelectChart4 color={color}
                    showModel={showModel} setShowModel={setShowModel} selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                    selectedBuyer={selectedBuyer} setSelectedBuyer={setSelectedBuyer} />
            }
        </CardWrapper>
    );
};

export default Pf;
