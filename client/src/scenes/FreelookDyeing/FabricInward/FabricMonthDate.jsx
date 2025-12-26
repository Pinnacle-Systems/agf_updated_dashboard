import { Card, CardContent, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState } from 'react'
import { useGetFabricInwardMonthDateQuery, useGetFabricInwardMonthDetailQuery } from "../../../redux/service/freeLookFabric";

const FabricMonthDate = ({
    selectedYear,
    setSelectedYear,
    category,
    finYear,
    setCategory,
    selectmonths,
    setSelectmonths,
}) => {
    const [showTable, setShowTable] = useState(false);
    const [custName, setCustName] = useState("");

    const { data: fabricData } = useGetFabricInwardMonthDateQuery(
        {
            params: {
                finyear: selectedYear,
                category: category,
                month: selectmonths
            },
        },
        {
            skip: !selectedYear || !category || !selectmonths,
        }
    );

    const rows = fabricData?.data || [];

    // 🔹 Clean month names (remove spaces)
    const Months = rows.map((r) => r.inwDate);
    const QtyData = rows.map((r) => Number(r.qty || 0));

    const normalizeMonth = (m) =>
        m.charAt(0).toUpperCase() + m.slice(1).toLowerCase();

    const options = {
        chart: {
            type: "line",
            height: 290,
            backgroundColor: "#f5f5f5",
            marginBottom: 90,
        },

        title: null,
        legend: { enabled: false },

        xAxis: {
            categories: Months,
            title: {
                text: "Month",
                style: { fontSize: "10px" },
            },
            labels: {
                style: { fontSize: "10px" },
            },
        },

        yAxis: {
            min: 0,
            title: {
                text: " Qty",
                style: { fontSize: "12px", fontWeight: 600 },
            },
            labels: {
                style: { fontSize: "10px" },
            },
        },

        tooltip: {
            shared: true,
            useHTML: true,
            formatter: function () {
                const point = this.points[0].point;

                return `
      <b>${this.x}</b>
      <table style="margin-top:4px;">
        <tr>
          <td>Qty (kgs)</td>
          <td style="padding:0 6px;">:</td>
          <td><b>${point.y.toLocaleString("en-IN")}</b></td>
        </tr>
      </table>  
    `;
            },
        },


        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    radius: 4,
                    symbol: "circle",
                },

                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y.toLocaleString("en-IN");
                    },
                    style: {
                        fontSize: "9px",
                        fontWeight: "normal",
                    },
                },

                point: {
                    events: {
                        click: function () {
                            // const monthName = this.category; // "JULY"
                            // const correctMonth = getFinYearMonth(monthName, selectedYear);
                            // setSelectmonths(correctMonth);
                            // console.log(correctMonth)
                            // // setShowTable(true);
                        },
                    },
                },
            },
        },

        series: [
            {
                name: "Qty",
                data: QtyData,
                color: "#DC2626",           // Emerald Green
                marker: {
                   fillColor: "#DC2626",
                    lineWidth: 2,
                    lineColor: "#7F1D1D",   // Dark green border
                },
            },
        ],

        credits: { enabled: false },
    };

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title="Date wise Contribution"
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

        </Card>
    );
};



export default FabricMonthDate