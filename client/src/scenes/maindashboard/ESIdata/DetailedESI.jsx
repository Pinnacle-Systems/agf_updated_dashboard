import { useState } from "react";
import { useGetEsiPf1Query } from "../../../redux/service/misDashboardService";
import { useEffect } from "react";
import { Box, Card } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import EsiDetail from "../../../components/EsiDet";

const DetailedESI = ({ companyName, selectedYear1, ESIdata,selectedState }) => {
//   console.log("ESIdata", ESIdata);
  // console.log(companyName,selectedYear1, "selectedYear1");
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

  useEffect(() => {
    setFilterBuyer(companyName);
  }, [companyName]);

  // FIX: sync year from parent
  useEffect(() => {
    setSelectedYear(selectedYear1);
  }, [selectedYear1]);
  const filteredData = Array.isArray(ESIdata)
    ? ESIdata.filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
    : [];
 
    const groupdata = filteredData?.reduce((acc, emp) => {
        const code = emp.PAYPERIOD || "Unknown";
        acc[code] = (acc[code] || 0) + (emp.ESI || 0);
        
        return acc;
    }, {});
    
  const Chartdata = Object.entries(groupdata).map(([x, y]) => ({
        month: x,
        esi: y,
        // percent: ((y / totalNetPay) * 100).toFixed(2),
        // color:getRandomColor()
    }));
    
    // console.log(Chartdata,"ESIyeardata");
   const pfData = Chartdata?.map((item) => item.esi);
  const headCount = Chartdata?.map((item) => item.month);


  const options = {
    chart: {
    
      marginTop: 10,
      marginBottom: 100, 
      type: "line",
      height: 320,
    
      borderRadius: 10,
    },
    xAxis: {
      
      categories: Chartdata?.map((order) => {
        const month = new Date(order.month);
        const monthAbbr = month.toLocaleString("default", { month: "short" });
        const year = month.getFullYear().toString().slice(-2);
        return `${monthAbbr} ${year}`;
      }),
      title: {
        text: "Month",
        style: { fontSize: "10px" },
      },
      labels: {
        
        style: {  
      fontSize: "10px" },
      },
    },
    yAxis: {
        
      min: 0,
      title: {
        text: "Amount (ESI)",
        style: { fontSize: "10px" },
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
        // let headCountValue = headCount[index];
        let pf = pfData[index];
        let monthName = this.x;

        return `<b>Month:</b> ${monthName} <br/>
                        <b>ESI Value:</b> ${pf} <br/>
                       `;
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 3,
          symbol: "circle",
        },
        dataLabels: {
          style: { fontSize: "10px" },
        },
        point: {
          events: {
            click: function () {
              // console.log("lavanya");

              setShowTable(true);
            },
          },
        },
      },
    },
    title: {
      text: null,
    },
    legend: {
      itemStyle: { fontSize: "10px" },
    },
    series: [
      {
        name: "ESI",
        data: pfData,
        color: "#FF5733",
      },
    ],
  };

  return (
    <>
      <Card
        sx={{
          mt: 2,
          ml: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Box>
        {showTable && (
          <EsiDetail
            selectedBuyer={[filterBuyer]}
            closeTable={() => setShowTable(false)}
            setSearch={setSearch}
            search={search}
          />
        )}
      </Card>
    </>
  );
};

export default DetailedESI;
