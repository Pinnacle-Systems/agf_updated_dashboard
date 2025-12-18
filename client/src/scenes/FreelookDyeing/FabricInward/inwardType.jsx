import { useMemo, useState } from 'react'
import { useGetFabricInwardDetailQuery } from '../../../redux/service/freeLookFabric';
import { Box, Card, CardContent, CardHeader, Typography, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";
const InwardType = ({ year, finYear, setCategory }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [fYear, setFYear] = useState(year)
    const { data: fabricData } = useGetFabricInwardDetailQuery({
        params: {
            finyear: fYear
        },
    }, {
        skip: !fYear
    });
    const rows = fabricData?.data || [];
    const pieSeries = useMemo(() => {
        return [
            {
                name: "Inward",
                colorByPoint: true,
                data: rows.map((row) => ({
                    name: row.category,
                    y: Number(row.qty || 0),
                    count: Number(row.count || 0),
                })),
            },
        ];
    }, [rows]);

    const options = {
        chart: {
            type: "pie",
            height: 250,
            backgroundColor: "#FFFFFF",
            options3d: {
                enabled: true,
                alpha: 45,
            },
        },

        title: null,

        tooltip: {
            useHTML: true,
            formatter: function () {
                return `
            <b>${this.point.name}</b>
            <table style="margin-top:4px;">
                <tr>
                    <td>Qty</td>
                    <td style="padding:0 6px;">:</td>
                    <td><b>${this.point.y.toLocaleString("en-IN")}</b></td>
                </tr>
                 <tr>
                    <td>Count</td>
                    <td style="padding:0 6px;">:</td>
                    <td><b>${this.point.count.toLocaleString("en-IN")}</b></td>
                </tr>
            </table>
        `;
            },
        },

        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                depth: 35,
                dataLabels: {
                    enabled: true,
                    distance: -30,                 // push label towards center
                    format: "{point.name}",        // only label
                    align: "center",               // horizontal center
                    verticalAlign: "middle",       // vertical center
                    style: {
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#FFFFFF",          // white text
                        textOutline: "none",
                    },
                },
                point: {
                    events: {
                        click: function () {
                            dispatch(
                                push({
                                    id: "FabricInward",
                                    name: "FabricInward",
                                    component: "FabricInward",
                                    data: { finYear: finYear, year: fYear, selectCategory: this.name },
                                })
                            );
                        },
                    },
                },
            },
        },

        legend: {
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                fontSize: "10px",
                fontWeight: 500,
            },
        },

        series: pieSeries,
    };

    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: 4,
                width: "100%",
                ml: 1,
            }}
        >
            <CardHeader
                title="Fabric Inward Details"
                titleTypographyProps={{
                    sx: { fontSize: "1rem", fontWeight: 600 },
                }}
                sx={{
                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                }}
            />
            <CardContent sx={{ pb: 0 }}>
                <div className="flex justify-end  mr-6">
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
                />
                <Box
                    sx={{
                        p: 1,
                        bgcolor: "background.default",
                        borderRadius: 3,
                        textAlign: "center",
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Over All Inward Quantity : {rows
                            .reduce((sum, item) => sum + Number(item.qty || 0), 0)
                            .toLocaleString("en-IN")}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default InwardType