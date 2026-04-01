import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, useTheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
  useGetTopTenSupplierQuery,
  useGetTopTenSupplierPurchaseGeneralQuery,
  useGetTopTenSupplierCombinedQuery,
} from "../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";

const TopTenSupplierYear = ({ companyName, finYear, poType = "Order" }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);

  // Select the correct query based on poType
 const combinedQuery = useGetTopTenSupplierCombinedQuery(
  finYear && companyName ? { params: { finYear, companyName } } : skipToken
);
const orderQuery = useGetTopTenSupplierQuery(
  finYear && companyName ? { params: { finYear, companyName } } : skipToken
);
const generalQuery = useGetTopTenSupplierPurchaseGeneralQuery(
  finYear && companyName ? { params: { finYear, companyName } } : skipToken
);

// pick the active response based on poType
const { data: response, isLoading } =
  poType === "All"
    ? combinedQuery : generalQuery;

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Process response data
  useEffect(() => {
    if (response?.data) {
      const sorted = [...response.data].sort(
        (a, b) => b.TOTAL_VAL - a.TOTAL_VAL
      );
      setChartData(
        sorted.map((item) => ({
          name: item.supplierName,
          value: Number(item.TOTAL_VAL),
        }))
      );
    }
  }, [response]);

  const colorArray = useMemo(
    () => [
      "#8A37DE",
      "#005E72",
      "#E5181C",
      "#056028",
      "#1F2937",
      "#F44F5E",
      "#E55A89",
      "#D863B1",
      "#CA6CD8",
      "#B57BED",
    ],
    []
  );

  const option = useMemo(
    () => ({
      backgroundColor: "#FFFFFF",
      tooltip: {
        trigger: "item",
        formatter: ({ name, value, percent }) =>
          `${name}<br/>Purchase: <b>${formatINR(value)}</b><br/>(${percent}%)`,
      },
      legend: { show: false },
      series: [
        {
          name: "Purchase",
          type: "pie",
          radius: ["45%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
          label: {
            show: true,
            position: "outside",
            formatter: ({ name }) => {
              const maxLineLength = 28;
              const words = name.split(" ");
              let lines = [];
              let currentLine = "";
              words.forEach((word) => {
                if ((currentLine + " " + word).trim().length <= maxLineLength) {
                  currentLine = (currentLine + " " + word).trim();
                } else {
                  if (currentLine) lines.push(currentLine);
                  currentLine = word;
                }
              });
              if (currentLine) lines.push(currentLine);
              return lines.join("\n");
            },
            fontSize: 11,
            fontWeight: "bold",
          },
          labelLine: { show: true, length: 10, length2: 5 },
          data: chartData.map((d, idx) => ({
            ...d,
            itemStyle: { color: colorArray[idx % colorArray.length] },
          })),
        },
      ],
    }),
    [chartData, colorArray]
  );

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Top Ten Supplier`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: 40, height: 380 }}>
            Loading...
          </div>
        ) : (
          <ReactECharts option={option} style={{ height: 380 }} />
        )}
      </CardContent>
    </Card>
  );
};

export default TopTenSupplierYear;