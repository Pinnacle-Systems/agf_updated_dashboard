import React, { useMemo, useEffect, useRef, useState, useCallback } from "react";
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
import { useGetDyedFabricProcessDataQuery } from "../../../redux/AgfServices/ProcessDetails";
import DyedFabricProcessDetailsTable from "./TableData/DyedFabricProcessDetailsTable";

const DyedFabricProcessDetails = ({
  filterBuyer,
  selectedYear,
  selectMonths,
  finYr,
  user,
  filterBuyerList,
  onMonthChange,
  companyName,
  companyList,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const poType = useSelector((state) => state.dashboardFilters.poType);
  const [tableConfig, setTableConfig] = useState(null); // { typeName, finYear, compCode }

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
  );

  const responseData = response?.data ?? [];

  console.log(response, 'dyed fabric response');

  const chartData = useMemo(() => {
    return (responseData ?? []).filter((item) => item.COMPANY !== "PSS");
  }, [responseData]);

  // Handle Chart Click - opens the detail table modal
  const handleChartClick = useCallback((params) => {
    console.log("params", params);
    const typeName = params.name;
    const status = "ALL";

    setTableConfig({
      typeName,
      selectedYear: filterYear,
      compCode: companyName,
      buyerCode: typeName,
      status,
    });
  }, [filterYear, companyName]);

  const options = useMemo(() => ({
    chart: {
      type: "pie",
      height: 288,
      backgroundColor: "transparent",
    },
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"],
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
        name: "Dyed Fabric Process Details",
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
  }), [chartData, filterYear, selectMonths, filterBuyerList, finYr, poType, user, dispatch, handleChartClick]);

  if (isLoading) {
    return (
      <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
        <CircularProgress />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
        <Typography color="error">
          Failed to load dyed fabric process data. Please try again.
        </Typography>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
        <CardHeader
          title="Dyed Fabric Process Details (OutSide Suppliers)"
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
          title="Dyed Fabric Process Details (OutSide Suppliers)"
          titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
          sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
        />
        <CardContent>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </CardContent>
      </Card>
      {tableConfig && (
        <DyedFabricProcessDetailsTable
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

export default DyedFabricProcessDetails;
