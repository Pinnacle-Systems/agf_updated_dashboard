import React, { useMemo, useEffect, useRef, useState, useCallback } from "react"; // ✅ CHANGE 1: added useRef (for stale closure fix)
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
import { useGetDyedFabricProcessDataQuery, useGetProcessDataQuery, useGetYarnProcessDataQuery } from "../../../redux/AgfServices/ProcessDetails";
import YarnProcessDetailsTable from "./TableData/YarnProcessDetailsTable";

const YarnProcessDetails = ({
  filterBuyer,
  selectedYear,
  selectMonths,
  finYr,
  user,
  filterBuyerList,
  onMonthChange,
  companyName,
  companyList, // ✅ CHANGE: destructure companyList
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const poType = useSelector((state) => state.dashboardFilters.poType);
  const [tableConfig, setTableConfig] = useState(null); // { typeName, finYear, compCode }

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
  } = useGetDyedFabricProcessDataQuery(
    { params: { selectedYear: filterYear, buyer: filterBuyer } },
    // { skip: !filterYear },
  );

  const responseData = response?.data ?? []; // ✅ already safe with ?? []

  console.log(response, 'response')


  useEffect(() => {
    if (!selectMonths && onMonthChange) {
    }
  }, [selectMonths, onMonthChange]);

  const chartData = useMemo(() => {
    return (responseData ?? []).filter((item) => item.COMPANY !== "PSS");
  }, [responseData]);

  // ✅ CHANGE: Moved handleChartClick above options and wrapped in useCallback
  const handleChartClick = useCallback((params) => {
    console.log("params", params);
    const typeName = params.name;
    const status = "ALL";

    setTableConfig({
      typeName,
      selectedYear,
      compCode: companyName,
      buyerCode: typeName,
      status,
    });
  }, [selectedYear, companyName]);

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
              handleChartClick({
                name: this.name,
                seriesName: this.series.name,
              });
            },
          },
        },
      },
    },

    series: [
      {
        name: "Yarn Process Details",
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
  }), [chartData, selectedYear, selectMonths, filterBuyerList, finYr, poType, user, dispatch, handleChartClick]);



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
          title="Yarn Process Details (OutSide Suppliers)"
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
    <>
      <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
        <CardHeader
          title="Yarn Process Details (OutSide Suppliers)"
          titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
          sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
        />
        <CardContent>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </CardContent>
      </Card>
      {tableConfig && (
        <YarnProcessDetailsTable
          companyName={tableConfig.typeName}
          finYear={tableConfig.selectedYear}
          buyerName={tableConfig.buyerCode}
          initialStatus={tableConfig.status}
          onClose={() => setTableConfig(null)}
          finYr={finYr}
          companyList={companyList}
        />
      )}
    </>

  );
};

export default YarnProcessDetails;