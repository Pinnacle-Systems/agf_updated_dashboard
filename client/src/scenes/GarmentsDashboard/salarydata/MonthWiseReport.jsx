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

const Form = ({ finYear }) => {
  const theme = useTheme();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const { data: response } =
    useGetMisDashboardErpCountryWiseQuery({
      params: { finYear },
    });

  const filteredData = Array.isArray(response?.data)
    ? response.data
    : [];

  // ✅ Pie chart data
  const pieData = filteredData
    .filter(item => Number(item.value) > 0)
    .map((item, index) => ({
      name: item.countryName,
      y: Number(item.value),
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
          Turnover: <b>${this.y.toLocaleString("en-IN")}</b><br/>
         
        `;
      },
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format:
            "<b>{point.name}</b>: {point.percentage:.1f} %",
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
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1}}>
      <CardHeader
        title="Month Wise Turnover"
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
