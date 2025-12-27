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
  "#4F46E5", // Indigo Blue
  "#22C55E", // Green
  "#F97316", // Orange
  "#EF4444", // Red
];

const Form = ({ companyName, finYear }) => {
  const theme = useTheme();

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const { data: response, isLoading } =
    useGetMisDashboardErpQuarterWiseQuery({
      params: { finYear, companyName },
    });

  const chartData = Array.isArray(response?.data)
    ? response.data
    : [];

  // 🔹 Group by Quarter with Month details
  const quarterMap = chartData.reduce((acc, item) => {
    const q = item.Quarter;

    if (!acc[q]) {
      acc[q] = {
        total: 0,
        months: [],
      };
    }

    acc[q].total += Number(item.value) || 0;
    acc[q].months.push({
      name: item.monthName.trim(),
      value: Number(item.value) || 0,
    });

    return acc;
  }, {});

  // 🔹 Prepare Treemap Data
  const treemapData = Object.entries(quarterMap).map(
    ([quarter, data], index) => ({
      name: quarter,
      value: data.total,
      months: data.months, // 👈 used in tooltip
      color: COLORS[index % COLORS.length],
    })
  );

  const options = {
    chart: {
      height: 380,
    },

    title: { text: "" },

    tooltip: {
      useHTML: true,
      formatter() {
        const { name, value, months } = this.point;

        const monthHtml = months
          .map(
            (m) =>
              `<div>${m.name}: <b>${formatINR(m.value)}</b></div>`
          )
          .join("");

        return `
          <b>${name}</b><br/>
          <div style="margin-top:4px;">
            ${monthHtml}
          </div>
          <hr/>
          <b>Total: ${formatINR(value)}</b>
        `;
      },
    },

    plotOptions: {
      treemap: {
        layoutAlgorithm: "squarified",
        dataLabels: {
          enabled: true,
          align: "center",
          verticalAlign: "middle",
          formatter() {
            return `
              <b>${this.point.name}</b><br/>
              ${formatINR(this.point.value)}
            `;
          },
          style: {
            color: "#FFFFFF",
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
