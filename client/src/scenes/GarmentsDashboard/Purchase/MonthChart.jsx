import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";

import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
} from "@mui/material";
import {
  useGetMonthPurchaseOrderQuery,
  useGetMonthGeneralPurchaseQuery,
  useGetMonthCombinedPurchaseQuery,
} from "../../../redux/service/purchaseService";
import YearWiseTable from "./TableData/YearTable";
import { useEffect } from "react";
import SpinLoader from "../../../utils/spinLoader";

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

const MonthChart = ({
  companyName,
  finYear,
  finYr,
  poType,
  companyList,
  setChartToShow,
  chartToshow,
  purchaseTypeOptions,
}) => {
  const theme = useTheme();
  const [showYearTable, setShowYearTable] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCompCode, setSelectedCompCode] = useState("");
  const [selectedOrderType, setSelectedOrderType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
  const [selectedMonthColor, setSelectedMonthColor] = useState("#00C49F");
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
//   const {
//     data: monthResponse,
//     isLoading,
//     isFetching,
//   } = useGetMonthPurchaseOrderQuery(
//     { params: { finYear, companyName } },
//     { skip: !finYear || !companyName },
//   );
  const {
    data: monthGeneralResponse,
    isLoading : monthGeneralResponseLoading,
    isFetching : monthGeneralResponseFetching,
  } = useGetMonthGeneralPurchaseQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );
  const {
    data: monthResponse,
    isLoading,
    isFetching,
  } = useGetMonthCombinedPurchaseQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );
 
  console.log(monthResponse, "monthResponse");
  
  useEffect(() => {
    setShowYearTable(false);
    setSelectedYear(null);
    setSelectedCompCode("");
  }, [poType]);

let responseToshow = poType === "All" ? monthResponse?.data : monthGeneralResponse?.data

  const monthChartData = useMemo(
    () =>
      (Array.isArray(responseToshow) ? responseToshow : []).map(
        (i) => ({
          month: i.month || i.label,
          value: Number(i.VAL || i.value),
          year: i.yearNo,
        }),
      ),
    [responseToshow],
  );
  console.log(monthChartData, "monthChartData");

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
          return `<b>${data.month}</b> - ${data.year}<br/>${formatINRShort(this.y)}`;
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
    [monthCategories, monthSeriesData,monthChartData],
  );

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
            return `<b>${this.x}</b><br/>${formatINRShort(this.y)}`;
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

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={"Month Wise Purchase"}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
        action={
          <RadioGroup
            row
            value={chartToshow}
            onChange={(e) => setChartToShow(e.target.value)}
            sx={{ gap: 1 }}
          >
            {purchaseTypeOptions.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio size="small" />}
                label={opt.label}
                sx={{ fontSize: "11px" }}
              />
            ))}
          </RadioGroup>
        }
      />
      <CardContent
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          mt: 1,
          ml: 1,
          height: 460,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {(isLoading || isFetching) && <SpinLoader />}
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
        {showYearTable && selectedYear && (
          <YearWiseTable
            year={selectedYear}
            poType={poType}
            type={selectedOrderType}
            companyList={companyList}
            selectedCompCode={selectedCompCode}
            finYr={finYr}
            closeTable={() => setShowYearTable(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MonthChart;
