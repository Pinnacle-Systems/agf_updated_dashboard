import { useState } from "react";
import { useGetEsiPf1Query, useGetEsiPfQuery } from "../../../redux/service/misDashboardService";
import { useEffect } from "react";
import { Card } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { Title } from "@mui/icons-material";
import PfDetail from "../../../components/PfDet";


const DetailedPF = ({ companyName, selectedYear1 }) => {

    const [search, setSearch] = useState({
            FNAME: "",
            GENDER: "",
            MIDCARD: "",
            DEPARTMENT: "",
            COMPCODE: "",
        });
        const [showTable,setShowTable] = useState(false) 
    
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
            height: 380,
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
                },
                point:{
                    events:{
                        click:function(){
                            // console.log("lavanya");
                            
                            setShowTable(true);
 

                        }
                    }
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



  return <>
<Card   sx={{
    mt:2,
          p:2,
          borderRadius: 3,
          boxShadow: 4,
          width: "100%",
          maxWidth: 1000,
        //   mx: 1,
        }}>

 <HighchartsReact highcharts={Highcharts} options={options} />

 {showTable  && (
    <PfDetail
    selectedBuyer={[filterBuyer]}
   
    closeTable={() => setShowTable(false)}
    setSearch={setSearch}
    
    search={search}
     
    
  />
 )}

</Card>

  </>;
};

export default DetailedPF;
