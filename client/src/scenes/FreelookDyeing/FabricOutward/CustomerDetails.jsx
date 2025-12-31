import { Box, Card, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useMemo, useState } from 'react'
import { useGetFabricOutwardCusDetailQuery } from "../../../redux/service/freeLookFabric";
import CustomerTrans from "./CustomerTrans";

const CustomerDetails = ({ year, finYear, category, setCategory }) => {
    const [fYear, setFYear] = useState(year);
    const [showTable, setShowTable] = useState(false);
    const [custName, setCustName] = useState(false)
    const { data: fabricData } = useGetFabricOutwardCusDetailQuery({
        params: {
            finyear: fYear,
            category: category
        },
    }, {
        skip: !fYear || !category
    });
    const rows = fabricData?.data || [];
    const { categories, series } = useMemo(() => {
        const categories = rows.map((row) => row.customer);

        return {
            categories,
            series: [
                {
                    name: "Total",
                    data: rows.map((row) => Number(row.count || 0)),
                },
                {
                    name: "Quantity",
                    data: rows.map((row) => Number(row.qty || 0)),
                },
            ],
        };
    }, [rows]);

    // const options = {
    //     chart: {
    //         type: "column",
    //         height: 360,

    //         options3d: {
    //             enabled: true,
    //             alpha: 10,
    //             beta: 10,
    //             depth: 40,
    //             viewDistance: 30,
    //         },
    //         backgroundColor: "#FFFFFF",
    //         marginBottom: 100,
    //     },
    //     title: null,

    //     xAxis: {
    //         categories,
    //         title: {
    //             text: "Customer",
    //             style: {
    //                 color: "#374151",
    //                 fontSize: "12px",
    //                 fontWeight: "bold",
    //             },
    //             margin: 20,
    //         },
    //         labels: {
    //             style: { color: "#6B7280", fontSize: "10px" },
    //         },
    //     },

    //     yAxis: {
    //         title: {
    //             text: "Value",
    //             style: {
    //                 fontSize: "12px",
    //                 color: "#374151",
    //                 fontWeight: "bold",
    //                 margin: 15,
    //             },
    //             margin: 20,
    //         },
    //         labels: {
    //             style: { fontSize: "10px", color: "#9CA3AF" },
    //         },
    //     },

    //     tooltip: {
    //         shared: true,
    //         useHTML: true,
    //         formatter: function () {
    //             return `
    //           <b>${this.x}</b><br/>
    //           ${this.points
    //                     .map(
    //                         (p) =>
    //                             `<span style="color:${p.color}">\u25CF</span>
    //                  ${p.series.name}: <b>${p.y}</b><br/>`
    //                     )
    //                     .join("")}
    //         `;
    //         },
    //     },

    //     plotOptions: {
    //         column: {
    //             stacking: "normal",
    //             depth: 40,
    //             pointWidth: 30,
    //             borderRadius: 4,
    //         },
    //     },

    //     legend: {
    //         align: "center",
    //         verticalAlign: "top",
    //         layout: "horizontal",
    //         itemStyle: {
    //             color: "#374151",
    //             fontSize: "10px",
    //             fontWeight: "500",
    //         },
    //     },

    //     series,
    // };

    const options = {
        chart: {
            type: "pie",
            options3d: {
                enabled: true,
                alpha: 40,
            },
            backgroundColor: "#FFFFFF",
            height: 360,
            borderRadius: 10,
            margin: [0, 0, 0, 0],
        },

        title: {
            text: "",
        },

        subtitle: {
            text: "",
        },

        plotOptions: {
            pie: {
                innerSize: 100,      // donut
                depth: 60,
                center: ["50%", "50%"],
                size: "100%",

                dataLabels: {
                    distance: -5,
                    formatter: function () {
                        return `${this.point.name}`;
                    },
                    style: {
                        color: "#000000",
                        fontWeight: "normal",
                        fontSize: "10px",
                    },
                },

                point: {
                    events: {
                        click: function () {
                            setShowTable(true)
                            setCustName(this.name) // optional
                        },
                    },
                },
            },
        },

        tooltip: {
            style: {
                color: "#374151",
                fontSize: "10px",
            },
            headerFormat: "<b>{point.key}</b><br/>",
            pointFormatter: function () {
                return `
        <span style="color:${this.color}">\u25CF</span>
        Total: <b>${this.y.toLocaleString("en-IN")}</b><br/>
        Quantity: <b>${this.qty.toLocaleString("en-IN")}</b><br/>
      `;
            },
        },

        series: [
            {
                name: "Fabric Outward",
                data: rows.map((item) => ({
                    name: item.customer,
                    y: Number(item.count || 0),   // main value
                    qty: Number(item.qty || 0),   // extra tooltip field
                    Year: fYear,
                })),
            },
        ],

        credits: {
            enabled: false,
        },
    };

    return (
        <></>
    )
}

export default CustomerDetails