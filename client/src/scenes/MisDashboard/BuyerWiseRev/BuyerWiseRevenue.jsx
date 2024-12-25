import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';


Highcharts3D(Highcharts);

const BuyerWiseRevenueGen = ({ buyerRev }) => {
    const buyerWiseRev = buyerRev ? buyerRev : [];
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
            name: '',
            data: buyerWiseRev.map(item => ({
                name: item.buyer,
                y: item.value
            }))
        }],
        credits: {
            enabled: false
        }
    };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            style={{ width: '200px', height: '100%' }}
        />
    );
};

export default BuyerWiseRevenueGen;
