// import React, { useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   useTheme,
// } from "@mui/material";
// import { useGetMisDashboardErpCustomerWiseQuery } from "../../../redux/service/misDashboardServiceERP";
// import { useDispatch } from "react-redux";
// import { push } from "../../../redux/features/opentabs";
// import CustomerWiseTable from "./CustomerWiseTable";
// const COLORS = [
//   "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
//   "#B435E3", "#E35B5B", "#FFA500", "#800080",
//   "#00CED1", "#DC143C",
// ];

// const Form = ({ companyName, finYear }) => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const [showTable, setShowTable] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   const [search, setSearch] = useState({

//   });
//   console.log(selectedCustomer?.customerName, selectedCustomer?.finYear, selectedCustomer?.companyName, selectedCustomer?.value, "cheking");

//   const { data: customer } =
//     useGetMisDashboardErpCustomerWiseQuery({
//       params: { companyName, finYear },
//     });

//   const filteredData = Array.isArray(customer?.data)
//     ? customer.data
//     : [];
// console.log(filteredData,"filteredData")
//   // ❌ remove zero values for log scale
//   const chartData = filteredData
//     .filter(item => Number(item.currentValue) > 0)
//     .map((item, index) => ({
//       y: Number(item.currentValue),
//       color: COLORS[index % COLORS.length],
//       customer: item.customer,
//     }));

//   const categories = filteredData
//     .filter(item => Number(item.currentValue) > 0)
//     .map(item => item.customer);

//   const handlePointClick = (point) => {
//     setSelectedCustomer({
//       customerName: point.options.customer,
//       value: point.options.y,
//       finYear,
//       companyName,
//     });

//     setShowTable(true);
//   };


//   const options = {
//     chart: {
//       type: "column",
//       height: 380,
//     },

//     title: { text: "" },

//     xAxis: {
//       categories,
//       labels: {
//         rotation: -45,
//         style: { fontSize: "11px" },
//       },
//       title: { text: "Customer" },
//     },

//     yAxis: {
//       type: "logarithmic", // 🔥 KEY FIX
//       min: 1,
//       title: { text: "Turnover (Log Scale)" },
//       labels: {
//         formatter() {
//           return this.value.toLocaleString("en-IN");
//         },
//       },
//     },

//     tooltip: {
//       formatter() {
//         return `
//           <b>${this.point.customer}</b><br/>
//           Value: <b>${this.y.toLocaleString("en-IN")}</b>
//         `;
//       },
//     },

//     plotOptions: {
//       column: {
//         cursor: "pointer",
//         dataLabels: {
//           enabled: true,
//           rotation: -90, // or 0 if you want horizontal
//           inside: true,        // render inside the bar
//           style: {
//             fontSize: "11px",
//             fontWeight: "bold",
//             color: "#fff",     // white text for better contrast
//             textOutline: "1px contrast",
//           },

//           formatter() {
//             return this.y.toLocaleString("en-IN");
//           },
//         },
//         point: {
//           events: {
//             click() {
//               handlePointClick(this);
//             },
//           },
//         },
//       },
//     },

//     series: [
//       {
//         name: "Turnover",
//         data: chartData,
//       },
//     ],

//     legend: { enabled: false },
//   };

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 2, ml: 1, width: 700 }}>
//       <CardHeader
//         title="Customer Wise TurnOver"
//         titleTypographyProps={{
//           sx: { fontSize: ".9rem", fontWeight: 600 },
//         }}
//         sx={{
//           p: 1,
//           borderBottom: `2px solid ${theme.palette.divider}`,
//         }}
//       />
//       <CardContent>
//         <HighchartsReact
//           highcharts={Highcharts}
//           options={options}
//           immutable
//         />
//       </CardContent>
//       {showTable && (
//         <CustomerWiseTable customerName={selectedCustomer?.customerName}
//           finYear={selectedCustomer?.finYear}
//           companyName={selectedCustomer?.companyName}
//           value={selectedCustomer?.value} search={search} setSearch={setSearch} closeTable={() => setShowTable(false)}
//         />
//       )}
//     </Card>
//   );
// };

// export default Form;
import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
import { useGetMisDashboardErpCustomerWiseQuery } from "../../../redux/service/misDashboardServiceERP";
import { useSelector, useDispatch } from "react-redux";
import CustomerWiseTable from "./CustomerWiseTable";
import { setSelectedYear, setFilterBuyer } from "../../../redux/features/dashboardFiltersSlice";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const Form = ({ companyName: propCompanyName, finYear: propFinYear }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const reduxState = useSelector(state => state.dashboardFilters);

  // Use props first; fallback to Redux for default values
  const companyName = propCompanyName || reduxState.filterBuyer;
  const finYear = propFinYear || reduxState.selectedYear;

  const [showTable, setShowTable] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState({});

  // Sync Redux defaults if empty
  useEffect(() => {
    if (!reduxState.filterBuyer && propCompanyName) dispatch(setFilterBuyer(propCompanyName));
    if (!reduxState.selectedYear && propFinYear) dispatch(setSelectedYear(propFinYear));
  }, [dispatch, reduxState.filterBuyer, reduxState.selectedYear, propCompanyName, propFinYear]);

  const { data: customer } = useGetMisDashboardErpCustomerWiseQuery(
    { params: { companyName, finYear } },
    { skip: !companyName || !finYear }
  );

  const filteredData = Array.isArray(customer?.data) ? customer.data : [];

  const chartData = filteredData
    .filter(item => Number(item.currentValue) > 0)
    .map((item, index) => ({
      y: Number(item.currentValue),
      color: COLORS[index % COLORS.length],
      customer: item.customer,
    }));

  const categories = chartData.map(item => item.customer);

  const handlePointClick = (point) => {
    setSelectedCustomer({
      customerName: point.options.customer,
      value: point.options.y,
      finYear,
      companyName,
    });
    setShowTable(true);
  };

  const options = {
    chart: { type: "column", height: 380 },
    title: { text: "" },
    xAxis: { categories, labels: { rotation: -45, style: { fontSize: "11px" } }, title: { text: "Customer" } },
    yAxis: { type: "logarithmic", min: 1, title: { text: "Turnover (Log Scale)" }, labels: { formatter() { return this.value.toLocaleString("en-IN"); } } },
    tooltip: { formatter() { return `<b>${this.point.customer}</b><br/>Value: <b>${this.y.toLocaleString("en-IN")}</b>`; } },
    plotOptions: {
      column: {
        cursor: "pointer",
        pointWidth: 25,
        dataLabels: {
          enabled: true,
          rotation: -90,
          
          inside: true,
          style: { fontSize: "11px", fontWeight: "bold", color: "#fff", textOutline: "1px contrast" },
          formatter() { return this.y.toLocaleString("en-IN"); }
        },
        point: { events: { click() { handlePointClick(this); } } }
      }
    },
    series: [{ name: "Turnover", data: chartData }],
    legend: { enabled: false },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 2, ml: 1,  }}>
      <CardHeader title="Customer Wise TurnOver" titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }} sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }} />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} immutable />
      </CardContent>

      {showTable && selectedCustomer && (
        <CustomerWiseTable
          customerName={selectedCustomer.customerName}
          finYear={selectedCustomer.finYear}
          companyName={selectedCustomer.companyName}
          value={selectedCustomer.value}
          search={search}
          setSearch={setSearch}
          closeTable={() => setShowTable(false)}
        />
      )}
    </Card>
  );
};

export default Form;
