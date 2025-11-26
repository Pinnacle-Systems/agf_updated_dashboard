import { Card, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import PfDetail from "../../../components/PfDet";
import Highcharts from "highcharts";
import PFDetailedCom from "../../../components/PF detail/pfDetail";

const MonthPF=({ companyName, selectedYear1, PFdata, selectedState })=>{
const [search, setSearch] = useState({
    FNAME: "",
    GENDER: "",
    MIDCARD: "",
    DEPARTMENT: "",
    COMPCODE: "",
  });
  const [showTable, setShowTable] = useState(false);

  const [selectedYear, setSelectedYear] = useState(selectedYear1);
  const [filterBuyer, setFilterBuyer] = useState(companyName);

  //     const { data: PFyeardata } = useGetEsiPfQuery(
  //         {params: {
  //             filterSupplier: filterBuyer ,
  //             filterYear: selectedYear ,
  //         }},

  //     );
  //     console.log(PFyeardata, "PFyeardata")
  //    const pfData = PFyeardata?.data.map((item) => item.esi);
  //     const headCount = PFyeardata?.data.map((item) => item.headCount);

  useEffect(() => {
    setFilterBuyer(companyName);
  }, [companyName]);

  
  useEffect(() => {
    setSelectedYear(selectedYear1);
  }, [selectedYear1]);

  const filteredData = Array.isArray(PFdata)
    ? PFdata.filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
    : [];

  const groupdata = filteredData?.reduce((acc, emp) => {
    const code = emp.PAYPERIOD || "Unknown";
    acc[code] = (acc[code] || 0) + (emp.PF || 0);

    return acc;
  }, {});

  const Chartdata = Object.entries(groupdata).map(([x, y]) => ({
    month: x,
    pf: y,
    // percent: ((y / totalNetPay) * 100).toFixed(2),
    // color:getRandomColor()
  }));
  const pfData = Chartdata?.map((item) => item.pf);
  const Month = Chartdata?.map((item) => item.month);

const option= {
    chart: {
        type: 'area',
        height:250,
        marginLeft:70,
        marginBottom:50
    },
    title: {
        text: null
    },
    xAxis: {
        categories: Chartdata?.map((order) => {
        const month = new Date(order.month);
        const monthAbbr = month.toLocaleString("default", { month: "short" });
        const year = month.getFullYear().toString().slice(-2);
        return `${monthAbbr} ${year}`;
      }),  
        title: { text:"month" ,style:{fontSize: "9px"}},
        labels: {
        style: { fontSize: "10px"},
      },
        allowDecimals: false
    },
    yAxis: {
        title: {
            text: 'PF',
            style:{fontSize: "10px"}
        },
        labels: {
        style: { fontSize: "10px"},
      },
    },
    tooltip: {
        shared: true,
      useHTML: true,
      style: { fontSize: "10px" },
      formatter: function () {
        let index = this.points[0].point.index;
        
        let pf = pfData[index];
        let monthName = this.x;

        return `<b>Month:</b> ${monthName} <br/>
                        <b>PF Value:</b> ${pf} <br/>
                        `;
      },
        // pointFormat: 'PF: <b>{point.y}</b><br/>Month: <b>{point.category}</b>'
    },
    plotOptions: {
        area: {
            marker: {
                enabled: true,
                radius: 3
            }
        },
series: {
      cursor: "pointer",
      point: {
        events: {
          click: function () {
            setShowTable(true)
          },
        },
      },
    }
    },
    legend: {
        enabled:false,
      itemStyle: { fontSize: "11px" },
    },
    series: [{
        name: 'PF',
        data: pfData               
    }]
}

return<>
<Card
        sx={{
          // mt: 2,
          ml: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
         <CardHeader
                title="Month wise PF"
                titleTypographyProps={{
                  sx: { fontSize: ".9rem", fontWeight: 600 },
                }}
                sx={{
                  p: 1,
                  borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                }}
              />
        <HighchartsReact highcharts={Highcharts} options={option} />

        {showTable && (
                  <PFDetailedCom
                  selectedYear={selectedYear}
                    selectedBuyer={[filterBuyer]}
                    closeTable={() => setShowTable(false)}
                    setSearch={setSearch}
                    search={search}
                  />
                )}
      </Card>

</>

} 
export default MonthPF