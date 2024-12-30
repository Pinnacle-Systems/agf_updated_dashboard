import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useGetYFActVsPlnQuery } from '../../redux/service/orderManagement';
import { useGetBuyerNameQuery, useGetFinYearQuery, useGetMonthQuery } from '../../redux/service/commonMasters';
import { ColorContext } from '../global/context/ColorContext';
import { useContext } from "react";
import ModelMultiSelectChart2 from '../../components/ModelMultiSelectChart2';
import CardWrapper from '../../components/CardWrapper';
import ModelMultiSelectChart3 from '../../components/ModelMultiSelectChart3';

const ChartTable = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [buyerNm, setBuyerNm] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [yearData, setYearData] = useState([]);
    const { color } = useContext(ColorContext);
    const { data: buyer, isLoading: isbuyerLoad } = useGetBuyerNameQuery({ params: {} });
    const { data: month } = useGetMonthQuery({ params: { filterYear: selectedYear || '', filterBuyer: selectedBuyer || '' } });
    const { data: year } = useGetFinYearQuery({});
    useEffect(() => {
        if (buyer?.data || month?.data || year?.data) {
            const buyerName = (buyer?.data ? buyer?.data : []).map((item) => item.buyerName);
            const monData = (month?.data ? month?.data : []).map((mon) => mon.month);
            const finYearData = (year?.data ? year?.data : []).map((year) => year.finYear);
            setBuyerNm(buyerName);
            setMonthData(monData);
            setYearData(finYearData);
        }
    }, [buyer, month, year]);
    const { data: fabPlVsActFull, } = useGetYFActVsPlnQuery({ params: { filterMonth: selectedMonth || '', filterSupplier: selectedBuyer || '', filterYear: selectedYear || '' } });
    const fabPlVsActFullDt = fabPlVsActFull?.data ? fabPlVsActFull?.data : [];

    const orderCount = fabPlVsActFullDt.length;
    const options = {
        chart: {
            type: 'column',
            height: 360,
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 10,
                depth: 40,
                viewDistance: 25,
            },
            scrollablePlotArea: {
                minWidth: orderCount < 10 ? 300 : orderCount < 20 ? 500 : orderCount <= 40 ? 1500 : orderCount <= 65 ? 2000 : orderCount < 85 ? 2500 : orderCount < 120 ? 3000 : orderCount < 150 ? 3500 : 300,
                scrollPositionX: 0
            }
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: fabPlVsActFullDt.map((order) => order.payPeriod),
            labels: {
                rotation: -90,
                step: 1,
                style: {
                    fontSize: '12px'
                }
            },
            scrollbar: {
                enabled: true
            },
        },
        yAxis: {
            title: {
                text: 'Attrition',
                style: {
                    fontSize: '10px',
                    paddingLeft: '20px'
                },
            },
            labels: {
                style: {
                    fontSize: '10px'
                },
                formatter: function () {
                    return this.value.toLocaleString();
                }
            },
        },
        plotOptions: {
            column: {
                depth: 25, // Depth of individual columns
                pointWidth: 20,
                stacking: 'normal',
                states: {
                    hover: {
                        pointWidth: 20
                    }
                },
                marker: {
                    enabled: false
                },
            }
        },
        legend: {
            itemStyle: {
                fontWeight: 'bold'
            },
            symbolHeight: 12,
            symbolWidth: 12,
            symbolRadius: 1,
        },
        series: [
            {
                name: 'Attrition',
                data: fabPlVsActFullDt.map((order, index) => ({
                    y: order.attrition,
                    color: Highcharts.getOptions().colors[index % Highcharts.getOptions().colors.length], // Use predefined Highcharts colors cyclically
                })),
                colorByPoint: true, 
            },
        ],
        
    };
    

    const [showModel, setShowModel] = useState(false);

    return (
        <CardWrapper heading={"Attrition  Breakup"} onFilterClick={() => { setShowModel(true) }} >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
                {orderCount > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <div style={{ flex: '66%', minWidth: '66%' }} className='flex flex-col'>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={options}
                                containerProps={{ style: { minWidth: '70%', height: '350px' } }}
                            />
                        </div>

                    </div>
                ) : (
                    <div>No Data Available</div>
                )}
                    {showModel &&
                    <ModelMultiSelectChart3 color={color}
                        showModel={showModel} setShowModel={setShowModel} selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                        selectedBuyer={selectedBuyer} setSelectedBuyer={setSelectedBuyer} />
                }
            </div>
        </CardWrapper>
    );
};

export default ChartTable;
