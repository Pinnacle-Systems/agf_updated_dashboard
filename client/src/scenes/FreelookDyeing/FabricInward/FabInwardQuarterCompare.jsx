import { Box, Card, CardContent, CardHeader, useTheme } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { useGetFabricInwardCustQuery, useGetFabricInwardQuarterCompareQuery } from "../../../redux/service/freeLookFabric";
import CustomerTransQuarter from "./CustomerTransQuarter";
import { DropdownNew } from "../../../utils/hleper";

const FabricInwardQuarterCompare = ({
    selectedYear,
    setSelectedYear,
    category,
    finYear,
    setCategory,
    selectmonths,
    setSelectmonths,
}) => {
    const theme = useTheme();

    const [showTable, setShowTable] = useState(false);
    const [custName, setCustName] = useState("");
    const [selectQuarter, setSelectQuarter] = useState("");

    const { data: custNames } = useGetFabricInwardCustQuery({
        params: {
            category: category
        },
    });
    const cusData = custNames?.data.map((custName) => ({
        custName,
    }));


    const { data: fabricData } = useGetFabricInwardQuarterCompareQuery(
        {
            params: {
                category,
                customer: custName
            },
        },
        { skip: !category }
    );

    const rows = fabricData?.data || [];

    /* ---------------- NORMALIZATION ---------------- */

    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const customers = [...new Set(rows.map(r => r.customer))];
    const years = [...new Set(rows.map(r => r.finYear))].sort();

    const dataMap = {};
    rows.forEach(({ customer, quarter, finYear, qty }) => {
        if (!dataMap[customer]) dataMap[customer] = {};
        if (!dataMap[customer][quarter]) dataMap[customer][quarter] = {};
        dataMap[customer][quarter][finYear] = Number(qty || 0);
    });

    /* ---------------- COLORS ---------------- */

    const QUARTER_COLORS = {
        Q1: "#E6733C", // dark orange
        Q2: "#FF0000", // red
        Q3: "#800080", // purple
        Q4: "#264653", // cyan
    };

    /* ---------------- SERIES (ORDER MATTERS) ---------------- */

    const legendSeries = quarters.map((qtr) => ({
        id: qtr,                 // 👈 important
        name: qtr,
        color: QUARTER_COLORS[qtr],
        visible: true,
        showInLegend: true,
        enableMouseTracking: false,
        data: [],                // 👈 no data (legend only)
    }));
    const series = [...legendSeries];

    quarters.forEach((qtr) => {
        years.forEach((year) => {
            series.push({
                name: qtr,
                linkedTo: qtr,                // 👈 KEY LINE
                color: QUARTER_COLORS[qtr],
                showInLegend: false,          // 👈 legend only from master

                data: customers.map((cust) => {
                    const value = dataMap[cust]?.[qtr]?.[year] || 0;

                    return {
                        y: value === 0 ? null : value,
                        customer: cust,
                        quarter: qtr,
                        finYear: year,
                    };
                }),
            });
        });
    });

    /* ---------------- CHART OPTIONS ---------------- */

    const options = {
        chart: {
            type: "column",
            height: 330,
            backgroundColor: "#FFFFFF",
        },

        title: null,

        xAxis: {
            categories: customers,
            labels: {
                rotation: 90,
                style: { fontSize: "10px", color: "#6B7280" },
                formatter: function () {
                    if (typeof this.value === "string") {
                        return this.value.split(" ")[0]; // show first word
                    }
                    return this.value;
                },
            },
        },

        yAxis: {
            min: 0,
            title: {
                text: "Qty (kgs)",
                style: { fontSize: "12px", fontWeight: 600 },
            },
        },

        legend: {
            enabled: true,
            itemStyle: { fontSize: "11px" },
        },

        tooltip: {
            useHTML: true,
            formatter: function () {
                return `
          <b>${this.point.customer}</b><br/>
          Quarter : <b>${this.point.quarter}</b><br/>
          Year : <b>${this.point.finYear}</b><br/>
          Qty (kgs): <b>${this.y?.toLocaleString("en-IN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                })}</b>
        `;
            },
        },

        plotOptions: {
            column: {
                grouping: true,
                borderRadius: 4,
                pointPadding: 0.03,
                groupPadding: 0.15,
                minPointLength: 4,
            },

            series: {
                cursor: "pointer",

                dataLabels: {
                    enabled: category === "INHOUSE",
                    y: -6,
                    formatter: function () {
                        return this.point.quarter;
                    },
                    style: {
                        fontSize: "9px",
                        fontWeight: "600",
                        color: "#111827",
                        textOutline: "none",
                    },
                },

                point: {
                    events: {
                        click: function () {
                            setCustName(this.customer);
                            setSelectedYear(this.finYear);
                            setSelectmonths("");
                            setSelectQuarter(this.quarter);
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        series,
        credits: { enabled: false },
    };

    /* ---------------- RENDER ---------------- */

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title={`Quarter Wise Comparison`}
                titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
                action={
                    <Box sx={{ width: 220 }}> {/* 🔥 FIXED WIDTH */}
                        <DropdownNew
                            dataList={cusData || []}
                            value={custName}
                            setValue={(value) => setCustName(value)}
                            clear
                            otherField="custName"
                            otherValue="custName"
                            placeholder="Customer"
                            autoFocus
                        />
                    </Box>
                }
                sx={{
                    p: 0.5,
                    px: 1,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    "& .MuiCardHeader-action": {
                        alignSelf: "center", // vertical align fix
                        margin: 0,
                    },
                }}
            />

            <CardContent>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </CardContent>

            {showTable && (
                <CustomerTransQuarter
                    closeTable={() => setShowTable(false)}
                    finYear={finYear}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    category={category}
                    setCategory={setCategory}
                    custName={custName}
                    setCustName={setCustName}
                    selectmonths={selectmonths}
                    setSelectmonths={setSelectmonths}
                    selectQuarter={selectQuarter}
                    setSelectQuarter={setSelectQuarter}
                />
            )}
        </Card>
    );
};

export default FabricInwardQuarterCompare;
