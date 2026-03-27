import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useGetRawMaterialWiseQuery } from "../../../redux/service/purchaseService";

const RawMeterialWiseReport = ({
  companyName,
  finYear,
  finYr,
  filterBuyerList,
  poType,
}) => {
  const [xdata, setXdata] = useState([]);
  const [ydata, setYdata] = useState([]);
  const theme = useTheme();
  const [showTable, setShowTable] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

  const { data: response, isLoading } = useGetRawMaterialWiseQuery({
    params: { finYear, companyName },
  });

const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  useEffect(() => {
    if (response?.data) {
      // Map TYPENAME to x-axis and VAL to y-axis
      setXdata(response.data.map((item) => item.TYPENAME));
      setYdata(response.data.map((item) => Number(item.VAL)));
    }
  }, [response]);

  const colorArray = [
    "#8A37DE",
    "#005E72",
    "#E5181C",
    "#056028",
    "#1F2937",
    "#F44F5E",
    "#E55A89",
    "#D863B1",
    "#CA6CD8",
    "#B57BED",
    "#8D95EB",
    "#62ACEA",
    "#4BC3E6",
  ];

  const options = {
    chart: {
      type: "column",
      height: 380,
      options3d: {
        enabled: true,
        alpha: 7,
        beta: 7,
        depth: 50,
        viewDistance: 25,
      },
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
    },
    title: null,
    legend: { enabled: false },
    tooltip: {
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormatter() {
        return `Purchase: <b>${formatINR(this.y)}</b>`;
      },
      style: { fontSize: "12px", color: "black" },
    },
    xAxis: {
      categories: xdata,
      labels: { style: { fontSize: "11px", color: "#6B7280" } },
      title: {
        text: "Raw Material Type",
        style: { fontSize: "12px", fontWeight: "bold", color: "#374151" },
        margin: 30,
      },
    },
    yAxis: {
      title: {
        text: "Purchase",
        style: { fontSize: "12px", fontWeight: "bold", color: "#374151" },
        margin: 25,
      },
      labels:{ enabled: false },
    },
    plotOptions: {
      column: {
        depth: 25,
        colorByPoint: true,
        borderRadius: 5,
        dataLabels: {
          enabled: true,
          formatter() {
            return formatINR(this.y);
          },
          style: { fontSize: "11px", color: "#333" },
        },
      },
      series: {
        point: {
          events: {
            click: function () {
              setSelectedYear({
                year: this.category,
              });
              setShowTable(true);
            },
          },
        },
      },
    },
    colors: colorArray,
    series: [
      {
        name: "Turnover",
        data: ydata,
      },
    ],
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Raw Material Wise Purchase"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{
          p: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />
      <CardContent>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            immutable
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RawMeterialWiseReport;
