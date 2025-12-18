import { Card, CardContent, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { useState } from 'react'
import { useGetFabricInwardCusDetailQuery } from "../../../redux/service/freeLookFabric";
import CustomerTrans from "./CustomerTrans";

const CustomerDetails = ({ selectedYear, category, finYear }) => {
    const [showTable, setShowTable] = useState(false);
    const [custName, setCustName] = useState('')
    const { data: fabricData } = useGetFabricInwardCusDetailQuery(
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

    const customers = rows.map((r) => r.customer);
    const counts = rows.map((r) => Number(r.count || 0));
    const qtys = rows.map((r) => Number(r.qty || 0));

    const options = {
        chart: {
            type: "column",
            height: 350,
            options3d: {
                enabled: true,
                alpha: 7,
                beta: 7,
                depth: 50,
                viewDistance: 25,
            },
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
        },

        title: null,
        legend: { enabled: false },

        xAxis: {
            categories: customers,
            labels: {
                style: { fontSize: "10px", color: "#6B7280" },
                rotation: 90,
            },
        },

        yAxis: {
            title: {
                text: "Count",
                style: { fontSize: "12px", fontWeight: 600 },
            },
        },

        tooltip: {
            useHTML: true,
            formatter: function () {
                return `
      <b>${this.point.name}</b>
      <table style="margin-top:4px;">
        <tr>
          <td>Qty</td>
          <td style="padding:0 6px;">:</td>
          <td><b>${this.point.qty.toLocaleString("en-IN")}</b></td>
        </tr>
         <tr>
          <td>Count</td>
          <td style="padding:0 6px;">:</td>
          <td><b>${this.point.y.toLocaleString("en-IN")}</b></td>
        </tr>
      </table>
    `;
            },
        },

        plotOptions: {
            column: {
                depth: 25,
                colorByPoint: true,
                borderRadius: 5,
            },
            series: {
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y.toLocaleString("en-IN");
                    },
                    style: {
                        fontSize: "10px",
                        fontWeight: "normal",
                    },
                },
                point: {
                    events: {
                        click: function () {
                            setCustName(this.name)
                            setShowTable(true);
                        },
                    },
                },
            },
        },

        series: [
            {
                name: "Customer",
                data: rows.map((item) => ({
                    name: item.customer,
                    y: Number(item.count || 0), // Count
                    qty: Number(item.qty || 0), // Qty for tooltip
                })),
            },
        ],

        credits: { enabled: false },
    };

    return (
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
            <CardHeader
                title="Customer Details"
                titleTypographyProps={{
                    sx: { fontSize: "1rem", fontWeight: 600 },
                }}
                sx={{
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
                    category={category}
                    custName={custName}
                    setCustName={setCustName}
                />
            )}
        </Card>
    );
};


export default CustomerDetails