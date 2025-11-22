import { Card, CardHeader } from "@mui/material";
import { useGetMisDashboardOTWagesDetQuery } from "../../../redux/service/misDashboardService";
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
 import Highcharts from "highcharts";
 import Variwide from "highcharts/modules/variwide";
import SalaryDetail from "../../../components/SalaryDet";
import OTWagesDetail from "../../../components/OTWagessalary";

Variwide(Highcharts);

const OTwagessalary = ({ companyName, selectedState }) => {
  const [search, setSearch] = useState({
    FNAME: "",
    GENDER: "",
    MIDCARD: "",
    DEPARTMENT: "",
    COMPCODE: "",
  });
  const [showTable, setShowTable] = useState(false);
  const [filterBuyer, setFilterBuyer] = useState(companyName);

  useEffect(() => {
    setFilterBuyer(companyName);
  }, [companyName]);

  const {
    data: Salarydata,
    isLoading,
    isError,
    error,
  } = useGetMisDashboardOTWagesDetQuery({ params: {
      filterBuyer: filterBuyer,
    }, });

  if (Salarydata?.data?.length === 0)
    return (
      <Card sx={{ p: 2, textAlign: "center", m: 20 }}>No data available</Card>
    );

  const salaryDet = Salarydata?.data || [];
  const filteredData = Array.isArray(salaryDet)
    ? salaryDet.filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
    : [];

  const totalsByComp = filteredData.reduce((acc, emp) => {
    const code = emp.DEPARTMENT || "Unknown";
    acc[code] = (acc[code] || 0) + (emp.OTWAGES || 0);

    return acc;
  }, {});

  const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};


  const totalNetPay = Object.values(totalsByComp).reduce((a, b) => a + b, 0);

  const Chartdata = Object.entries(totalsByComp).map(([x, y]) => ({
    Department: x,
    Netpay: y,
    percent: ((y / totalNetPay) * 100).toFixed(2),
    color:getRandomColor()
  }));

  const Filterchartdata=Chartdata?.filter((item)=>item.percent>0)

;
  const categories=Chartdata?.map((item)=>item.Department)
  const seriesData=Chartdata?.map((item)=>item.Netpay)

 const options = {
    chart: {
      backgroundColor: "#f5f5f5",
      scrollablePlotArea: { minWidth: 300 },
      // marginTop: 10,
      type: "line",
      height: 300,
      // borderRadius: 10,
    },

    xAxis: {
      categories: categories,
      title: { text: "Department", style: { fontSize: "10px" } },
      labels: { style: { fontSize: "10px" } ,rotation: -35,},
    },

    yAxis: {
      min: 0,
      title: { text: "OTwages Netpay", style: { fontSize: "12px" } },
      labels: { style: { fontSize: "10px" } },
    },

    tooltip: {
      shared: true,
      style: { fontSize: "10px" },
      formatter: function () {
        let tooltip = `<b>${this.x}</b><br/>`;
        const index = this.points[0].point.index;
        tooltip += `<b>OTNetpay:</b> ${seriesData[index]}`;
        return tooltip;
      },
    },

    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 4,
          symbol: "circle",
        },
        point: {
          events: {
            click: function () {
              const companyName = this.category;
              // console.log("Clicked:", companyName);
              setSearch((prev) => ({
                ...prev,
                DEPARTMENT: companyName,
              }));
              setShowTable(true);
              
            },
          },
        },
      },
    },

    title: null,

    series: [
      {
        name: "OTWages",
        data: seriesData,
        color: "#FF0000",
        marker: {
          fillColor: "#FF0000",
          lineWidth: 2,
          lineColor: "#000000",
        },
      },
    ],
  };
// console.log(options,"options");
return<>
<Card sx={{
   backgroundColor: "#f5f5f5",
        // borderRadius: 3,
        // boxShadow: 4,
        ml:1
      }}>

  <CardHeader title="Overtime wise salary " titleTypographyProps={{
            sx: { fontSize: ".9rem", fontWeight: 600},
          }}
          sx={{
            p:1,
            borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
          }}/>

    <HighchartsReact highcharts={Highcharts} options={options} />

    {showTable && (
            <OTWagesDetail
            salaryDet={salaryDet}
              selectedBuyer={[filterBuyer]}
              closeTable={() => setShowTable(false)}
              setSearch={setSearch}
              search={search}
              // selectGender1={selectGender}
            />
          )}
</Card>
</>

};

export default OTwagessalary;
