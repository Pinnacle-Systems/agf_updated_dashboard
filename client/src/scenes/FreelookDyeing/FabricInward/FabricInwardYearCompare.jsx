import { Card, CardContent, CardHeader, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState } from 'react'
import CustomerTrans from "./CustomerTrans";
import { useGetFabricInwardYearCompareQuery } from "../../../redux/service/freeLookFabric";

const FabricInwardYearCompare = ({
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

    const { data: fabricData } = useGetFabricInwardYearCompareQuery(
        { params: { category } },
        { skip: !category }
    );

    const rows = fabricData?.data || [];

    /* -------- DATA NORMALIZATION -------- */

    const customers = [...new Set(rows.map(r => r.customer))];
    const years = [...new Set(rows.map(r => r.finYear))].sort();
    const yearText = years.join("  |  ");
    const dataMap = {};
    rows.forEach(({ customer, finYear, qty }) => {
        if (!dataMap[customer]) dataMap[customer] = {};
        dataMap[customer][finYear] = Number(qty || 0);
    });

    const series = years.map((year) => ({
        name: year,
        data: customers.map((cust) => {
            const value = dataMap[cust]?.[year];

            return {
                y: value > 0 ? value : null,   // 👈 IMPORTANT
                customer: cust,
                finYear: year,
            };
        }),
    }));

    /* -------- CHART OPTIONS -------- */

    const options = {
        chart: {
            type: "column",
            height: 320,
            backgroundColor: "#FFFFFF",
        },

        title: null,
        xAxis: {
            categories: customers,
            labels: {
                rotation: 90,
                style: { fontSize: "10px", color: "#6B7280" },
                formatter: function () {
                    return this.value.split(" ")[0]; // 👈 first word only
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
            itemStyle: { fontSize: "12px" },
        },

        tooltip: {
            shared: false,
            useHTML: true,
            formatter: function () {
                return `
          <b>${this.point.customer}</b><br/>
          Qty (kgs): <b>${this.y.toLocaleString("en-IN", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                })}</b><br/>
          Year     : ${this.point.finYear}
        `;
            },
        },

        plotOptions: {
            column: {
                grouping: true,
                borderRadius: 4,
                pointPadding: 0.05,
                groupPadding: 0.15,
                minPointLength: 4,
            },
            series: {
                cursor: "pointer",
                dataLabels: {
                    enabled: category === "INHOUSE",
                    inside: false,        // 👈 show above bar
                    y: -6,                // 👈 move up (cross-like)
                    formatter: function () {
                        return this.point.finYear; // 👈 show year
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
                            setSelectedYear(this.finYear)
                            setSelectmonths("");
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        series,
        credits: { enabled: false },
    };

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title="Year Wise Comparison"
                titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
                sx={{
                    p: 0.5,
                    px: 1,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                }}
            />
            <CardContent>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </CardContent>

            {showTable && (
                <CustomerTrans
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
                />
            )}
        </Card>
    );
};



export default FabricInwardYearCompare