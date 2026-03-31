import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";

import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
import {
  useGetYearPurchaseOrderQuery,
  useGetYearPurchaseGeneralQuery,
  useGetYearPurchaseCombinedCOMPQuery,
} from "../../../redux/service/purchaseService";
import YearWiseTable from "./TableData/YearTable";
import { useEffect } from "react";

const YEAR_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF6699",
  "#33CC99",
  "#66B2FF",
];
highchartsMore(Highcharts);

const Form = ({ companyName, finYear, finYr, poType, companyList }) => {
  const theme = useTheme();
  const [showYearTable, setShowYearTable] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCompCode, setSelectedCompCode] = useState("");
  console.log(poType, "poType");
  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatINRShort = (value) => {
    const num = Number(value);
    if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
    if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
    return `₹ ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // API calls
  const { data: yearOrderResponse } = useGetYearPurchaseOrderQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );
  const { data: yearGeneralResponse } = useGetYearPurchaseGeneralQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );
  const { data: yearAllResponse } = useGetYearPurchaseCombinedCOMPQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );
  useEffect(() => {
    setShowYearTable(false);
    setSelectedYear(null);
    setSelectedCompCode("");
  }, [poType]);
  // --- Chart 1: Purchase Order ---

  const chartOrderOptions = useMemo(() => {
    if (!yearOrderResponse?.data) return {};

    // Extract all unique years
    const years = [
      ...new Set(
        yearOrderResponse.data.flatMap((item) =>
          item.data.map((d) => d.FINYEAR),
        ),
      ),
    ];

    // Build series: one series per type
    const series = yearOrderResponse.data.map((item, index) => ({
      name: item.type,
      data: years.map((year) => {
        const found = item.data.find((d) => d.FINYEAR === year);
        return found ? found.VAL : 0;
      }),
      color: YEAR_COLORS[index % YEAR_COLORS.length], // series color
      minPointLength: 30,
      showInLegend: true, // <-- LEGEND property belongs here
      colorByPoint: false, // <-- SERIES property, not dataLabels
      dataLabels: {
        enabled: true,
        inside: false,
        formatter: function () {
          return formatINR(this.y);
        },
        style: { fontSize: "12px", fontWeight: "bold", color: "#000" },
      },
    }));

    return {
      chart: { type: "column", height: 400 },
      title: { text: "" },
      xAxis: {
        categories: years,
        title: { text: "Financial Year" },
      },
      yAxis: {
        title: { text: "Amount" },
        labels: {
          formatter: function () {
            return formatINRShort(this.value);
          },
        },
      },
      series,
      tooltip: {
        pointFormatter: function () {
          return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formatINRShort(this.y)}</b><br/>`;
        },
      },
      legend: {
        symbolHeight: 12, // adjust legend marker size
        symbolWidth: 12,
        symbolRadius: 0,
      },
    };
  }, [yearOrderResponse]);

  // --- Chart 2: General Purchase ---

  const chartGeneralOptions = useMemo(() => {
    const data =
      yearGeneralResponse?.data?.map((d) => ({
        y: d.VAL, // numeric value for the bar
        FINYEAR: d.FINYEAR,
        COMPCODE: d.COMPCODE,
      })) || [];

    return {
      chart: {
        type: "bar",
        height: 400,
        backgroundColor: "transparent",
        margin: [20, 40, 60, 120],
      },
      title: { text: "" },
      xAxis: {
        categories: data.map((d) => d.FINYEAR),
        lineColor: "#ddd",
        tickColor: "#ddd",
        labels: {
          style: { fontSize: "13px", fontWeight: "600", color: "#333" },
        },
      },
      yAxis: {
        title: { text: "" },
        gridLineDashStyle: "Dash",
        labels: {
          formatter() {
            return formatINRShort(this.value);
          },
          style: { fontSize: "11px" },
        },
      },
      tooltip: {
        backgroundColor: "#000",
        style: { color: "#fff" },
        borderRadius: 8,
        formatter() {
          return `<b>FY ${this.x}</b><br/>${formatINRShort(this.y)}`;
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          colorByPoint: true,
          cursor: "pointer",
          point: {
            events: {
              click: function () {
                const clickedData = data[this.index];
                setSelectedYear(clickedData.FINYEAR);
                setSelectedCompCode(clickedData.COMPCODE);
                setShowYearTable(true);
              },
            },
          },
          dataLabels: {
            enabled: true,
            inside: true,
            align: "center",
            verticalAlign: "middle",
            style: {
              fontSize: "30px",
              fontWeight: "600",
              color: "white",
              textAlign: "center",
            },
            formatter() {
              return formatINR(this.y);
            },
          },
        },
      },
      colors: YEAR_COLORS,
      series: [{ name: "Purchase", data }],
      legend: { enabled: false },
      credits: { enabled: false },
    };
  }, [yearGeneralResponse]);

  // --- Chart 3: Combined Purchase ---
  const chartCombinedOptions = useMemo(() => {
    const data =
      yearAllResponse?.data?.map((d) => ({
        y: d.VAL, // numeric value for the bar
        FINYEAR: d.FINYEAR,
        COMPCODE: d.COMPCODE,
      })) || [];
    return {
      chart: {
        type: "column",
        height: 400,
        backgroundColor: "transparent",
        margin: [20, 40, 60, 120],
      },
      title: { text: "" },
      xAxis: {
        categories: data.map((d) => d.FINYEAR),
        lineColor: "#ddd",
        tickColor: "#ddd",
        labels: {
          style: { fontSize: "13px", fontWeight: "600", color: "#333" },
        },
      },
      yAxis: {
        title: { text: "" },
        gridLineDashStyle: "Dash",
        labels: {
          formatter() {
            return formatINRShort(this.value);
          },
          style: { fontSize: "11px" },
        },
      },
      tooltip: {
        backgroundColor: "#000",
        style: { color: "#fff" },
        borderRadius: 8,
        formatter() {
          return `<b>FY ${this.x}</b><br/>${formatINRShort(this.y)}`;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 6,
          colorByPoint: true,

          dataLabels: {
            enabled: true,
            inside: true,
            align: "center",
            verticalAlign: "middle",
            style: {
              fontSize: "30px",
              fontWeight: "600",
              color: "white",
              textAlign: "center",
            },
            formatter() {
              return formatINR(this.y);
            },
          },
        },
      },
      colors: YEAR_COLORS,
      series: [{ name: "Purchase", data }],
      legend: { enabled: false },
      credits: { enabled: false },
    };
  }, [yearAllResponse]);

  const chartToRender = useMemo(() => {
    if (!poType) return null;

    const type = poType.trim().toLowerCase(); // normalize

    switch (type) {
      case "order":
        return chartOrderOptions;
      case "general":
        return chartGeneralOptions;
      case "all":
        return chartCombinedOptions;
      default:
        return null;
    }
  }, [poType, chartOrderOptions, chartGeneralOptions, chartCombinedOptions]);

  const valOptions = useMemo(() => {
    if (!yearOrderResponse?.data) return [];
    // Map the array of objects to just the 'type' values
    return yearOrderResponse.data.map((item) => item.type);
  }, [yearOrderResponse]);

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={"Year Wise Purchase"}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          mt: 1,
          ml: 1,
          minHeight: 460,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!showYearTable && chartToRender && (
          <HighchartsReact
            highcharts={Highcharts}
            options={chartToRender}
            key={poType}
          />
        )}

        {showYearTable && selectedYear && (
          <YearWiseTable
            year={selectedYear}
            poType={poType}
            companyList={companyList}
            selectedCompCode={selectedCompCode}
            finYr={finYr} valOptions={valOptions}
            closeTable={() => setShowYearTable(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Form;
