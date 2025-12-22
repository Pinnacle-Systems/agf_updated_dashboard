import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, Box, Typography, useTheme } from "@mui/material";
import { useGetMisDashboardErpCustomerWiseQuery } from "../../../redux/service/misDashboardServiceERP";
import EmptypeDetails from "../../../components/EmptypesalayDetails";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B435E3", "#E35B5B",
  "#FFA500", "#800080", "#00CED1", "#DC143C"
];

const Form = ({ companyName, finYear }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);

  const { data: customer } = useGetMisDashboardErpCustomerWiseQuery({
    params: { companyName, finYear },
  });

  const filteredData = Array.isArray(customer?.data) ? customer.data : [];

  const categories = filteredData.map(item => item.customer);
  const seriesData = filteredData.map((item, index) => ({
    y: item.currentValue,
    color: COLORS[index % COLORS.length],
    customer: item.customer,
  }));

  const handlePointClick = (point) => {
    // setShowTable(true);
    dispatch(
      push({
        // id: `Customer-${point.customer}`,
        // name: "Customer Wise Turn Over",
        // component: "EmptypeDetails",
        data: { customerName: point.customer, finYear },
      })
    );
  };

  const options = {
    chart: { type: "column", height: 300 },
    title: { text: "" },
    xAxis: {
      categories,
      labels: { rotation: -45, style: { fontSize: "11px" } },
      title: { text: "Customer" },
    },
    yAxis: {
      title: { text: "Count / Value" },
      labels: {

        formatter() {
          return this.value.toLocaleString("en-IN");
        },
      },
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        return `<b>${this.point.customer}</b><br/>Value: <b>${this.y.toLocaleString("en-IN")}</b>`;
      },
    },
    plotOptions: {
      column: {
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          //      rotation: -90, 
          // align: 'center',
          rotation: -90, // rotate the values vertically
          align: 'center',
          formatter() { return this.y.toLocaleString("en-IN"); },
        },
        point: {
          events: {
            click: function () {
              handlePointClick(this);
            },
          },
        },
      },
    },
    series: [{
      name: "Value",
      data: seriesData,
    }],
    legend: { enabled: false },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 2, ml: 1, width: 700 }}>
      <CardHeader
        title="Customer Wise TurnOver"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
        {/* <Box sx={{ mt: 2 }}>
          {filteredData.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: COLORS[index % COLORS.length],
                  mr: 1.5,
                }}
              />
              <Typography variant="body2" sx={{ fontSize: "11px" }}>
                <strong>{item.currentValue.toLocaleString("en-IN")}</strong> — {item.customer}
              </Typography>
            </Box>
          ))}
        </Box> */}
      </CardContent>

      {showTable && <EmptypeDetails />}
    </Card>
  );
};

export default Form;
