import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGetMisDashboardErpMonthWiseQuery } from "../../../redux/service/misDashboardServiceERP";

const Form = ({ companyName, finYear }) => {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(null);
const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const { data: response, isLoading } =
    useGetMisDashboardErpMonthWiseQuery({
      params: { finYear, companyName },
    });

  const chartData = useMemo(() => {
    return Array.isArray(response?.data) ? response.data : [];
  }, [response?.data]);

  /* ---------------- Parent ---------------- */
  const categories = useMemo(
    () => chartData.map((i) => i.month),
    [chartData]
  );

  const seriesData = useMemo(
    () => chartData.map((i) => i.value),
    [chartData]
  );

  /* ---------------- Selected Month ---------------- */
  const selectedMonthData = useMemo(() => {
    return chartData.find((i) => i.month === selectedMonth);
  }, [selectedMonth, chartData]);

  /* ---------------- Parent Chart ---------------- */
  const parentOptions = useMemo(
    () => ({
      chart: { type: "spline", height: 430 },
      title: { text: "" },

      xAxis: { categories },
      yAxis: {
        title: { text: "Turnover" },
        labels: {
          formatter() {
            return formatINR(this.value);
          },
        },
      },


      plotOptions: {
        spline: {
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            formatter() {
              return formatINR(this.y);
            },
            style: {
              fontSize: "11px",
              fontWeight: "400",
              color: "#000",
            },
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

      tooltip: {
        formatter() {
          return `
                <b>${this.x}</b><br/>

          <b>${formatINR(this.y)}</b>`;
        },
      },


      series: [
        {
          name: "Turnover",
          data: seriesData,
          color: "#0088FE",
        },
      ],

      legend: { enabled: false },
      credits: { enabled: false },
    }),
    [categories, seriesData]
  );

  /* ---------------- Child Chart ---------------- */
  const childOptions = selectedMonthData && {
    chart: { type: "column", height: 300 },
    title: { text: "" },

    xAxis: { categories: [selectedMonth] },
    yAxis: {
      title: { text: "Turnover" },
      labels: {
        formatter() {
          return formatINR(this.value);
        },
      },
    },
    tooltip: {
      formatter() {
        return `
      <b>${this.x}</b><br/>
      Turnover: <b>${formatINR(this.y)}</b>
    `;
      },
    },

    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter() {
            return formatINR(this.y);
          },
          style: {
            fontSize: "11px",
            fontWeight: "400",
            color: "#000",
          },
        },
      },
    },



    series: [
      {
        name: "Turnover",
        data: [Number(selectedMonthData.value)],
        color: "#00C49F",
      },
    ],

    legend: { enabled: false },
    credits: { enabled: false },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Month Wise Turnover"
        titleTypographyProps={{
          sx: { fontSize: ".9rem", fontWeight: 600 },
        }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent>
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>Loading...</Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "100%",

              overflow: "hidden",
            }}
          >
            {/* Parent Chart */}
            <Box
              sx={{
                width: selectedMonth ? "65%" : "100%",
                transition: "width 0.35s ease",
              }}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={parentOptions}
                immutable
              />
            </Box>

            {/* Child Chart (Always Mounted) */}
            <Box
              sx={{
                width: selectedMonth ? "35%" : "0%",
                opacity: selectedMonth ? 1 : 0,
                transition: "width 0.35s ease, opacity 0.2s ease",
                overflow: "hidden",
              }}
            >
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
                  <Box sx={{ fontWeight: 600 }}>
                    {selectedMonth || ""} Details
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedMonth(null)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                <CardContent sx={{ p: 1 }}>
                  {selectedMonth && (
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={childOptions}
                      immutable
                    />
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Form;
