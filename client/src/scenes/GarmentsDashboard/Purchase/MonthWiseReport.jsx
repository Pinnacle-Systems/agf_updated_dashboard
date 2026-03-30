import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, Box, useTheme } from "@mui/material";
import {
  useGetMonthPurchaseOrderQuery,
  useGetMonthGeneralPurchaseQuery,
  useGetMonthCombinedPurchaseQuery,
  useGetYearPurchaseOrderQuery,
  useGetYearPurchaseGeneralQuery,
  useGetYearPurchaseCombinedCOMPQuery,
  useGetQuarterPurchaseOrderQuery,
  useGetQuarterPurchaseGeneralQuery,
  useGetQuarterPurchaseCombinedCOMPQuery,
} from "../../../redux/service/purchaseService";
import MonthWiseTable from "./TableData/MonthTable";
import QuarterWiseTable from "./TableData/QuarterTable";
import YearWiseTable from "./TableData/TopTenSupplier";
import { skipToken } from "@reduxjs/toolkit/query";
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

const ViewDropdown = ({ viewBy, setViewBy, autoBorder }) => (
  <select
    className={`
       border-blue-600 transition-all duration-200 border-2   rounded-md 
    p-1 w-36 h-6.5 text-gray-900 text-xs`}
    value={viewBy}
    onChange={(e) => setViewBy(e.target.value)}
  >
    <option value="year">Year</option>

    <option value="quarter">Quarter</option>
    <option value="month">Month</option>
  </select>
);

const Form = ({ companyName, finYear, finYr, filterBuyerList, poType }) => {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [viewBy, setViewBy] = useState("year");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
  const [selectedMonthColor, setSelectedMonthColor] = useState("#00C49F");
  console.log(poType, "poType");

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatINRShort = (value) => {
    const num = Number(value);
    if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
    if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
    return formatINR(num);
  };

  const monthOrder = useGetMonthPurchaseOrderQuery(
    viewBy === "month" && finYear && companyName
      ? { params: { finYear, companyName } }
      : skipToken,
  );

  const monthGeneral = useGetMonthGeneralPurchaseQuery(
    viewBy === "month" && finYear && companyName
      ? { params: { finYear, companyName } }
      : skipToken,
  );

  const monthAll = useGetMonthCombinedPurchaseQuery(
    viewBy === "month" && finYear && companyName
      ? { params: { finYear, companyName } }
      : skipToken,
  );

  const monthResponse =
    poType === "All"
      ? monthAll
      : poType === "Order"
        ? monthOrder
        : monthGeneral;

  const monthChartData = useMemo(
    () =>
      (Array.isArray(monthResponse?.data?.data)
        ? monthResponse.data.data
        : []
      ).map((i) => ({
        month: i.month || i.label,
        value: Number(i.VAL || i.value),
        year: i.yearNo,
      })),
    [monthResponse?.data?.data],
  );

  const yearOrder = useGetYearPurchaseOrderQuery(
    viewBy === "year" && finYear && companyName
      ? { params: { finYear, companyName } }
      : skipToken,
  );
  const yearGeneral = useGetYearPurchaseGeneralQuery(
    viewBy === "year" && finYear && companyName
      ? { params: { finYear, companyName } }
      : skipToken,
  );

  const yearAll = useGetYearPurchaseCombinedCOMPQuery(
    viewBy === "year" && finYear && companyName
      ? { params: { finYear, companyName } }
      : skipToken,
  );

  // Pick the response based on poType
  const yearResponse =
    poType === "All" ? yearAll : poType === "Order" ? yearOrder : yearGeneral;
  // Extract data and loading states
  const yearChartData = useMemo(
    () =>
      (Array.isArray(yearResponse?.data?.data)
        ? yearResponse.data.data
        : []
      ).map((i) => ({
        label: i.FINYEAR,
        value: Number(i.VAL),
        compCode: i.COMPCODE,
      })),
    [yearResponse?.data?.data],
  );

  const yearLoading = yearResponse?.isLoading;
  const yearFetching = yearResponse?.isFetching;

  // ── same skip pattern for quarter ──
  const quarterOrder = useGetQuarterPurchaseOrderQuery(
    viewBy === "quarter" && finYear && companyName
      ? { params: { finYear, companyName } }
      : skipToken,
  );

  const quarterGeneral = useGetQuarterPurchaseGeneralQuery(
    viewBy === "quarter" && finYear && companyName
      ? { params: { finYear, companyName } }
      : skipToken,
  );

  const quarterAll = useGetQuarterPurchaseCombinedCOMPQuery(
    viewBy === "quarter" && finYear && companyName
      ? { params: { finYear, companyName } }
      : skipToken,
  );

  const quarterResponse =
    poType === "All"
      ? quarterAll
      : poType === "Order"
        ? quarterOrder
        : quarterGeneral;

  const quarterChartData = useMemo(
    () =>
      (Array.isArray(quarterResponse?.data?.data)
        ? quarterResponse.data.data
        : []
      ).map((i) => ({
        quarter: i.quarter || i.label,
        value: Number(i.VAL || i.value),
        month: i.month,
        year: i.yearNo,
      })),
    [quarterResponse?.data?.data],
  );

  /* ── combined loading — same as SlowMovement's isLoading / isFetching ── */
  const monthLoading = monthResponse?.isLoading;
  const monthFetching = monthResponse?.isFetching;

  /* ================================================================
     Data normalization
  ================================================================ */

  // year API returns { FINYEAR, COMPCODE, VAL }
  // const yearChartData = useMemo(
  //   () =>
  //     (Array.isArray(yearResponse?.data) ? yearResponse.data : []).map((i) => ({
  //       label: i.FINYEAR,
  //       value: Number(i.VAL),
  //       compCode: i.COMPCODE,
  //     })),
  //   [yearResponse?.data],
  // );

  // adjust field names to match your quarter API shape

  /* ================================================================
     Month chart mappings
  ================================================================ */
  const monthCategories = useMemo(
    () => monthChartData.map((i) => i.month ?? i.label),
    [monthChartData],
  );
  const monthSeriesData = useMemo(
    () => monthChartData.map((i) => Number(i.value)),
    [monthChartData],
  );

  const selectedMonthData = useMemo(
    () =>
      selectedMonthIndex !== null ? monthChartData[selectedMonthIndex] : null,
    [selectedMonthIndex, monthChartData],
  );
  /* ================================================================
     Quarter chart mappings (same shape as month — adjust if different)
  ================================================================ */
  const quarterCategories = useMemo(
    () => quarterChartData.map((i) => i.quarter ?? i.label),
    [quarterChartData],
  );
  const quarterSeriesData = useMemo(
    () => quarterChartData.map((i) => Number(i.value)),
    [quarterChartData],
  );

  /* ---- view change — same as SlowMovement's setSlowType ---- */
  const handleViewChange = (e) => {
    setViewBy(e.target.value);
    setSelectedMonth(null);
  };

  /* ================================================================
     MONTH CHART — spline (unchanged)
  ================================================================ */
  const monthChartOptions = useMemo(
    () => ({
      chart: { type: "spline", height: 430, backgroundColor: "transparent" },
      title: { text: "" },
      xAxis: {
        categories: monthCategories,
        lineColor: "#ddd",
        tickColor: "#ddd",
        labels: { style: { fontSize: "12px" } },
      },
      yAxis: {
        title: { text: "" },
        gridLineDashStyle: "Dash",
        labels: {
          formatter() {
            return formatINR(this.value);
          },
          style: { fontSize: "12px" },
        },
      },
      tooltip: {
        backgroundColor: "#000",
        style: { color: "#fff" },
        borderRadius: 8,
        formatter() {
          // Use the month and year from the data
          const data = monthChartData[this.point.index]; // get the raw data
          return `<b>${data.month}</b> - ${data.year}<br/>${formatINR(this.y)}`;
        },
      },
      plotOptions: {
        spline: {
          lineWidth: 3,
          marker: { enabled: true, radius: 4 },
          states: { hover: { lineWidth: 4 } },
          dataLabels: {
            enabled: true,
            formatter() {
              return formatINR(this.y);
            },
            style: { fontSize: "12px", fontWeight: "400", color: "#000" },
          },
          point: {
            events: {
              click() {
                setSelectedMonth(this.category);
                setSelectedMonthIndex(this.index);
                setSelectedMonthColor(this.color);
              },
            },
          },
        },
      },
      series: [
        {
          name: "Purchase",
          data: monthSeriesData,
          zoneAxis: "x",
          zones: [
            { value: 1, color: "#0088FE" },
            { value: 2, color: "#00C6FF" },
            { value: 3, color: "#00C49F" },
            { value: 4, color: "#FFBB28" },
            { value: 5, color: "#FF8042" },
            { value: 6, color: "#A28DFF" },
            { value: 7, color: "#FF6699" },
            { value: 8, color: "#33CC99" },
            { value: 9, color: "#FF6666" },
            { value: 10, color: "#66B2FF" },
            { value: 11, color: "#99FF66" },
            { color: "#FF9933" },
          ],
          marker: { enabled: true, radius: 4 },
        },
      ],
      legend: { enabled: false },
      credits: { enabled: false },
    }),
    [monthCategories, monthSeriesData],
  );

  /* ================================================================
     YEAR CHART — horizontal bar
  ================================================================ */
  const yearChartOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 430,
        backgroundColor: "transparent",
        margin: [20, 40, 60, 120],
      },
      title: { text: "" },
      xAxis: {
        categories: yearChartData.map((i) => i.label),
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
          return `<b>FY ${this.x}</b><br/>${formatINR(this.y)}`;
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          colorByPoint: true,
          dataLabels: {
            enabled: true,
            inside: true, // put label inside the bar
            align: "center", // horizontal center
            verticalAlign: "middle", // vertical center
            style: {
              fontSize: "30px",
              fontWeight: "600",
              color: "white",
              textAlign: "center",
            },
            formatter() {
              return formatINR(this.y); // same as tooltip
            },
          },
        },
      },
      colors: YEAR_COLORS,
      series: [{ name: "Purchase", data: yearChartData.map((i) => i.value) }],
      legend: { enabled: false },
      credits: { enabled: false },
    }),
    [yearChartData],
  );

  /* ================================================================
     QUARTER CHART — column (colorByPoint, same style as year)
  ================================================================ */

  // Define a color map for quarters
  const QUARTER_COLORS = {
    Q1: "#0088FE", // Apr-Jun
    Q2: "#00C49F", // Jul-Sep
    Q3: "#FFBB28", // Oct-Dec
    Q4: "#FF8042", // Jan-Mar
  };

  const quarterChartOptions = useMemo(
    () => ({
      chart: { type: "column", height: 430, backgroundColor: "transparent" },
      title: { text: "" },
      xAxis: {
        categories: quarterCategories,
        lineColor: "#ddd",
        tickColor: "#ddd",
        labels: { style: { fontSize: "12px" } },
      },
      yAxis: {
        title: { text: "" },
        gridLineDashStyle: "Dash",
        labels: {
          formatter() {
            return formatINRShort(this.value);
          },
          style: { fontSize: "12px" },
        },
      },
      tooltip: {
        backgroundColor: "#000",
        style: { color: "#fff" },
        borderRadius: 8,
        formatter() {
          return `<b>${this.x}</b><br/>${this.point.month} - ${this.point.year}<br/>${formatINR(this.y)}`;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 8,
           minPointLength: 90,
          dataLabels: {
            enabled: true,
            inside: true, // put label inside the bar
            rotation: -90, // rotate label -90 degrees
            align: "center", // horizontal alignment
            verticalAlign: "middle", // vertical alignment
            style: {
              fontSize: "13px",
              fontWeight: "600",
              color: "white", // white text for inside bars
            },
            formatter() {
              return formatINR(this.y);
            },
          },
        },
      },
      colors: YEAR_COLORS,
      series: [
        {
          name: "Purchase",
          data: quarterChartData.map((i) => ({
            y: i.value,
            month: i.month, // 👈 pass month here
            year: i.year,
            color: QUARTER_COLORS[i.quarter],
          })),
        },
      ],
      legend: { enabled: false },
      credits: { enabled: false },
    }),
    [quarterCategories, quarterSeriesData],
  );

  /* ================================================================
     CHILD CHART — drill-down for month view (unchanged)
  ================================================================ */
  const childOptions = selectedMonthData
    ? {
        chart: { type: "column", height: 383, backgroundColor: "transparent" },
        title: { text: "" },
        xAxis: {
          categories: [selectedMonth],
          lineColor: "#ddd",
          labels: { style: { fontSize: "12px" } },
        },
        yAxis: {
          title: { text: "" },
          gridLineDashStyle: "Dash",
          labels: { enabled: false },
        },
        tooltip: {
          backgroundColor: "#000",
          style: { color: "#fff" },
          borderRadius: 8,
          formatter() {
            return `<b>${this.x}</b><br/>${formatINR(this.y)}`;
          },
        },
        plotOptions: {
          column: {
            borderRadius: 8,
            pointWidth: 50,
            dataLabels: {
              enabled: true,
              inside: false,
              verticalAlign: "bottom",
              y: -10,
              style: { color: "#000", fontSize: "12px", fontWeight: "600" },
              formatter() {
                return formatINR(this.y);
              },
            },
          },
        },
        series: [
          {
            name: "Purchase",
            data: [Number(selectedMonthData.value)],
            color: {
              linearGradient: [0, 0, 0, 300],
              stops: [
                [0, selectedMonthColor],
                [1, Highcharts.color(selectedMonthColor).brighten(0.2).get()], // slightly lighter at bottom
              ],
            },
          },
        ],
        legend: { enabled: false },
        credits: { enabled: false },
      }
    : null;

  /* ================================================================
     RENDER
  ================================================================ */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={
          viewBy === "month"
            ? "Month Wise Purchase"
            : viewBy === "year"
              ? "Year Wise Purchase"
              : "Quarter Wise Purchase"
        }
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        action={
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <ViewDropdown viewBy={viewBy} setViewBy={setViewBy} />
          </Box>
        }
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent
        sx={{
          position: "relative", // ← needed for loader overlay
          backgroundColor: "#fff",
          mt: 1,
          ml: 1,
          height: 460,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Loading overlay — same as SlowMovement ── */}
        {(monthLoading || monthFetching) && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(2px)",
            }}
          >
            {/* swap for your SpinLoader if you have one */}
            <Box sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
              Loading…
            </Box>
          </Box>
        )}

        {/* ── MONTH VIEW ── */}
        {viewBy === "month" && (
          <Box sx={{ display: "flex", width: "100%", overflow: "hidden" }}>
            <Box sx={{ width: "80%", transition: "width 0.35s ease" }}>
              <HighchartsReact
                key="month-chart"
                highcharts={Highcharts}
                options={monthChartOptions}
                immutable
              />
            </Box>
            <Box sx={{ width: "20%", transition: "width 0.35s ease" }}>
              <Card sx={{ height: "100%", ml: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 1,
                    py: 0.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    {selectedMonth || ""} Purchase Details
                  </Box>
                </Box>
                <CardContent>
                  {selectedMonth && childOptions ? (
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={childOptions}
                      immutable
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 260,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                        fontSize: "0.85rem",
                      }}
                    >
                      Click a month to view details
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* ── YEAR VIEW ── */}
        {viewBy === "year" && (
          <Box>
            <HighchartsReact
              key="year-chart"
              highcharts={Highcharts}
              options={yearChartOptions}
            />
          </Box>
        )}

        {/* ── QUARTER VIEW ── */}
        {viewBy === "quarter" && (
          <Box>
            <HighchartsReact
              key="quarter-chart"
              highcharts={Highcharts}
              options={quarterChartOptions}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Form;
