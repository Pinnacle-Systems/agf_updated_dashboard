import { Card, CardContent, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState } from 'react'
import { useGetFabricInwardMonthDetailQuery } from "../../../redux/service/freeLookFabric";
import CustomerTrans from "./CustomerTrans";

const CustMonthDtl = ({
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

    const { data: fabricData } = useGetFabricInwardMonthDetailQuery(
        {
            params: {
                finyear: selectedYear,
                category: category,
            },
        },
        {
            skip: !selectedYear || !category,
        }
    );

    const rows = fabricData?.data || [];

    // 🔹 Clean month names (remove spaces)
    const Months = rows.map((r) => r.month.trim());
    const QtyData = rows.map((r) => Number(r.qty || 0));

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
                text: "Inward Qty",
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
          <td>Qty</td>
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
                            setSelectmonths(this.category);
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        series: [
            {
                name: "Inward Qty",
                data: QtyData,
                color: "#16A34A",          // Emerald Green
                marker: {
                    fillColor: "#16A34A",
                    lineWidth: 2,
                    lineColor: "#14532D",    // Dark green border
                },
            },
        ],

        credits: { enabled: false },
    };

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title="Month wise"
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
                <CustomerTrans
                    closeTable={() => setShowTable(false)}
                    finYear={finYear}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    category={category}
                    setCategory={setCategory}
                    selectmonths={selectmonths}
                    setSelectmonths={setSelectmonths}
                />
            )}
        </Card>
    );
};



export default CustMonthDtl