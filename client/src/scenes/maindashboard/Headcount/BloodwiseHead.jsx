import { useEffect, useState } from "react";
import {
  useGetMisDashboardBgDetQuery,
  useGetMisDashboardOrdersInHandQuery,
} from "../../../redux/service/misDashboardService";
import { Box, Card, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useGetTopItemsQuery } from "../../../redux/service/poData";
import SortedBarChart from "../../MisDashboard/BloodGroupDistribution/SortedBarChart";
import ExpHeadDetail from "../../../components/Headcount/Expdetail";

const BGhead = ({ companyName, selectedState, HeadData }) => {
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
  const { data: BGdata } = useGetTopItemsQuery({ filterBuyer: filterBuyer });
    console.log(BGdata, "BGdata");

  const filteredData = Array.isArray(BGdata?.data)
    ? BGdata?.data.filter((row) => {
        if (selectedState === "Labour") return row?.Paycat !== "STAFF";
        if (selectedState === "Staff") return row?.Paycat === "STAFF";
        return true;
      })
    : [];

  const totalsByComp = filteredData.reduce((acc, emp) => {
    const code = emp.BGF || "Unknown";
    acc[code] = (acc[code] || 0) + (emp.headcount || 0);
    return acc;
  }, {});

  const Chartdata = Object.entries(totalsByComp).map(([x, y]) => ({
    Agerange: x,
    Headcount: y,
  }));

  console.log(BGdata, "Agedata1");

  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 195,
      marginBottom: 0,
      marginTop: 0,
    },
    title: {
      text: null,
      style: { fontSize: "16px", fontWeight: "600" },
    },
    // subtitle: {
    //   text: "Click on a slice for details",
    //   style: { fontSize: "13px", color: "#888" },
    // },
    tooltip: {
      pointFormat:
        "<b>{point.name}</b>: {point.y} Employees<br/>({point.percentage:.1f}%)",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 1,
        dataLabels: {
          enabled: true,
          distance: -1,
          format: "{point.name} </br>{point.percentage:.1f}%",
          style: {
            fontSize: "10px",
            textOutline: "none",
          },
        },
        point: {
          events: {
            click: function () {
              console.log("Clicked Slice:", this.name, this.y);

              setSearch((prev) => ({
                ...prev,
                BGF: this.name,
              }));

              setShowTable(true);
            },
          },
        },
      },
    },
    colors: [
      "#F44F5E",
      "#E55A89",
      "#D863B1",
      "#CA6CD8",
      "#B57BED",
      "#8D95EB",
      "#62ACEA",
      "#4BC3E6",
    ],
    series: [
      {
        name: "Departments",
        colorByPoint: true,
        data: Chartdata?.map((item, i) => ({
          name: item.Agerange,
          y: item.Headcount,
        })),
      },
    ],
    drilldown: {
      series: [],
    },
  };

  return (
    <>
      <Card
        sx={{
          ml:1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <CardHeader
          title="Blood Group wise HeadCount"
          titleTypographyProps={{
            sx: { fontSize: ".9rem", fontWeight: 600 },
          }}
          sx={{
            p: 1,
            borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
          }}
        />
        <Box>
          <SortedBarChart
            topItems={Chartdata}
            setSearch={setSearch}
            setShowTable={setShowTable}
          />
          {/* <HighchartsReact highcharts={Highcharts} options={options} /> */}
        </Box>

        {showTable && (
          <ExpHeadDetail
            selectedBuyer={[filterBuyer]}
            closeTable={() => setShowTable(false)}
            setSearch={setSearch}
            search={search}
            HeadData={HeadData}
          />
        )}
      </Card>
    </>
  );
};
export default BGhead;
