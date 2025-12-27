import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Drilldown from "highcharts/modules/drilldown";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
} from "@mui/material";
import { useGetMisDashboardErpStyleItemWiseQuery } from "../../../redux/service/misDashboardServiceERP";

Drilldown(Highcharts);

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const Form = ({ finYear, companyName }) => {
  const theme = useTheme();
  const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const { data: response } =
    useGetMisDashboardErpStyleItemWiseQuery({
      params: { finYear, companyName },
    });

  const filteredData = Array.isArray(response?.data)
    ? response.data.filter(i => Number(i.value) > 0)
    : [];

  // ------------------ AGGREGATION ------------------
  const categoryTotal = {};
  const drilldownTemp = {}; // category -> styleItem -> value

  filteredData.forEach(item => {
    const category = item.category;
    let style = item.styleItem;
    if (style.startsWith(category + "/")) {
      style = style.substring(category.length + 1); // remove "CATEGORY/"
    }
    const value = Number(item.value);

    // 1️⃣ Category total
    categoryTotal[category] = (categoryTotal[category] || 0) + value;

    // 2️⃣ Style item total inside category
    if (!drilldownTemp[category]) {
      drilldownTemp[category] = {};
    }

    drilldownTemp[category][style] =
      (drilldownTemp[category][style] || 0) + value;
  });

  // ------------------ MAIN SERIES ------------------
  const mainSeries = Object.keys(categoryTotal).map((cat, i) => ({
    name: cat,
    y: categoryTotal[cat],
    drilldown: cat,
    color: COLORS[i % COLORS.length],
  }));

  // ------------------ DRILLDOWN SERIES ------------------
  const drilldownSeries = Object.keys(drilldownTemp).map(cat => ({
    id: cat,
    name: `${cat} Style Items`,
    data: Object.entries(drilldownTemp[cat]).map(
      ([style, value]) => [style, value]
    ),
  }));


  const options = {
    chart: {
      type: "column",
      height: 420,
    },

    title: { text: "" },

    xAxis: {
      type: "category",
      labels: {
        useHTML: true,
        rotation: -45, // rotate labels -45 degrees
        align: 'right', // optional, for better alignment
        fontWeight: "400",   // ✅ force normal

        style: {
          color: "black",
          fontSize: "11px",
          textDecoration: "none",
          cursor: "pointer",
          fontWeight: "400", // ✅ works now

        },
      },
    },


    yAxis: {
      title: { text: "Turnover" },
      labels: {
        formatter() {
          return formatINR(this.value);
        },
      },
    },

    tooltip: {
      pointFormatter() {
        return `<b>${formatINR(this.y)}</b>`;
      },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter() {
            return formatINR(this.y);
          },
          style: {
            color: "#000",
            fontWeight: "400",   // ✅ force normal
            fontSize: "11px",
          },
        },
      },
      column: {
        borderRadius: 3,
        pointWidth: 30,
      },
    },

    series: [
      {
        name: "Category",
        colorByPoint: true,
        data: mainSeries,
      },
    ],

    drilldown: {
      series: drilldownSeries.map((s) => ({
        ...s,
        data: s.data.map(([name, value]) => [name, value]),
        // format dataLabels for drilldown
        dataLabels: {
          enabled: true,
          formatter() {
            return formatINR(this.y);
          },
          style: { color: "#000", fontWeight: "400", fontSize: "11px" },
        },
      })),
      activeDataLabelStyle: { color: "#000", fontWeight: "400", textDecoration: "none" },
      drillUpButton: {
        position: { align: "right", verticalAlign: "top", x: -10, y: 10 },
        theme: {
          fill: "#fff",
          stroke: "#ccc",
          "stroke-width": 1,
          r: 3,
          style: { color: "#000", fontWeight: "400" },
        },
      },
      // format tooltip for drilldown
      tooltip: {
        pointFormatter() {
          return `<b>${formatINR(this.y)}</b>`;
        },
      },
    },


    legend: { enabled: false },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Style Group Wise Turnover"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default Form;
