import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
} from "@mui/material";
import { useGetMisDashboardErpCountryWiseQuery } from "../../../redux/service/misDashboardServiceERP";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const Form = ({ companyName, finYear }) => {
  const theme = useTheme();
const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;



  const [selectedCountry, setSelectedCountry] = useState(null);

  const { data: response } =
    useGetMisDashboardErpCountryWiseQuery({
      params: { finYear, companyName },
    });

  const filteredData = Array.isArray(response?.data)
    ? response.data
    : [];

  // ✅ Pie chart data
  const pieData = filteredData
    .filter(item => item.value > 0)
    .map((item, index) => ({
      name: item.countryName,
      y: item.value || 0,
      color: COLORS[index % COLORS.length],
    }));

  const options = {
    chart: {
      type: "pie",
      height: 380,
    },

    title: { text: "" },

    tooltip: {
      formatter() {
        return `
      <b>${this.point.name}</b><br/>
      Turnover: <b>${formatINR(this.y)}</b>
    `;
      },
    },


    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() {
            return `<b>${this.point.name}</b>: ${formatINR(this.y)}`;
          },
          style: {
            fontSize: "11px",
            fontWeight: "bold",
          },
        },

      },
    },

    series: [
      {
        name: "Turnover",
        data: pieData,
      },
    ],

    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
    },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 2, ml: 1 }}>
      <CardHeader
        title="Country Wise Turnover"
        titleTypographyProps={{
          sx: { fontSize: ".9rem", fontWeight: 600 },
        }}
        sx={{
          p: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />
      <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          immutable
        />
      </CardContent>
    </Card>
  );
};

export default Form;
