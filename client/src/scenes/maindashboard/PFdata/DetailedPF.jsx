import { useState } from "react";
import { useGetEsiPf1Query, useGetEsiPfQuery } from "../../../redux/service/misDashboardService";
import { useEffect } from "react";
import { Card } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';

const DetailedPF = ({ companyName, selectedYear1 }) => {
    
    const [selectedYear, setSelectedYear] = useState(selectedYear1);
    const [filterBuyer, setFilterBuyer] = useState(companyName);
    
    const { data: PFyeardata } = useGetEsiPfQuery(
        {params: {
            filterSupplier: filterBuyer , 
            filterYear: selectedYear ,
        }},
        
    );
    console.log(PFyeardata, "PFyeardata")
   const pfData = PFyeardata?.data.map((item) => item.esi);
    const headCount = PFyeardata?.data.map((item) => item.headCount);


  useEffect(() => {
    setFilterBuyer(companyName);
  }, [companyName]);

  // FIX: sync year from parent
  useEffect(() => {
    setSelectedYear(selectedYear1);
  }, [selectedYear1]);

  const options = {
        chart: {
            scrollablePlotArea: {
                minWidth: 700,
            },
            marginTop: 10,
            type: 'line',
            height: 360,
            borderRadius: 10,
        },
        xAxis: {
            categories: PFyeardata?.data.map((order) => {
                const month = new Date(order.month);
                const monthAbbr = month.toLocaleString('default', { month: 'short' });
                const year = month.getFullYear().toString().slice(-2);
                return `${monthAbbr} ${year}`;
            }),
            title: {
                text: 'Month',
                style: { fontSize: '10px' }
            },
            labels: {
                style: { fontSize: '10px' }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Amount (PF)',
                style: { fontSize: '10px' }
            },
            labels: {
                style: { fontSize: '10px' }
            }
        },
        tooltip: {
            shared: true,
            useHTML: true,
            style: { fontSize: '10px' },
            formatter: function () {
                let index = this.points[0].point.index;
                let headCountValue = headCount[index];
                let pf = pfData[index];
                let monthName = this.x; 
    
                return `<b>Month:</b> ${monthName} <br/>
                        <b>PF Value:</b> ${pf} <br/>
                        <b>Headcount:</b> ${headCountValue}`;
            },
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    radius: 3,
                    symbol: 'circle',
                },
                dataLabels: {
                    style: { fontSize: '10px' }
                }
            },
        },
        title: {
            text: null,
        },
        legend: {
            itemStyle: { fontSize: '10px' }
        },
        series: [
            {
                name: 'PF',
                data: pfData,
                color: '#FF5733',
            }
        ]
    };

//     const options={
//     chart: {
//         plotBackgroundColor: null,
//         plotBorderWidth: null,
//         plotShadow: false,
//         type: 'pie'
//     },
//     title: {
//         text: 'Registered private vehicles in Norway, by type of fuel, 2020'
//     },
//     tooltip: {
//         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//     },
//     accessibility: {
//         point: {
//             valueSuffix: '%'
//         }
//     },
//     plotOptions: {
//         pie: {
//             allowPointSelect: true,
//             cursor: 'pointer',
//             dataLabels: {
//                 enabled: true,
//                 format: '<span style="font-size: 1.2em"><b>{point.name}</b>' +
//                     '</span><br>' +
//                     '<span style="opacity: 0.6">{point.percentage:.1f} ' +
//                     '%</span>',
//                 connectorColor: 'rgba(128,128,128,0.5)'
//             }
//         }
//     },
//     series: [{
//         name: 'Share',
//         data: [
//             { name: 'Petrol', y: 938899 },
//             { name: 'Diesel', y: 1229600 },
//             { name: 'Electricity', y: 325251 },
//             { name: 'Other', y: 238751 }
//         ]
//     }]
// }

  return <>
<Card>

 <HighchartsReact highcharts={Highcharts} options={options} />

</Card>

  </>;
};

export default DetailedPF;
