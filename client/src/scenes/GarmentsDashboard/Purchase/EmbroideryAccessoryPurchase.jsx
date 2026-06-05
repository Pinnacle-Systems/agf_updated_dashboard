import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, useTheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
    useGetSupplierEfficiencyQuery,
    useGetSupplierEfficiencyCombinedQuery,
    useGetSupplierEfficiencyPurchaseGeneralQuery,
    useGetEmbroideryAccessoryPurchaseQuery,
} from "../../../redux/service/purchaseService";
import { skipToken } from "@reduxjs/toolkit/query";
import SupplierEfficiencyTable from "./TableData/SupplierEfficiencyTable";
import EmbroideryAccessoryDetailTable from "./TableData/EmbroideryAccessoryTable";

const colorArray = [
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
];

const EmbroideryAccessoryPurchase = ({
    companyName,
    finYear,
    poType,
    companyList,
    finYr,
}) => {
    const theme = useTheme();

    const [chartData, setChartData] = useState([]);

    const [tableParams, setTableParams] = useState(null);
    const [showYearTable, setShowYearTable] = useState(false);

    const [selectedYear, setSelectedYear] = useState(finYear || "");
    const [selectedCompCode, setSelectedCompCode] = useState(companyName || "");

    useEffect(() => {
        setSelectedYear(finYear);
    }, [finYear]);
    useEffect(() => {
        setSelectedCompCode(companyName);
    }, [companyName]);

    // ── Queries ────────────────────────────────────────────────────────────────
    const { data: response, isLoading } = useGetEmbroideryAccessoryPurchaseQuery(
        { params: { selectedYear: finYear, companyName } }, { skip: !finYear || !companyName },
    );

    // ── Process response ──────────────────────────────────────────────────────
    useEffect(() => {
        if (response?.data) {
            const sorted = [...response.data].sort((a, b) => Number(b.TOTALVALUE || 0) - Number(a.TOTALVALUE || 0));
            const mappedData = sorted.map((item) => ({
                name: item.COMPCODE,
                compCode: item.COMPCODE,
                COMPCODE: item.COMPCODE,
                finYear: finYear,
                value: Number(item.TOTALVALUE || 0),
                TOTALVALUE: Number(item.TOTALVALUE || 0),
            }));
            console.log(mappedData, "mappedData");
            setChartData(mappedData);
        } else {
            setChartData([]);
        }
    }, [response, finYear]);

    // ── Chart click handler ────────────────────────────────────────────────────
    const handleChartClick = (params) => {
        const { name, compCode, finYear: yr } = params.data;
        setTableParams({
            supplier: name,
            year: yr || finYear,
            company: compCode,
        });
        setShowYearTable(true);
    };

    const supplierOptions = useMemo(() => {
        if (!chartData.length) return [];
        return [...new Set(chartData.map((i) => i.name))];
    }, [chartData]);

    const buildSplineOption = (data) => ({
        backgroundColor: "#FFFFFF",
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (params) => {
                const p = params[0];
                return `${p.name}<br/>Total Purchase Value: <b>₹ ${Number(p.value).toLocaleString('en-IN')}</b>`;
            },
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "12%",
            top: "12%",
            containLabel: true,
        },
        xAxis: {
            type: "category",
            data: data.map((d) => d.name),
            axisLabel: {
                fontSize: 10,
                rotate: 35,
                interval: 0,
                overflow: "truncate",
                width: 80,
                fontWeight: 600,
                formatter: (val) => (val.length > 14 ? val.slice(0, 13) + "…" : val),
            },
            axisLine: { lineStyle: { color: "#ddd" } },
            axisTick: { show: false },
        },
        yAxis: {
            type: "value",
            name: "Amount (₹)",
            nameTextStyle: { fontSize: 10, color: "#888" },
            axisLabel: { fontSize: 10 },
            splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
        },
        series: [
            {
                type: "bar",
                barMaxWidth: 40,
                itemStyle: {
                    // ── rounded top corners ──────────────────────────────
                    borderRadius: [8, 8, 0, 0],
                    color: (params) => {
                        const baseColor =
                            params.data.name === "Others"
                                ? ["#B0B0B0", "#D0D0D0"]
                                : [
                                    ["#8A37DE", "#C084FC"],
                                    ["#005E72", "#22D3EE"],
                                    ["#E5181C", "#FCA5A5"],
                                    ["#056028", "#4ADE80"],
                                    ["#1F2937", "#6B7280"],
                                    ["#F44F5E", "#FDA4AF"],
                                    ["#E55A89", "#F9A8D4"],
                                    ["#D863B1", "#F0ABFC"],
                                    ["#CA6CD8", "#E879F9"],
                                    ["#B57BED", "#D8B4FE"],
                                ][params.dataIndex % 10];

                        // ── gradient from bottom to top ──────────────────
                        return {
                            type: "linear",
                            x: 0,
                            y: 1, // start bottom
                            x2: 0,
                            y2: 0, // end top
                            colorStops: [
                                { offset: 0, color: baseColor[0] }, // dark at bottom
                                { offset: 1, color: baseColor[1] }, // light at top
                            ],
                        };
                    },
                    shadowColor: "rgba(0,0,0,0.15)",
                    shadowBlur: 6,
                    shadowOffsetY: 3,
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 14,
                        shadowColor: "rgba(0,0,0,0.3)",
                    },
                },
                label: {
                    show: true,
                    position: "top",
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: "#555",
                    formatter: ({ value }) => Number(value).toLocaleString('en-IN'),
                },
                data: data.map((d, idx) => ({
                    value: d.TOTALVALUE,
                    name: d.name,
                    compCode: d.COMPCODE,
                    finYear: d.finYear,
                })),
            },
        ],
    });
    const singleOption = useMemo(() => buildSplineOption(chartData), [chartData]);

    return (
        <>
            <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
                <CardHeader
                    title="Embroidery Accessory Purchase"
                    titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
                    sx={{
                        p: 1,
                        height: 40,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                    }}
                />
                <CardContent>
                    {isLoading ? (
                        <div style={{ textAlign: "center", padding: 40, height: 380 }}>
                            Loading...
                        </div>
                    ) : chartData && chartData.length > 0 ? (
                        <ReactECharts
                            option={singleOption}
                            style={{ height: 380 }}
                            onEvents={{ click: handleChartClick }}
                        />
                    ) : (
                        <div style={{ textAlign: "center", padding: 40, height: 380 }}>
                            No data
                        </div>
                    )}
                </CardContent>
            </Card>

            {showYearTable && selectedYear && (
                <EmbroideryAccessoryDetailTable
                    year={tableParams.year}
                    company={tableParams.company}
                    supplier={tableParams.supplier}
                    poType={poType}
                    companyList={companyList}
                    finYr={finYr}
                    onClose={() => {
                        setShowYearTable(false);
                        setSelectedCompCode(companyName);
                        setSelectedYear(finYear);
                    }}
                    supplierOptions={supplierOptions}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedCompCode={selectedCompCode}
                    setSelectedCompCode={setSelectedCompCode}
                    companyName={companyName}
                />
            )}
        </>
    );
};

export default EmbroideryAccessoryPurchase;
