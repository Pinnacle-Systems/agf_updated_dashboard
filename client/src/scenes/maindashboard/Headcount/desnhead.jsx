import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import {
  useGetHeadCountDetailQuery,
  useGetHeadCountQuery,
  useGetMisDashboardOrdersInHandQuery,
} from "../../../redux/service/misDashboardService";
import { useTheme } from "@emotion/react";
import HeadDetailedCom from "../../../components/Headcount/HeadDetail";

// Initialize Highcharts drilldown safely
if (typeof Highcharts === "object") {
  drilldown(Highcharts);
}

const DesgHead = ({ companyName, selectedState, HeadData }) => {
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

  const filteredData = Array.isArray(HeadData)
    ? HeadData.filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
    : [];

  const groupeddata = filteredData?.reduce((acc, item) => {
    const code = item.DESIGNATION || "Unknown";
    if (!acc[code]) {
      acc[code] = [];
    }
    acc[code].push(item);

    return acc;
  }, {});

  console.log(groupeddata, "groupeddataas");

  const deptHeadcount = {};

  Object.keys(groupeddata || {}).forEach((dept) => {
    deptHeadcount[dept] = groupeddata[dept].length;
  });

  console.log(deptHeadcount, "groupeddataas");

  const fortmatdata = Object.entries(deptHeadcount).map(([x, y]) => ({
    department: x,
    headcount: y,
  }));

  const chartData = useMemo(() => {
    if (!fortmatdata) return [];
    return fortmatdata?.map((item) => ({
      name: item.department,
      y: Number(item.headcount || 0),
    }));
  }, [fortmatdata]);
  console.log(chartData, "HeadDetail");
  const options = {
    chart: {
      type: "column",
      marginBottom: 70,
      backgroundColor: "#f5f5f5",
      height: 250,
    },
    title: {
      text: null,
    },

    xAxis: {
      type: "category",
      labels: {
        autoRotation: [-45, -90],
        style: {
          fontSize: "8px",
          fontFamily: "Verdana, sans-serif",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Headcount",
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "Headcount:<b>{point.y} </b>",
    },
    plotOptions: {
      series: {
        cursor: "pointer",
        point: {
          events: {
            click() {
              console.log("Clicked Dept:", this.name);
              const desg = this.name;
              setSearch((prev) => ({
                ...prev,
                DESIGNATION: desg,
              }));
              setShowTable(true);
            },
          },
        },
      },
    },

    series: [
      {
        name: "Population",
        colors: [
          "#9b20d9",
          "#9215ac",
          "#861ec9",
          "#7a17e6",
          "#7010f9",
          "#691af3",
          "#6225ed",
          "#5b30e7",
          "#533be1",
          "#4c46db",
          "#4551d5",
          "#3e5ccf",
          "#3667c9",
          "#2f72c3",
          "#277dbd",
          "#1f88b7",
          "#1693b1",
          "#0a9eaa",
          "#03c69b",
          "#00f194",
        ],
        colorByPoint: true,
        groupPadding: 0,
        data: chartData,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: "#FFFFFF",
          inside: true,
          verticalAlign: "top",
          format: "{point.y}",
          y: 10,
          style: {
            fontSize: "10px",
            fontFamily: "Verdana, sans-serif",
          },
        },
      },
    ],
  };

  return (
    <Card
      sx={{
        ml:2,
        mt:1,
        backgroundColor: "#f5f5f5",
      }}
    >
      <CardHeader
        title="Designation wise HeadCount"
        titleTypographyProps={{
          sx: { fontSize: ".9rem", fontWeight: 600 },
        }}
        sx={{
          p: 1,
          borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
        }}
      />
      <Box>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>

     {showTable && (
               <HeadDetailedCom
                 selectedBuyer={[filterBuyer]}
                 closeTable={() => setShowTable(false)}
                 setSearch={setSearch}
                 search={search}
                 HeadData={HeadData}
                />
             )}
    </Card>
  );
};

export default DesgHead;
