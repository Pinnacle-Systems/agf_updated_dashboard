import { useMemo, useState } from 'react'
import { Box, Card, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useGetFabricOutwardDetailQuery } from '../../../redux/service/freeLookFabric';

const OutwardType = ({ year, finYear, setCategory }) => {
    const [fYear, setFYear] = useState(year)
    const { data: fabricData } = useGetFabricOutwardDetailQuery({
        params: {
            finyear: fYear
        },
    }, {
        skip: !fYear
    });
    const rows = fabricData?.data || [];
    const { categories, series } = useMemo(() => {
        const categories = rows.map((row) => row.category);

        return {
            categories,
            series: [
                {
                    name: "Total",
                    data: rows.map((row) => Number(row.count || 0)),
                    color: "#DC2626", // red

                },
                {
                    name: "Quantity",
                    data: rows.map((row) => Number(row.qty || 0)),
                    color: "#475569", // slate
                },
            ],
        };
    }, [rows]);

    const options = {
        chart: {
            type: "column",
            height: 360,

            options3d: {
                enabled: true,
                alpha: 10,
                beta: 10,
                depth: 40,
                viewDistance: 30,
            },
            backgroundColor: "#FFFFFF",
            marginBottom: 100,
        },
        title: null,

        xAxis: {
            categories,
            title: {
                text: "Category",
                style: {
                    color: "#374151",
                    fontSize: "12px",
                    fontWeight: "bold",
                },
                margin: 20,
            },
            labels: {
                style: { color: "#6B7280", fontSize: "10px" },
            },
        },

        yAxis: {
            title: {
                text: "Value",
                style: {
                    fontSize: "12px",
                    color: "#374151",
                    fontWeight: "bold",
                    margin: 15,
                },
                margin: 20,
            },
            labels: {
                style: { fontSize: "10px", color: "#9CA3AF" },
            },
        },

        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {
                return `
           <b>${this.x}</b><br/>
           ${this.points
                        .map(
                            (p) =>
                                `<span style="color:${p.color}">\u25CF</span>
                  ${p.series.name}: <b>${p.y}</b><br/>`
                        )
                        .join("")}
         `;
            },
        },

        plotOptions: {
            column: {
                stacking: "normal",
                depth: 40,
                pointWidth: 30,
                borderRadius: 4,
            },
            series: {
                cursor: "pointer",
                point: {
                    events: {
                        click: function () {
                            setCategory(this.category)
                        },
                    },
                },
            },
        },

        legend: {
            align: "center",
            verticalAlign: "top",
            layout: "horizontal",
            itemStyle: {
                color: "#374151",
                fontSize: "10px",
                fontWeight: "500",
            },
        },

        series,
    };

    return (
        <div>
            <Card
                sx={{
                    borderRadius: 3,
                    boxShadow: 4,
                    minHeight: 500,          // 👈 increase card height
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardHeader
                    title="Fabric Outward Details"
                    titleTypographyProps={{
                        sx: { fontSize: "1rem", fontWeight: 600 },
                    }}
                    sx={{
                        borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                    }}
                />
                <Box>
                    <div className="flex justify-end m-2 mr-6">
                        <div className="flex flex-col justify-end w-32">
                            <label className="text-xs font-medium mb-1">FinYear</label>
                            <select
                                value={fYear}
                                onChange={(e) => setFYear(e.target.value)}
                                className="border rounded-md text-xs p-1"
                            >{finYear?.data?.map((option) => {
                                return <option key={option.finYear} value={option.finYear}>{option.finYear}</option>
                            })
                                }
                            </select>
                        </div>
                    </div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                        containerProps={{
                            style: {
                                minWidth: '100%',
                                height: '100%',
                                borderRadius: "10px",
                            }
                        }}
                    />
                </Box>
            </Card>
        </div>
    )
}

export default OutwardType