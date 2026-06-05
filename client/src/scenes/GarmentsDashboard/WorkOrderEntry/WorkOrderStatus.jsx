import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useGetWorkOrderBillRegisterDataQuery } from "../../../redux/AgfServices/ProcessDetails";
import { useSelector } from "react-redux";
import WorkOrderDetailTable from "./TableData/WorkOrderDetailTable";
import { useGetCompanyQuery } from "../../../redux/service/purchaseService";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#14b8a6",
];

const WorkOrderStatus = ({ companyName, finYear }) => {
  const theme = useTheme();

  const { selectedYear, finYr } = useSelector(
    (state) => state.dashboardFilters,
  );

  const { data: companyList } = useGetCompanyQuery(
    { params: { selectedYear } },
    { skip: !selectedYear },
  );

  /* ---------------- DETAIL TABLE STATE ---------------- */
  const [tableParams, setTableParams] = useState(null); // null = closed

  /* ---------------- FETCH DATA ---------------- */
  const { data: response, isLoading } = useGetWorkOrderBillRegisterDataQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName },
  );

  /* ---------------- CHART DATA ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return { categories: [], qtyData: [] };

    const categories = response.data.map((x) => x.COMPCODE);
    const qtyData = response.data.map((x, index) => ({
      value: x.TOTALAMOUNT ?? 0,
      itemStyle: {
        color: COLORS[index % COLORS.length],
        borderRadius: [8, 8, 0, 0],
      },
    }));

    return { categories, qtyData };
  }, [response]);

  /* ---------------- BAR CLICK HANDLER ---------------- */
  /* ---------------- BAR CLICK HANDLER ---------------- */
  const onChartEvents = {
    click: (params) => {
      if (params.componentType !== "series") return;

      const clickedCompany = chartData.categories[params.dataIndex];
      if (!clickedCompany) return;

      setTableParams({
        companyName: clickedCompany, // ← pass clicked company
      });
    },
  };

  /* ---------------- CHART OPTIONS ---------------- */
  const options = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },

      toolbox: {
        right: 10,
        top: 0,
        feature: { saveAsImage: { show: true } },
      },

      grid: {
        left: "3%",
        right: "3%",
        bottom: "12%",
        top: "10%",
        containLabel: true,
      },

      xAxis: {
        type: "category",
        data: chartData.categories,
        axisTick: { alignWithLabel: true },
        axisLabel: {
          interval: 0,
          rotate: 20,
          fontSize: 11,
          fontWeight: 600,
          color: "#374151",
        },
      },

      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (val) => Number(val).toLocaleString("en-IN"),
        },
      },

      series: [
        {
          name: "Work Order Amount",
          type: "bar",
          barWidth: "45%",
          data: chartData.qtyData,
          cursor: "pointer",

          label: {
            show: true,
            position: "top",
            fontSize: 11,
            fontWeight: 700,
            color: "#111827",
            formatter: (params) => Number(params.value).toLocaleString("en-IN"),
          },

          emphasis: {
            focus: "series",
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0,0,0,0.25)",
            },
          },
        },
      ],
    }),
    [chartData],
  );

  /* ---------------- RENDER ---------------- */
  return (
    <>
      <Card
        sx={{
          mt: 1,
          ml: 1,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        <CardHeader
          title="Work Order Details"
          titleTypographyProps={{
            sx: { fontSize: ".95rem", fontWeight: 700 },
          }}
          sx={{
            p: 1,
            borderBottom: `2px solid ${theme.palette.divider}`,
          }}
        />

        <CardContent>
          {isLoading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>Loading...</Box>
          ) : !chartData.categories.length ? (
            <Box sx={{ textAlign: "center", py: 10, color: "text.secondary" }}>
              No data available
            </Box>
          ) : (
            <ReactECharts
              option={options}
              onEvents={onChartEvents}
              style={{ height: 450, cursor: "pointer" }}
            />
          )}
        </CardContent>
      </Card>

      {tableParams && (
        <WorkOrderDetailTable
          companyName={tableParams.companyName}
          processName={tableParams.processName}
          onClose={() => setTableParams(null)}
          companyList={companyList}
          selectedfinYear={selectedYear}
          finYr={finYr}
        />
      )}
    </>
  );
};

export default WorkOrderStatus;
