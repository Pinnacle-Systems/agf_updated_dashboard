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
  useGetQuarterPurchaseOrderQuery,
  useGetQuarterPurchaseGeneralQuery,
  useGetQuarterPurchaseCombinedCOMPQuery,
} from "../../../redux/service/purchaseService";
import YearWiseTable from "./TableData/YearTable";
import { useEffect } from "react";
import SpinLoader from "../../../utils/spinLoader";

highchartsMore(Highcharts);

const QuarterWise = ({
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
    data: quarterGeneralResponse,
    isLoading: quarterGeneralResponseLoading,
    isFetching: quarterGeneralResponseFetching,
  } = useGetQuarterPurchaseGeneralQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );
  const {
    data: quarterResponse,
    isLoading,
    isFetching,
  } = useGetQuarterPurchaseCombinedCOMPQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );

  console.log(quarterResponse, "quarterResponse");

  useEffect(() => {
    setShowYearTable(false);
    setSelectedYear(null);
    setSelectedCompCode("");
  }, [poType]);

  let responseToshow =
    poType === "All" ? quarterResponse?.data : quarterGeneralResponse?.data;

  const quarterChartData = useMemo(
    () =>
      (Array.isArray(responseToshow) ? responseToshow : []).map((i) => ({
        quarter: i.quarter || i.label,
        value: Number(i.VAL || i.value),
        month: i.month,
        year: i.yearNo,
      })),
    [responseToshow],
  );

  const quarterCategories = useMemo(
    () => quarterChartData.map((i) => i.quarter ?? i.label),
    [quarterChartData],
  );
  const quarterSeriesData = useMemo(
    () => quarterChartData.map((i) => Number(i.value)),
    [quarterChartData],
  );
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
          minPointLength: 40,
          dataLabels: {
            enabled: true,
            inside: false, // put label inside the bar
            rotation: 0, // rotate label -90 degrees
            align: "center", // horizontal alignment
             y: -8,
            verticalAlign: "middle", // vertical alignment
            style: {
              fontSize: "13px",
              fontWeight: "600",
              color: "black", // white text for inside bars
             
            },
            formatter() {
              return formatINRShort(this.y);
            },
          },
        },
      },
      colors: QUARTER_COLORS,
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
    [quarterCategories, quarterSeriesData,QUARTER_COLORS],
  );

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={"Quarter Wise Purchase"}
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

        <Box>
          <HighchartsReact
            key="quarter-chart"
            highcharts={Highcharts}
            options={quarterChartOptions}
          />
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

export default QuarterWise;
