import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Treemap from "highcharts/modules/treemap";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
} from "@mui/material";
import { useGetMisDashboardErpQuarterWiseQuery } from "../../../redux/service/misDashboardServiceERP";

// Initialize treemap module
Treemap(Highcharts);

const COLORS = [
  "#4F46E5", // Indigo Blue (primary)
  "#22C55E", // Fresh Green
  "#F97316", // Warm Orange
  "#EF4444", // Soft Red
];

const Form = ({ companyName, finYear }) => {
  const theme = useTheme();

  const { data: response, isLoading } =
    useGetMisDashboardErpQuarterWiseQuery({
      params: { finYear, companyName },
    });

  const chartData = Array.isArray(response?.data)
    ? response.data
    : [];

  // 🔹 Prepare Treemap data
  const treemapData = chartData.map((item, index) => ({
    name: item.Quarter,              // Q1, Q2, Q3, Q4
    value: Number(item.value),       // Turnover
    color: COLORS[index % COLORS.length],
  }));

  const options = {
    chart: {
      height: 380,
    },

    title: { text: "" },

    tooltip: {
      pointFormatter() {
        return `
          <b>${this.name}</b><br/>
          Turnover: <b> ${this.value.toLocaleString("en-IN")}</b>
        `;
      },
    },

    plotOptions: {
      treemap: {
        layoutAlgorithm: "squarified",
        dataLabels: {
          enabled: true,
          align: "center",
          color:"white",
          verticalAlign: "middle",
          formatter() {
            return `
              <b>${this.point.name}</b><br/>
              ${this.point.value.toLocaleString("en-IN")}
            `;
          },
          style: {
            textOutline: "none",
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
      },
    },

    series: [
      {
        type: "treemap",
        data: treemapData,
      },
    ],

    credits: {
      enabled: false,
    },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Quarter Wise Turnover"
        titleTypographyProps={{
          sx: { fontSize: ".9rem", fontWeight: 600 },
        }}
        sx={{
          p: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />
      <CardContent>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading...
          </div>
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

export default Form;
