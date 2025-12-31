import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
} from "@mui/material";
import { useGetMisDashboardErpCountryWiseQuery } from "../../../redux/service/misDashboardServiceERP";
import CountryWiseTable from "../salarydata/TableData/CountryWiseTable";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const Form = ({ companyName, finYear, finYr, filterBuyerList }) => {
  const theme = useTheme();
  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const [showTable, setShowTable] = useState(false);


  const [selectedCountry, setSelectedCountry] = useState(null);

  const { data: response } =
    useGetMisDashboardErpCountryWiseQuery({
      params: { finYear, companyName },
    });


  const filteredData = Array.isArray(response?.data)
    ? response.data
    : [];
const MIN_SLICE_VALUE = 300000; // set based on chart scale
  // ✅ Pie chart data
  const pieData = filteredData
    .filter(item => item.value > 0)
     .map((item, index) => {
    const y = item.value < MIN_SLICE_VALUE ? MIN_SLICE_VALUE : item.value;
    return {
      name: item.countryName,
      y,
      originalValue: item.value, // store original value for tooltip
      color: COLORS[index % COLORS.length],
    };
  });

  const options = {
    chart: {
      type: "pie",
      height: 380,
    },

    title: { text: "" },

    tooltip: {
      formatter() {
        return `
      <b>${this.point.name}</b><br/>
      Turnover: <b>${formatINR(this.point.originalValue)}</b>
    `;
      },
    },


    plotOptions: {
      pie: {
        allowPointSelect: true,
        minPointSize: 30,   // 👈 IMPORTANT

        cursor: "pointer",
        dataLabels: {

          enabled: true,
          allowOverlap: true,
          distance: 30,
          formatter() {
            return `<b>${this.point.name}</b>: ${formatINR(this.point.originalValue)}`;
          },
          style: {
            fontSize: "11px",
            fontWeight: "bold",
          },
        },
            // showInLegend: true, 

        point: {
          events: {
            click: function () {
              setSelectedCountry(this.name);
              setShowTable(true);
            },
          },
        },

      },
    },

    series: [
      {
        name: "Turnover",
        data: pieData,
      },
    ],

    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
    },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 2, ml: 1 }}>
      <CardHeader
        title="Country Wise Turnover"
        titleTypographyProps={{
          sx: { fontSize: ".9rem", fontWeight: 600 },
        }}
        sx={{
          p: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />
      <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          immutable
        />
      </CardContent>
      {showTable && selectedCountry && (
        <CountryWiseTable
          companyName={companyName}
          countryName={selectedCountry}
          filterBuyerList={filterBuyerList}
          finYr={finYr}

          closeTable={() => setShowTable(false)}
        />
      )}
    </Card>
  );
};

export default Form;
