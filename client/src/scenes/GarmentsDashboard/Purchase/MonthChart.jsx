// import React, { useMemo, useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import highchartsMore from "highcharts/highcharts-more";

// import {
//   Card,
//   CardHeader,
//   CardContent,
//   useTheme,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Box,
// } from "@mui/material";
// import {
//   useGetMonthPurchaseOrderQuery,
//   useGetMonthGeneralPurchaseQuery,
//   useGetMonthCombinedPurchaseQuery,
// } from "../../../redux/service/purchaseService";
// import YearWiseTable from "./TableData/YearTable";
// import { useEffect } from "react";
// import SpinLoader from "../../../utils/spinLoader";

// const YEAR_COLORS = [
//   "#0088FE",
//   "#00C49F",
//   "#FFBB28",
//   "#FF8042",
//   "#A28DFF",
//   "#FF6699",
//   "#33CC99",
//   "#66B2FF",
// ];
// highchartsMore(Highcharts);

// const MonthChart = ({
//   companyName,
//   finYear,
//   finYr,
//   poType,
//   companyList,
//   setChartToShow,
//   chartToshow,
//   purchaseTypeOptions,
// }) => {
//   const theme = useTheme();
//   const [showYearTable, setShowYearTable] = useState(false);
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [selectedCompCode, setSelectedCompCode] = useState("");
//   const [selectedOrderType, setSelectedOrderType] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
//   const [selectedMonthColor, setSelectedMonthColor] = useState("#00C49F");
//   console.log(poType, "poType");
//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

//   const formatINRShort = (value) => {
//     const num = Number(value);
//     if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
//     if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
//     return `₹ ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   // API calls
// //   const {
// //     data: monthResponse,
// //     isLoading,
// //     isFetching,
// //   } = useGetMonthPurchaseOrderQuery(
// //     { params: { finYear, companyName } },
// //     { skip: !finYear || !companyName },
// //   );
//   const {
//     data: monthGeneralResponse,
//     isLoading : monthGeneralResponseLoading,
//     isFetching : monthGeneralResponseFetching,
//   } = useGetMonthGeneralPurchaseQuery(
//     { params: { finYear, companyName } },
//     { skip: !finYear || !companyName },
//   );
//   const {
//     data: monthResponse,
//     isLoading,
//     isFetching,
//   } = useGetMonthCombinedPurchaseQuery(
//     { params: { finYear, companyName } },
//     { skip: !finYear || !companyName },
//   );
 
// const {
//   data : useGetMonthPurchaseOrderQuery
// } = useGetMonthPurchaseOrderQuery(
//    { params: { finYear, companyName } },
//     { skip: !finYear || !companyName },
// )

//   console.log(monthResponse, "monthResponse");
  
//   useEffect(() => {
//     setShowYearTable(false);
//     setSelectedYear(null);
//     setSelectedCompCode("");
//   }, [poType]);

// let responseToshow = poType === "All" ? monthResponse?.data : monthGeneralResponse?.data

//   const monthChartData = useMemo(
//     () =>
//       (Array.isArray(responseToshow) ? responseToshow : []).map(
//         (i) => ({
//           month: i.month || i.label,
//           value: Number(i.VAL || i.value),
//           year: i.yearNo,
//         }),
//       ),
//     [responseToshow],
//   );
//   console.log(monthChartData, "monthChartData");

//   const monthCategories = useMemo(
//     () => monthChartData.map((i) => i.month ?? i.label),
//     [monthChartData],
//   );
//   const monthSeriesData = useMemo(
//     () => monthChartData.map((i) => Number(i.value)),
//     [monthChartData],
//   );

//   const selectedMonthData = useMemo(
//     () =>
//       selectedMonthIndex !== null ? monthChartData[selectedMonthIndex] : null,
//     [selectedMonthIndex, monthChartData],
//   );
//   const monthChartOptions = useMemo(
//     () => ({
//       chart: { type: "spline", height: 430, backgroundColor: "transparent" },
//       title: { text: "" },
//       xAxis: {
//         categories: monthCategories,
//         lineColor: "#ddd",
//         tickColor: "#ddd",
//         labels: { style: { fontSize: "12px" } },
//       },
//       yAxis: {
//         title: { text: "" },
//         gridLineDashStyle: "Dash",
//         labels: {
//           formatter() {
//             return formatINR(this.value);
//           },
//           style: { fontSize: "12px" },
//         },
//       },
//       tooltip: {
//         backgroundColor: "#000",
//         style: { color: "#fff" },
//         borderRadius: 8,
//         formatter() {
//           // Use the month and year from the data
//           const data = monthChartData[this.point.index]; // get the raw data
//           return `<b>${data.month}</b><br/>${formatINR(this.y)}`;
//         },
//       },
//       plotOptions: {
//         spline: {
//           lineWidth: 3,
//           marker: { enabled: true, radius: 4 },
//           states: { hover: { lineWidth: 4 } },
//           dataLabels: {
//             enabled: true,
//             formatter() {
//               return formatINR(this.y);
//             },
//             style: { fontSize: "12px", fontWeight: "400", color: "#000" },
//           },
//           point: {
//             events: {
//               click() {
//                 setSelectedMonth(this.category);
//                 setSelectedMonthIndex(this.index);
//                 setSelectedMonthColor(this.color);
//               },
//             },
//           },
//         },
//       },
//       series: [
//         {
//           name: "Purchase",
//           data: monthSeriesData,
//           zoneAxis: "x",
//           zones: [
//             { value: 1, color: "#0088FE" },
//             { value: 2, color: "#00C6FF" },
//             { value: 3, color: "#00C49F" },
//             { value: 4, color: "#FFBB28" },
//             { value: 5, color: "#FF8042" },
//             { value: 6, color: "#A28DFF" },
//             { value: 7, color: "#FF6699" },
//             { value: 8, color: "#33CC99" },
//             { value: 9, color: "#FF6666" },
//             { value: 10, color: "#66B2FF" },
//             { value: 11, color: "#99FF66" },
//             { color: "#FF9933" },
//           ],
//           marker: { enabled: true, radius: 4 },
//         },
//       ],
//       legend: { enabled: false },
//       credits: { enabled: false },
//     }),
//     [monthCategories, monthSeriesData,monthChartData],
//   );

//   const childOptions = selectedMonthData
//     ? {
//         chart: { type: "column", height: 383, backgroundColor: "transparent" },
//         title: { text: "" },
//         xAxis: {
//           categories: [selectedMonth],
//           lineColor: "#ddd",
//           labels: { style: { fontSize: "12px" } },
//         },
//         yAxis: {
//           title: { text: "" },
//           gridLineDashStyle: "Dash",
//           labels: { enabled: false },
//         },
//         tooltip: {
//           backgroundColor: "#000",
//           style: { color: "#fff" },
//           borderRadius: 8,
//           formatter() {
//             return `<b>${this.x}</b><br/>${formatINRShort(this.y)}`;
//           },
//         },
//         plotOptions: {
//           column: {
//             borderRadius: 8,
//             pointWidth: 50,
//             dataLabels: {
//               enabled: true,
//               inside: false,
//               verticalAlign: "bottom",
//               y: -10,
//               style: { color: "#000", fontSize: "12px", fontWeight: "600" },
//               formatter() {
//                 return formatINR(this.y);
//               },
//             },
//           },
//         },
//         series: [
//           {
//             name: "Purchase",
//             data: [Number(selectedMonthData.value)],
//             color: {
//               linearGradient: [0, 0, 0, 300],
//               stops: [
//                 [0, selectedMonthColor],
//                 [1, Highcharts.color(selectedMonthColor).brighten(0.2).get()], // slightly lighter at bottom
//               ],
//             },
//           },
//         ],
//         legend: { enabled: false },
//         credits: { enabled: false },
//       }
//     : null;

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title={"Month Wise Purchase"}
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
//         action={
//           <RadioGroup
//             row
//             value={chartToshow}
//             onChange={(e) => setChartToShow(e.target.value)}
//             sx={{ gap: 1 }}
//           >
//             {purchaseTypeOptions.map((opt) => (
//               <FormControlLabel
//                 key={opt.value}
//                 value={opt.value}
//                 control={<Radio size="small" />}
//                 label={opt.label}
//                 sx={{ fontSize: "11px" }}
//               />
//             ))}
//           </RadioGroup>
//         }
//       />
//       <CardContent
//         sx={{
//           position: "relative",
//           backgroundColor: "#fff",
//           mt: 1,
//           ml: 1,
//           height: 460,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {(isLoading || isFetching) && <SpinLoader />}
//         <Box sx={{ display: "flex", width: "100%", overflow: "hidden" }}>
//           <Box sx={{ width: "80%", transition: "width 0.35s ease" }}>
//             <HighchartsReact
//               key="month-chart"
//               highcharts={Highcharts}
//               options={monthChartOptions}
//               immutable
//             />
//           </Box>
//           <Box sx={{ width: "20%", transition: "width 0.35s ease" }}>
//             <Card sx={{ height: "100%", ml: 1 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   px: 1,
//                   py: 0.5,
//                   borderBottom: `1px solid ${theme.palette.divider}`,
//                 }}
//               >
//                 <Box sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
//                   {selectedMonth || ""} Purchase Details
//                 </Box>
//               </Box>
//               <CardContent>
//                 {selectedMonth && childOptions ? (
//                   <HighchartsReact
//                     highcharts={Highcharts}
//                     options={childOptions}
//                     immutable
//                   />
//                 ) : (
//                   <Box
//                     sx={{
//                       height: 260,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       color: "text.secondary",
//                       fontSize: "0.85rem",
//                     }}
//                   >
//                     Click a month to view details
//                   </Box>
//                 )}
//               </CardContent>
//             </Card>
//           </Box>
//         </Box>
//         {showYearTable && selectedYear && (
//           <YearWiseTable
//             year={selectedYear}
//             poType={poType}
//             type={selectedOrderType}
//             companyList={companyList}
//             selectedCompCode={selectedCompCode}
//             finYr={finYr}
//             closeTable={() => setShowYearTable(false)}
//           />
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default MonthChart;


import React, { useMemo, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import {
  Card, CardHeader, CardContent, useTheme,
  Radio, RadioGroup, FormControlLabel, Box,
} from "@mui/material";
import {
  useGetMonthPurchaseOrderQuery,
  useGetMonthGeneralPurchaseQuery,
  useGetMonthCombinedPurchaseQuery,
} from "../../../redux/service/purchaseService";
import YearWiseTable from "./TableData/YearTable";
import SpinLoader from "../../../utils/spinLoader";

highchartsMore(Highcharts);

const ZONE_COLORS = [
  "#0088FE", "#00C6FF", "#00C49F", "#FFBB28",
  "#FF8042", "#A28DFF", "#FF6699", "#33CC99",
  "#FF6666", "#66B2FF", "#99FF66", "#FF9933",
];

const MonthChart = ({
  companyName, finYear, finYr, poType,
  companyList, setChartToShow, chartToshow, purchaseTypeOptions,
}) => {
  const theme = useTheme();

  const [showYearTable, setShowYearTable]     = useState(false);
  const [selectedYear, setSelectedYear]       = useState(null);
  const [selectedCompCode, setSelectedCompCode] = useState("");
  const [selectedOrderType, setSelectedOrderType] = useState("");
  const [selectedMonth, setSelectedMonth]     = useState(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
  const [selectedMonthColor, setSelectedMonthColor] = useState("#00C49F");

  // ── NEW: same pattern as TopTenSupplierYear ──────────────────────────────
  const [orderChartData, setOrderChartData] = useState([]); // [{ type, chartData[] }]
  const [selectedType, setSelectedType]     = useState("");

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatINRShort = (value) => {
    const num = Number(value);
    if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(2)} Cr`;
    if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(2)} L`;
    return `₹ ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: monthResponse, isLoading, isFetching } =
    useGetMonthCombinedPurchaseQuery(
      { params: { finYear, companyName } },
      { skip: !finYear || !companyName },
    );

  const { data: monthGeneralResponse } = useGetMonthGeneralPurchaseQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );

  // ── FIX: renamed destructured variable (was clashing with hook name) ─────
  const { data: monthOrderResponse } = useGetMonthPurchaseOrderQuery(
    { params: { finYear, companyName } },
    { skip: !finYear || !companyName },
  );

  // ── Reset on poType change ───────────────────────────────────────────────
  useEffect(() => {
    setShowYearTable(false);
    setSelectedYear(null);
    setSelectedCompCode("");
    setSelectedMonth(null);
    setSelectedMonthIndex(null);
    setOrderChartData([]);
    setSelectedType("");
  }, [poType]);

  // ── Process Order response → grouped by type ─────────────────────────────
  useEffect(() => {
    if (poType === "Order" && monthOrderResponse?.data) {
      // monthOrderResponse.data = [{ type: "GREY YARN", data: [...] }, ...]
      const grouped = monthOrderResponse.data.map((group) => ({
        type: group.type,
        chartData: [...group.data].map((item) => ({
          month: item.month || item.label,
          value: Number(item.VAL ?? item.value ?? 0),
          year: item.yearNo,
          finYear: item.finyear,
          company: item.company,
        })),
      }));
      setOrderChartData(grouped);
    }
  }, [monthOrderResponse, poType]);

  // ── Auto-select first type (mirrors TopTenSupplierYear) ──────────────────
  useEffect(() => {
    if (poType === "Order" && orderChartData.length > 0) {
      setSelectedType(orderChartData[0].type);
    }
  }, [orderChartData, poType]);

  // ── Active chart data: single source of truth ────────────────────────────
  const activeChartData = useMemo(() => {
    if (poType === "Order") {
      const found = orderChartData.find((g) => g.type === selectedType);
      return found?.chartData ?? [];
    }
    const raw = poType === "All" ? monthResponse?.data : monthGeneralResponse?.data;
    return (Array.isArray(raw) ? raw : []).map((i) => ({
      month: i.month || i.label,
      value: Number(i.VAL ?? i.value ?? 0),
      year: i.yearNo,
      finYear: i.finyear,
      company: i.company,
    }));
  }, [poType, orderChartData, selectedType, monthResponse, monthGeneralResponse]);

  // ── Selected month detail (right-side mini chart) ────────────────────────
  const selectedMonthData = useMemo(
    () => selectedMonthIndex !== null ? activeChartData[selectedMonthIndex] : null,
    [selectedMonthIndex, activeChartData],
  );

  // ── Main spline chart options ─────────────────────────────────────────────
  const monthChartOptions = useMemo(() => ({
    chart: { type: "spline", height: 430, backgroundColor: "transparent" },
    title: { text: "" },
    xAxis: {
      categories: activeChartData.map((i) => i.month),
      lineColor: "#ddd", tickColor: "#ddd",
      labels: { style: { fontSize: "12px" } },
    },
    yAxis: {
      title: { text: "" },
      gridLineDashStyle: "Dash",
      labels: {
        formatter() { return formatINRShort(this.value); },
        style: { fontSize: "12px" },
      },
    },
    tooltip: {
      backgroundColor: "#000",
      style: { color: "#fff" },
      borderRadius: 8,
      formatter() {
        const data = activeChartData[this.point.index];
        return `<b>${data.month}</b><br/>${formatINR(this.y)}`;
      },
    },
    plotOptions: {
      spline: {
        lineWidth: 3,
        marker: { enabled: true, radius: 4 },
        states: { hover: { lineWidth: 4 } },
        dataLabels: {
          enabled: true,
          formatter() { return formatINRShort(this.y); },
          style: { fontSize: "12px", fontWeight: "400", color: "#000" },
        },
        point: {
          events: {
            click() {
              setSelectedMonth(this.category);
              setSelectedMonthIndex(this.index);
              setSelectedMonthColor(this.color ?? ZONE_COLORS[this.index % ZONE_COLORS.length]);
            },
          },
        },
      },
    },
    series: [{
      name: "Purchase",
      data: activeChartData.map((i) => i.value),
      zoneAxis: "x",
      zones: ZONE_COLORS.map((color, idx) =>
        idx < ZONE_COLORS.length - 1 ? { value: idx + 1, color } : { color }
      ),
      marker: { enabled: true, radius: 4 },
    }],
    legend: { enabled: false },
    credits: { enabled: false },
  }), [activeChartData]);

  // ── Right-side detail column chart ───────────────────────────────────────
  const childOptions = selectedMonthData ? {
    chart: { type: "column", height: 383, backgroundColor: "transparent" },
    title: { text: "" },
    xAxis: {
      categories: [selectedMonth],
      lineColor: "#ddd",
      labels: { style: { fontSize: "12px" } },
    },
    yAxis: {
      title: { text: "" },
      gridLineDashStyle: "Dash",
      labels: { enabled: false },
    },
    tooltip: {
      backgroundColor: "#000",
      style: { color: "#fff" },
      borderRadius: 8,
      formatter() { return `<b>${this.x}</b><br/>${formatINR(this.y)}`; },
    },
    plotOptions: {
      column: {
        borderRadius: 8,
        pointWidth: 50,
        dataLabels: {
          enabled: true,
          inside: false,
          verticalAlign: "bottom",
          y: -10,
          style: { color: "#000", fontSize: "12px", fontWeight: "600" },
          formatter() { return formatINR(this.y); },
        },
      },
    },
    series: [{
      name: "Purchase",
      data: [Number(selectedMonthData.value)],
      color: {
        linearGradient: [0, 0, 0, 300],
        stops: [
          [0, selectedMonthColor],
          [1, Highcharts.color(selectedMonthColor).brighten(0.2).get()],
        ],
      },
    }],
    legend: { enabled: false },
    credits: { enabled: false },
  } : null;

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Month Wise Purchase"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RadioGroup
              row value={chartToshow}
              onChange={(e) => setChartToShow(e.target.value)}
              sx={{ gap: 1 }}
            >
              {purchaseTypeOptions.map((opt) => (
                <FormControlLabel
                  key={opt.value} value={opt.value}
                  control={<Radio size="small" />}
                  label={opt.label}
                  sx={{ fontSize: "11px" }}
                />
              ))}
            </RadioGroup>

            {/* ── Same select pattern as TopTenSupplierYear ── */}
            {poType === "Order" && orderChartData.length > 0 && (
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  // Reset month selection when type changes
                  setSelectedMonth(null);
                  setSelectedMonthIndex(null);
                }}
                style={{
                  fontSize: "11px",
                  padding: "0px 14px",
                  borderRadius: "6px",
                  border: "2px solid #2563eb",
                  marginTop: "2px",
                  marginLeft: "-12px",
                  minWidth: "120px",
                }}
              >
                {orderChartData.map((g) => (
                  <option key={g.type} value={g.type}>{g.type}</option>
                ))}
              </select>
            )}
          </Box>
        }
      />
      <CardContent
        sx={{
          position: "relative", backgroundColor: "#fff",
          mt: 1, ml: 1, height: 460,
          display: "flex", flexDirection: "column",
        }}
      >
        {(isLoading || isFetching) && <SpinLoader />}

        <Box sx={{ display: "flex", width: "100%", overflow: "hidden" }}>
          {/* ── Main chart (80%) ── */}
          <Box sx={{ width: "80%", transition: "width 0.35s ease" }}>
            {activeChartData.length === 0 && !isLoading ? (
              <Box sx={{ height: 430, display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
                No data
              </Box>
            ) : (
              <HighchartsReact
                key={`month-chart-${selectedType}`} // re-mount on type change
                highcharts={Highcharts}
                options={monthChartOptions}
                immutable
              />
            )}
          </Box>

          {/* ── Detail chart (20%) ── */}
          <Box sx={{ width: "20%", transition: "width 0.35s ease" }}>
            <Card sx={{ height: "100%", ml: 1 }}>
              <Box sx={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", px: 1, py: 0.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}>
                <Box sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                  {selectedMonth || ""} Purchase Details
                </Box>
              </Box>
              <CardContent>
                {selectedMonth && childOptions ? (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={childOptions}
                    immutable
                  />
                ) : (
                  <Box sx={{
                    height: 260, display: "flex", alignItems: "center",
                    justifyContent: "center", color: "text.secondary", fontSize: "0.85rem",
                  }}>
                    Click a month to view details
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {showYearTable && selectedYear && poType !== "All" && (
          <YearWiseTable
            year={selectedYear}
            poType={poType}
            type={selectedOrderType}
            companyList={companyList}
            selectedCompCode={selectedCompCode}
            finYr={finYr}
            closeTable={() => setShowYearTable(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MonthChart;