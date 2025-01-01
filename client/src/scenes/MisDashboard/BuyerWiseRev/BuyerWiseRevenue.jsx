import React, { useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import { ColorContext } from '../../global/context/ColorContext';

Highcharts3D(Highcharts);

const BuyerWiseRevenueGen = ({ buyerRev }) => {
    const { color } = useContext(ColorContext);

    const buyerWiseRev = buyerRev || []; 
    const options = {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 40
            },
            backgroundColor: '#FFFFFF',
            width: 320,
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
            name: 'Age',
            data: buyerWiseRev.map((item, index) => ({
                name: item.buyer,
                y: item.value,
                color: index === 0 && color ? color : undefined 
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
                style={{ width: '100%', height: '100%',
                    borderRadius: '5px', // Ensures the chart respects border-radius
   
                 }}

            />
        </div>
    );
};

export default BuyerWiseRevenueGen;
