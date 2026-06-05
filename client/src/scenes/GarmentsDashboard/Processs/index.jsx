import React, { useMemo, useEffect, useRef } from "react"; // ✅ CHANGE 1: added useRef (for stale closure fix)
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { useGetOrderEntryCountQuery } from "../../../redux/service/OrderEntry"; // ✅ CHANGE 2: removed unused import (keep if used elsewhere)
import { setFilterBuyer } from "../../../redux/features/dashboardFiltersSlice";
import { useGetProcessDataQuery } from "../../../redux/AgfServices/ProcessDetails";

const ProcessDetailsIndex = ({
  filterBuyer,
  selectedYear,
  selectMonths,
  finYr,
  user,
  filterBuyerList,
  onMonthChange,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const poType = useSelector((state) => state.dashboardFilters.poType);

  // ✅ CHANGE 3: ref to always have latest filterBuyer in click handler (stale closure fix)
  const filterBuyerRef = useRef(filterBuyer);
  useEffect(() => {
    filterBuyerRef.current = filterBuyer;
  }, [filterBuyer]);

  /* ---------------- YEAR HANDLING ---------------- */
  const filterYear = useMemo(() => {
    if (!selectedYear) return "";
    return typeof selectedYear === "object"
      ? selectedYear.finYr || selectedYear.name
      : selectedYear;
  }, [selectedYear]);

  /* ---------------- FETCH DATA ---------------- */
  const {
    data: response,
    isLoading,
    isError,
  } = useGetProcessDataQuery(
    { params: { selectedYear: filterYear } },
    { skip: !filterYear },
  );

  const responseData = response?.data ?? []; // ✅ already safe with ?? []

  useEffect(() => {
    if (!selectMonths && onMonthChange) {
    }
  }, [selectMonths, onMonthChange]);

  const chartData = useMemo(() => {
    return (responseData ?? []).filter((item) => item.COMPANY !== "PSS");
  }, [responseData]);


  const options = useMemo(() => ({
    chart: {
      type: "pie",
      height: 288,
    },
    colors: ["#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"],
    title: {
      text: null,
    },

    tooltip: {
      pointFormatter() {
        return `<br/>Value: ₹${this.y.toLocaleString("en-IN")}`;
      },
    },

    plotOptions: {
      pie: {
        innerSize: "60%",
        borderRadius: 6,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() {
            // ✅ CHANGE 8: formatted value with toLocaleString for readability
            return `${this.point.name}: ₹${this.y.toLocaleString("en-IN")}`;
          },
          style: { fontSize: "10px" },
        },
        point: {
          events: {
            click() {
              const companyName = this.name;
              dispatch(setFilterBuyer(companyName));
              dispatch(
                push({
                  id: `ProcessStatus`,
                  name: "ProcessStatus",
                  component: "ProcessStatus",
                  data: {
                    companyName,
                    selectedYear,
                    filterBuyer: filterBuyerRef.current,
                    user,
                    selectMonths,
                    filterBuyerList,
                    finYr,
                    poType,
                  },
                }),
              );
            },
          },
        },
      },
    },

    series: [
      {
        name: "Order Entry",
        // ✅ CHANGE 10: was chartData.map(...) which crashes if chartData is undefined
        data: (chartData ?? []).map((x) => ({
          name: x.COMPANY,
          y: Number(x.TOTAL_VALUE || 0),
        })),
      },
    ],

    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
    },

    credits: { enabled: false },
    // ✅ CHANGE 11: added proper dependency array for useMemo
  }), [chartData, selectedYear, selectMonths, filterBuyerList, finYr, poType, user, dispatch]);

  /* ---------------- RENDER ---------------- */
  if (isLoading) {
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  // ✅ CHANGE 12: uncommented and fixed error state UI
  if (isError) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography color="error">
          Failed to load process data. Please try again.
        </Typography>
      </Card>
    );
  }

  // ✅ CHANGE 13: added empty state when no chart data is available
  if (!chartData || chartData.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
        <CardHeader
          title="Process Details"
          titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
          sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
        />
        <CardContent>
          <Typography color="text.secondary" textAlign="center">
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Process Details"
        titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
        sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default ProcessDetailsIndex;