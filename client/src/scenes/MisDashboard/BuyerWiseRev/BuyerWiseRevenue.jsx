import React, { useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import { ColorContext } from '../../global/context/ColorContext';

Highcharts3D(Highcharts);

const BuyerWiseRevenueGen = ({ buyerRev }) => {
    const { color } = useContext(ColorContext); // Retrieve color from context

    const buyerWiseRev = buyerRev || []; // Default to an empty array if no data is provided
    const options = {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 40
            },
            backgroundColor: '#FFFFFF',
            width: 350,
            height: 360
        },
        title: {
            text: '',
            align: 'left',
            style: {
                color: '#000000',
                fontWeight: 'normal'
            }
        },
        subtitle: {
            text: '',
            align: 'left',
            style: {
                color: '#000000',
                fontWeight: 'normal'
            }
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45,
                dataLabels: {
                    formatter: function () {
                        return `${this.point.name}`;
                    },
                    style: {
                        color: '#000000',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        tooltip: {
            pointFormatter: function () {
                return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y.toLocaleString()}</b><br/>`;
            }
        },
        series: [{
            name: 'Revenue',
            data: buyerWiseRev.map((item, index) => ({
                name: item.buyer,
                y: item.value,
                color: index === 0 && color ? color : undefined // Apply selected color only if available
            }))
        }],
        credits: {
            enabled: false
        }
    };

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                style={{ width: '50px', height: '100%' }}
            />
        </div>
    );
};

export default BuyerWiseRevenueGen;
