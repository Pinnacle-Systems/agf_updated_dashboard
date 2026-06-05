import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Grid,
  Typography,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
  useGetTopTenItemsQuery,
  useGetTopTenItemsPurchaseGeneralQuery,
  useGetTopTenItemsCombinedQuery,
} from "../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";
import TopTenItemstable from "./TableData/TopTenItemstable";
import { useGetAccessoryGRNDetailsQuery, useGetAccessoryGRNTableQuery, useGetCuttingPrintingGRNDetailsQuery, useGetCuttingPrintingGRNTableQuery, useGetDyedFabricGRNDetailsQuery, useGetDyedFabricGRNTableQuery, useGetDyedYarnGRNDetailsQuery, useGetDyedYarnGRNTableQuery, useGetGeneralGRNDetailsQuery, useGetGeneralGRNTableQuery, useGetGreyFabricGRNDetailsQuery, useGetGreyFabricGRNTableQuery, useGetGreyYarnGRNDetailsQuery, useGetGreyYarnGRNTableQuery } from "../../../redux/AgfServices/GRNservices";
import GoodsRecivedTable from "./TableData/GoodsReceivedTable";

const colorArray = [
  "#6366F1", // Indigo
  "#22C55E", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#A855F7", // Purple
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#E11D48", // Rose
  "#0EA5E9", // Sky Blue
];

const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Reusable single pie chart
const SupplierPieChart = ({ title, data, onChartClick }) => {
  const theme = useTheme();

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
              let lines = [],
                currentLine = "";
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
          data: data.map((d, idx) => ({
            ...d,
            itemStyle: { color: colorArray[idx % colorArray.length] },
          })),
        },
      ],
    }),
    [data],
  );

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", m: 1 }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ sx: { fontSize: ".85rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent sx={{ p: 1 }}>
        <ReactECharts
          option={option}
          style={{ height: 320 }}
          onEvents={{ click: onChartClick }}
        />
      </CardContent>
    </Card>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const GoodsReceivedNote = ({
  companyName,
  finYear,
  poType,
  companyList,
  finYr,
}) => {
  const theme = useTheme();

  const [chartData, setChartData] = useState([]); // for All / General
  const [orderChartData, setOrderChartData] = useState([]); // for Order — array of { type, data[] }

  const [tableParams, setTableParams] = useState(null);
  const [showYearTable, setShowYearTable] = useState(false);

  const [selectedYear, setSelectedYear] = useState(finYear || "");
  const [selectedCompCode, setSelectedCompCode] = useState(companyName || "");

  const [selectedType, setSelectedType] = useState("General Purchase");





  useEffect(() => {
    setSelectedYear(finYear);
  }, [finYear]);
  useEffect(() => {
    setSelectedCompCode(companyName);
  }, [companyName]);

  useEffect(() => {
    if (poType === "Order") {
      setSelectedType("Grey Fabric");
    } else {
      setSelectedType("General Purchase");
    }
  }, [poType]);




  const baseOptions = [
    { show: "General Purchase", value: "General Purchase" },
  ];

  const orderOptions = [
    { show: "Grey Fabric", value: "Grey Fabric" },
    { show: "Grey Yarn", value: "Grey Yarn" },
    { show: "Dyed Yarn", value: "Dyed Yarn" },
    { show: "Dyed Fabric", value: "Dyed Fabric" },
    { show: "Accessory", value: "Accessory" },
    { show: "Cutting / Printing", value: "Cutting / Printing" },
  ];

  const GrnType =
    poType === "All"
      ? [...baseOptions, ...orderOptions]
      : poType === "Order"
        ? orderOptions
        : baseOptions;

  const GeneralGRNTDetailData = useGetGeneralGRNDetailsQuery(
    selectedYear && selectedCompCode && selectedType === "General Purchase" ? { params: { selectedYear, companyName: selectedCompCode } } : skipToken,
  );


  const GreyFabricGRNTableData = useGetGreyFabricGRNDetailsQuery(
    selectedYear && selectedCompCode && selectedType === "Grey Fabric" ? { params: { selectedYear, companyName: selectedCompCode } } : skipToken,
  );


  const GreyYarnGRNTableData = useGetGreyYarnGRNDetailsQuery(
    selectedYear && selectedCompCode && selectedType === "Grey Yarn" ? { params: { selectedYear, companyName: selectedCompCode } } : skipToken,
  );


  const DyedYarnGRNTableData = useGetDyedYarnGRNDetailsQuery(
    selectedYear && selectedCompCode && selectedType === "Dyed Yarn" ? { params: { selectedYear, companyName: selectedCompCode } } : skipToken,
  );

  const DyedFabricGRNTableData = useGetDyedFabricGRNDetailsQuery(
    selectedYear && selectedCompCode && selectedType === "Dyed Fabric" ? { params: { selectedYear, companyName: selectedCompCode } } : skipToken,
  );

  const AccessoryGRNTableData = useGetAccessoryGRNDetailsQuery(
    selectedYear && selectedCompCode && selectedType === "Accessory" ? { params: { selectedYear, companyName: selectedCompCode } } : skipToken,
  );

  const CuttingPrintingGRNTableData = useGetCuttingPrintingGRNDetailsQuery(
    selectedYear && selectedCompCode && selectedType === "Cutting / Printing" ? { params: { selectedYear, companyName: selectedCompCode } } : skipToken,
  );


  const { data: response, isLoading } =
    selectedType === "General Purchase" ? GeneralGRNTDetailData :
      selectedType === "Grey Fabric" ? GreyFabricGRNTableData :
        selectedType === "Grey Yarn" ? GreyYarnGRNTableData :
          selectedType === "Dyed Yarn" ? DyedYarnGRNTableData :
            selectedType === "Dyed Fabric" ? DyedFabricGRNTableData :
              selectedType === "Accessory" ? AccessoryGRNTableData :
                selectedType === "Cutting / Printing" ? CuttingPrintingGRNTableData : []


  console.log(response, "response", selectedType)

  const getFieldMapping = (type) => {
    return { nameKey: "item", valueKey: "TOTAL_VALUE" };
  };

  useEffect(() => {
    if (selectedType) {
      const { nameKey, valueKey } = getFieldMapping(selectedType);



      // Group and sum values by label name
      const aggregatedMap = {};
      response?.data?.forEach((item) => {
        const name = item[nameKey] || selectedType;
        const val = Number(item[valueKey]) || Number(item.VAL) || 0;
        if (!aggregatedMap[name]) {
          aggregatedMap[name] = {
            name,
            compCode: item.companyCode || item.compCode || selectedCompCode,
            finYear: item.docYear || item.finYear || selectedYear,
            value: 0,
          };
        }
        aggregatedMap[name].value += val;
      });

      // Convert to array and sort descending
      const aggregatedList = Object.values(aggregatedMap).sort(
        (a, b) => b.value - a.value
      );

      // Limit to top 10 to keep the chart beautiful, remainder to Others
      let finalChartData = aggregatedList;
      if (aggregatedList?.length > 10) {
        const topTen = aggregatedList?.slice(0, 9);
        const remaining = aggregatedList?.slice(9);
        const remainingSum = remaining.reduce((sum, curr) => sum + curr.value, 0);
        topTen.push({
          name: "Others",
          compCode: aggregatedList[0].compCode,
          finYear: aggregatedList[0].finYear,
          value: remainingSum,
        });
        finalChartData = topTen;
      }

      setChartData(finalChartData);
    }
  }, [response, poType, selectedType, selectedCompCode, selectedYear]);




  console.log(chartData, "chartData");


  const handleChartClick = (params) => {
    const { name, compCode, finYear } = params.data;
    setTableParams({
      item: name,
      year: finYear,
      company: compCode,
      grnType: selectedType,
    });
    setShowYearTable(true);
  };


  const itemOptions = useMemo(() => {
    // ← was supplierOptions
    if (!chartData.length) return [];
    return [...new Set(chartData.map((i) => i.name))];
  }, [chartData]);


  const totalSum = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);


  const singleOption = useMemo(
    () => ({
      backgroundColor: "#FFFFFF",
      title: {
        text: `${selectedType} Total`,
        subtext: formatINR(totalSum),
        left: "center",
        top: "center",
        textStyle: {
          fontSize: 12,
          fontWeight: "normal",
          color: "#6b7280"
        },
        subtextStyle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#1d4ed8"
        }
      },
      tooltip: {
        trigger: "item",
        confine: true, // ensures tooltip stays inside chart container
        position: function (point, params, dom, rect, size) {
          const chartWidth = rect.width;
          const chartHeight = rect.height;
          const tooltipWidth = size.contentSize[0];
          const tooltipHeight = size.contentSize[1];

          let x = point[0] + 15; // try right side
          let y = point[1] - tooltipHeight / 2;

          // If tooltip overflows right edge, move to left
          if (x + tooltipWidth > chartWidth) {
            x = point[0] - tooltipWidth - 15;
          }

          // If tooltip overflows left edge, move inside
          if (x < 0) x = 5;

          // Prevent overflow top/bottom
          if (y < 0) y = 5;
          if (y + tooltipHeight > chartHeight)
            y = chartHeight - tooltipHeight - 5;

          return [x, y];
        },
        formatter: ({ name, value, percent }) =>
          `<b>${name}</b><br/>Purchase: <b>${formatINR(value)}</b><br/>(${percent}%)`,
      },

      legend: { show: false },
      series: [
        {
          name: "Purchase",
          type: "pie",
          radius: ["55%", "75%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
          label: {
            show: true,
            position: "outside",
            formatter: ({ name, value }) => {
              const maxLineLength = 18; // adjust based on space
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

              return `${lines.join("\n")}\n(${formatINR(value)})`; // line break + value
            },
            fontSize: 10,
            fontWeight: "bold",
          },
          labelLine: { show: true, length: 12, length2: 8 },
          data: chartData
            .sort((a, b) => b.value - a.value)
            .map((d, idx) => ({
              ...d,
              itemStyle: { color: colorArray[idx % colorArray.length] },
            })),
        },
      ],
    }),
    [chartData, totalSum, selectedType],
  );
  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
        <CardHeader
          title="Goods Received Note Details"
          titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
          sx={{
            p: 1,
            height: 40,
            borderBottom: `2px solid ${theme.palette.divider}`,
          }}
          action={
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                fontSize: "11px",
                padding: "0px 14px",
                borderRadius: "6px",
                border: "2px solid #2563eb",
                marginTop: "2px",
                marginLeft: "-12px",
                minWidth: "160px",
              }}
            >
              {GrnType.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.show}
                </option>
              ))}
            </select>
          }
        />
        <CardContent>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: 40, height: 380 }}>
              Loading...
            </div>
          ) : (
            <ReactECharts
              option={singleOption}
              style={{ height: 380 }}
              onEvents={{ click: handleChartClick }}
            />
          )}
        </CardContent>
      </Card>

      {/* ── DETAIL TABLE MODAL ── */}
      {showYearTable && selectedYear && (
        <GoodsRecivedTable
          year={tableParams.year}
          company={tableParams.company}
          item={tableParams.item}
          poType={poType}
          companyList={companyList}
          finYr={finYr}
          closeTable={() => {
            setShowYearTable(false);
            setSelectedCompCode(companyName);
            setSelectedYear(finYear);
            setSelectedType(orderChartData[0].type);
          }}
          initialOrderType={tableParams.grnType}
          itemOptions={itemOptions}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedCompCode={selectedCompCode}
          setSelectedCompCode={setSelectedCompCode}
        />
      )}
    </>
  );
};

export default GoodsReceivedNote;
