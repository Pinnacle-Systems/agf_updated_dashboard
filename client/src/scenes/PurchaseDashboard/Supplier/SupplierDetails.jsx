import { useGetSupplierPOSDataQuery } from "../../../redux/service/purchaseOrder";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SupplierTrans from "./SupplierTrans";

const SupplierDetails = ({
    selectedYear,
    setSelectedYear,
    finYear,
    selectmonths,
    setSelectmonths,
}) => {
    const [showTable, setShowTable] = useState(false);
    const [supplierName, setSupplierName] = useState("");

    const { data: supplierData } = useGetSupplierPOSDataQuery(
        {
            params: { finyear: selectedYear },
        },
        { skip: !selectedYear }
    );

    const rows = supplierData?.data || [];

    const options = {
        chart: {
            type: "column",
            height: 380,
            backgroundColor: "#ffffff",
            spacingBottom: 0,
        },

        title: {
            text: null,
        },

        xAxis: {
            categories: rows.map((r) => r.supplier),
            labels: {
                rotation: -45,
                align: "right",
                style: {
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                },
            },
        },

        yAxis: {
            min: 0,
            title: {
                text: "Qty",
            },
            gridLineWidth: 1,
        },

        legend: {
            enabled: false,
        },

        tooltip: {
            useHTML: true,
            style: {
                color: "#374151",
                fontSize: "10px",
            },
            headerFormat: "<b>{point.key}</b><br/>",
            pointFormatter: function () {
                return `
                <span style="color:${this.color}">\u25CF</span>
            Qty : <b>${this.y.toLocaleString("en-IN", {
                    minimumFractionDigits: this.unit === "KGS" ? 3 : 0,
                    maximumFractionDigits: this.unit === "KGS" ? 3 : 0,
                })} (${this.unit})</b><br/>
                 <span style="color:${this.color}">\u25CF</span>
            Amt (₹): <b>${this.amountValue.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}</b>
        `;
            },
        },

        plotOptions: {
            column: {
                colorByPoint: true,
                colors: [
                    "#8e24aa", // deep purple
                    "#7b1fa2",
                    "#6a1b9a",
                    "#ab47bc",
                    "#ba68c8",
                    "#ec407a",
                    "#e91e63",
                    "#d81b60",
                    "#c2185b",
                    "#ad1457"
                ],
                dataLabels: {
                    enabled: true,
                    inside: true,
                    rotation: -90,
                    color: "#ffffff",
                    align: "center",
                    verticalAlign: "middle",
                    formatter: function () {
                        return this.y.toLocaleString("en-IN", {
                            minimumFractionDigits: this.point.unit === "KGS" ? 3 : 0,
                            maximumFractionDigits: this.point.unit === "KGS" ? 3 : 0,
                        });
                    },
                    y: 0,
                    style: {
                        fontSize: "11px",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        textOutline: "none",
                    },
                },
            },
            series: {
                cursor: "pointer",
                point: {
                    events: {
                        click: function () {
                            setSupplierName(this.category);
                            // Reset month filter
                            setSelectmonths("");
                            // Show the table
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        series: [
            {
                name: "Qty",
                data: rows.map((r) => ({
                    y: Number(r.qty || 0),
                    amountValue: Number(r.amountValue || 0),
                    unit: r.unit,
                })),
            },
        ],

        credits: {
            enabled: false,
        },
    };

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title={`Top 10 Suppliers in - (${selectedYear}) Year`}
                titleTypographyProps={{
                    sx: { fontSize: "1rem", fontWeight: 600 },
                }}
                sx={{
                    p: 0.5,
                    px: 1,
                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                }}
            />

            <CardContent>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </CardContent>

            {showTable && (
                <SupplierTrans
                    closeTable={() => setShowTable(false)}
                    finYear={finYear}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    supplierName={supplierName}
                    selectmonths={selectmonths}
                    setSelectmonths={setSelectmonths}
                />
            )}
        </Card>
    );
};

export default SupplierDetails;