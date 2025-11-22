import { Card, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useGetMisDashboardSalaryDetQuery } from "../../../redux/service/misDashboardService";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import EmptypeDetails from "../../../components/EmptypesalayDetails";

const EmpType = ({ companyName, selectedState, salary }) => {

  const [search, setSearch] = useState({
      FNAME: "",
      GENDER: "",
      MIDCARD: "",
      DEPARTMENT: "",
      COMPCODE: "",
    });
    const [showTable, setShowTable] = useState(false);
     const [filterBuyer, setFilterBuyer] = useState(companyName);
  const filteredData = Array.isArray(salary)
    ? salary.filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
    : [];

  const totalsByComp = filteredData.reduce((acc, emp) => {
    const code = emp.EMPTYPE || "Unknown";
    acc[code] = (acc[code] || 0) + (emp.NETPAY || 0);
    return acc;
  }, {});

  const Chartdata = Object.entries(totalsByComp).map(([x, y]) => ({
    Emptype: x,
    Netpay: y,
  }));

  // console.log(Chartdata, "Chartdata41");

  const seriesdata = Chartdata?.map((item) => item.Netpay);
  const categories = Chartdata?.map((item) => item.Emptype);

  // const options = {
  //   chart: {
  //     height:200,
  //     type: "pie",
  //     backgroundColor: "#f2f2f2",
  //   },
  //   title: {
  //     text: "",
  //   },
  //   plotOptions: {
  //     pie: {
  //       startAngle: -90,
  //       endAngle: 90,
  //       center: ["50%", "75%"],
  //       size: "110%",
  //       dataLabels: {
  //         enabled: true,
  //       },
  //     },
  //   },
  //   series: [
  //     {
  //       innerSize: "60%",
  //       data: Chartdata.map((item,i)=>({
  //         name:item.Emptype,
  //         y:item.Netpay
  //       }))
  //     },
  //   ],
  // };

  const chartData = {
    series: [
      {
        name: "Total",
        data: seriesdata,
      },
    ],
    options: {
      chart: {
        background: "#f5f5f5",
        type: "bar",
        height:200,
        toolbar: { show: false },
        events: {
    dataPointSelection: (event, chartContext, config) => {
      const clickedCategory = config.w.config.xaxis.categories[config.dataPointIndex];
      const clickedValue = config.w.config.series[0].data[config.dataPointIndex];

      // console.log("Clicked Category:", clickedCategory);
      // console.log("Clicked Value:", clickedValue);


      setSearch((prev) => ({
                ...prev,
                EMPTYPE: clickedCategory,
              }));
              setShowTable(true);
   
    },
  },
      },
      yaxis: {
        axisBorder: {
          show: true,
          color: "black", // darker line
          width: 2, // make it thicker
        },
        axisTicks: {
          show: true,
          color: "black",
          width: 2,
        },
      },

      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: "40%",
          colors: { backgroundBarColors: [] },
        },
      },
      colors: ["#FFA726"],
      dataLabels: { enabled: false },
      xaxis: {
        categories: categories,
        labels: {
          style: { fontSize: "13px", colors: "#666" },
          formatter: function (value) {
            if (value === 0) return ""; // don't show 0M
            return Math.round(value / 1000000) + "M";
          },
        },
      },

      grid: {
        borderColor: "#eee",
        strokeDashArray: 3,
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val) => `${val.toLocaleString()} Netpay`,
        },
      },
    },
  };

  return (
    <>
      <Card sx={{ backgroundColor: "#f5f5f5",}}>
          <CardHeader title="Employee type wise Salary" titleTypographyProps={{
            sx: { fontSize: ".9rem", fontWeight: 600},
          }}  
          sx={{
            p:1,
            borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
          }}/>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={120}
         />

          {showTable && (
        <EmptypeDetails
          selectedBuyer={[filterBuyer]}
          closeTable={() => setShowTable(false)}
          setSearch={setSearch}
          search={search}
          // selectGender1={selectGender}
        />
      )}
      </Card>
    </>
  );
};

export default EmpType;
