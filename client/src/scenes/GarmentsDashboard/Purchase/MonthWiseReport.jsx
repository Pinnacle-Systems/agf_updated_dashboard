import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  MenuItem,
  Select,
  FormControl,
  useTheme,
} from "@mui/material";
import {
  useGetMonthPurchaseOrderQuery,
  useGetYearPurchaseOrderQuery,
  useGetQuarterPurchaseOrderQuery, // add if you have it
} from "../../../redux/service/purchaseService";

const VIEW_OPTIONS = [
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "quarter", label: "Quarter" },
];

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
    className={`${
      autoBorder
        ? "border-2 border-blue-600"
        : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    } p-1 w-36 h-6.5 text-gray-900 text-xs rounded-md`}
    value={viewBy}
    onChange={(e) => setViewBy(e.target.value)}
  >
    <option value="month">Month</option>
    <option value="quarter">Quarter</option>
    <option value="year">Year</option>
  </select>
);
const Form = ({ companyName, finYear, finYr, filterBuyerList, poType }) => {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [viewBy, setViewBy] = useState("month");

const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatINRShort = (value) => {
    const num = Number(value);
    if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
    if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
    return formatINR(num);
  };

  /* ================================================================
     APIs — same skip pattern as SlowMovement
  ================================================================ */
  const {
    data: monthResponse,
    isLoading: monthLoading,
    isFetching: monthFetching,
  } = useGetMonthPurchaseOrderQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName || viewBy !== "month" },
  );

  const {
    data: yearResponse,
    isLoading: yearLoading,
    isFetching: yearFetching,
  } = useGetYearPurchaseOrderQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName || viewBy !== "year" },
  );

  // ── same skip pattern for quarter ──
  const {
    data: quarterResponse,
    isLoading: quarterLoading,
    isFetching: quarterFetching,
  } = useGetQuarterPurchaseOrderQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName || viewBy !== "quarter" },
  );

  /* ── combined loading — same as SlowMovement's isLoading / isFetching ── */
  const isLoading =
    viewBy === "month"
      ? monthLoading
      : viewBy === "year"
        ? yearLoading
        : quarterLoading;

  const isFetching =
    viewBy === "month"
      ? monthFetching
      : viewBy === "year"
        ? yearFetching
        : quarterFetching;

  /* ================================================================
     Data normalization
  ================================================================ */
  const monthChartData = useMemo(
    () => (Array.isArray(monthResponse?.data) ? monthResponse.data : []),
    [monthResponse?.data],
  );

  // year API returns { FINYEAR, COMPCODE, VAL }
  const yearChartData = useMemo(
    () =>
      (Array.isArray(yearResponse?.data) ? yearResponse.data : []).map((i) => ({
        label: i.FINYEAR,
        value: Number(i.VAL),
        compCode: i.COMPCODE,
      })),
    [yearResponse?.data],
  );

  // adjust field names to match your quarter API shape
  const quarterChartData = useMemo(
    () => (Array.isArray(quarterResponse?.data) ? quarterResponse.data : []),
    [quarterResponse?.data],
  );

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
    () => monthChartData.find((i) => (i.month ?? i.label) === selectedMonth),
    [selectedMonth, monthChartData],
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
          return `<b>${this.x}</b><br/>${formatINR(this.y)}`;
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
          return `<b>${this.x}</b><br/>${formatINR(this.y)}`;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 8,
          colorByPoint: true,
          dataLabels: {
            enabled: true,
            inside: false,
            style: { fontSize: "11px", fontWeight: "400", color: "#000" },
            formatter() {
              return formatINRShort(this.y);
            },
          },
        },
      },
      colors: YEAR_COLORS,
      series: [{ name: "Purchase", data: quarterSeriesData }],
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
                [0, "#00C49F"],
                [1, "#00E396"],
              ],
            },
          },
        ],
        legend: { enabled: false },
        credits: { enabled: false },
      }
    : null;

  /* ================================================================
     Year KPI summary cards
  ================================================================ */
  const YearSummaryCards = () => {
    if (!yearChartData.length) return null;
    const total = yearChartData.reduce((s, i) => s + i.value, 0);
    const highest = yearChartData.reduce((a, b) => (a.value > b.value ? a : b));
    const lowest = yearChartData.reduce((a, b) => (a.value < b.value ? a : b));

    return (
      <Box sx={{ display: "flex", gap: 1, mt: 1, px: 1 }}>
        {[
          {
            label: "Total Purchase",
            value: formatINRShort(total),
            color: "#0088FE",
          },
          {
            label: `Highest (FY ${highest.label})`,
            value: formatINRShort(highest.value),
            color: "#00C49F",
          },
          {
            label: `Lowest  (FY ${lowest.label})`,
            value: formatINRShort(lowest.value),
            color: "#FF8042",
          },
        ].map((c) => (
          <Box
            key={c.label}
            sx={{
              flex: 1,
              borderRadius: 2,
              p: 1.2,
              background: `linear-gradient(135deg, ${c.color}22, ${c.color}11)`,
              border: `1.5px solid ${c.color}55`,
              textAlign: "center",
            }}
          >
            <Box sx={{ fontSize: "0.7rem", color: "text.secondary", mb: 0.3 }}>
              {c.label}
            </Box>
            <Box sx={{ fontSize: "0.85rem", fontWeight: 700, color: c.color }}>
              {c.value}
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

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
        {(isLoading || isFetching) && (
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
            {/* <YearSummaryCards /> */}
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
