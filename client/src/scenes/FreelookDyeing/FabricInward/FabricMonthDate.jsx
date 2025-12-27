import { Box, Card, CardContent, CardHeader, Typography, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState } from 'react'
import { useGetFabricInwardMonthDateQuery, useGetFabricInwardMonthDetailQuery } from "../../../redux/service/freeLookFabric";
import CustomerTrans from "./CustomerTrans";
import CustomerTransDate from "./CustomerTransDate";

const FabricMonthDate = ({
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
    const [selectedDate, setSelectedDate] = useState("")
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
    const totalQty = rows.reduce((sum, r) => sum + Number(r.qty || 0), 0);

    const buildDates = (day, monthName, finYear) => {
        const monthMap = {
            JANUARY: "01",
            FEBRUARY: "02",
            MARCH: "03",
            APRIL: "04",
            MAY: "05",
            JUNE: "06",
            JULY: "07",
            AUGUST: "08",
            SEPTEMBER: "09",
            OCTOBER: "10",
            NOVEMBER: "11",
            DECEMBER: "12",
        };

        const month = monthMap[monthName.toUpperCase()];
        if (!month) return { isoDate: "", displayDate: "" };

        // Financial year handling
        const [fyStart, fyEnd] = finYear.split("-");
        const year =
            Number(month) >= 4 ? `20${fyStart}` : `20${fyEnd}`;

        const dd = day.padStart(2, "0");

        return {
            isoDate: `${year}-${month}-${dd}`,
            displayDate: `${dd}/${month}/${year}`,
        };
    };


    const options = {
        chart: {
            type: "line",
            height: 260,
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
                            const day = this.category; // "02", "03", etc
                            const monthName = selectmonths.split(" ")[0]; // "JULY"
                            const { isoDate, displayDate } = buildDates(
                                day,
                                monthName,
                                selectedYear
                            );
                            setSelectedDate(isoDate); 
                            setShowTable(true);
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
                <Box
                    sx={{
                        bgcolor: "background.default",
                        borderRadius: 3,
                        textAlign: "center",
                        border: `1px solid ${theme.palette.divider}`,
                        p: 1,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {selectmonths.split(" ")[0]} Month Inward Qty : {totalQty.toLocaleString("en-IN", {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                        })}
                    </Typography>
                </Box>
            </CardContent>
            {showTable && (
                <CustomerTransDate
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
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            )}
        </Card>
    );
};



export default FabricMonthDate