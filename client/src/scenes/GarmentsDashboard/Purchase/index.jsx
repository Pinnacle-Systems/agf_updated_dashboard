// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import {
//   Card,
//   Typography,
//   useTheme,
//   CircularProgress,
//   CardContent,
//   CardHeader,
//   Box,
// } from "@mui/material";
// import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
// import {
//   useGetPurchaseQuery,
//   useGetPurchaseOrderQuery,
// } from "../../../redux/service/purchaseService";
// import { useGetsallastmonthQuery } from "../../../redux/service/misDashboardService";
// import { useMemo, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { push } from "../../../redux/features/opentabs";
// import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
// import {
//   setFilterBuyer,
//   setPoType,
// } from "../../../redux/features/dashboardFiltersSlice";

// const PurchaseIndex = ({
//   filterBuyer,
//   selectedYear,
//   selectMonths,
//   finYr,
//   user,
//   filterBuyerList,
//   onMonthChange,
// }) => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const poType = useSelector((state) => state.dashboardFilters.poType);
//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   /* ---------------- YEAR HANDLING ---------------- */
//   const filterYear = useMemo(() => {
//     if (!selectedYear) return "";
//     return typeof selectedYear === "object"
//       ? selectedYear.finYr || selectedYear.name
//       : selectedYear;
//   }, [selectedYear]);

//   const previousYear = useMemo(() => {
//     if (!filterYear) return "";
//     const [start, end] = filterYear.split("-").map(Number);
//     return `${String(start - 1).padStart(2, "0")}-${String(end - 1).padStart(
//       2,
//       "0",
//     )}`;
//   }, [filterYear]);

//   const purchaseQuery = useGetPurchaseQuery(
//     { params: { filterYear, previousYear } },
//     { skip: !filterYear || poType !== "General" }, // skip if not General
//   );

//   const purchaseOrderQuery = useGetPurchaseOrderQuery(
//     { params: { filterYear, previousYear } },
//     { skip: !filterYear || poType !== "Order" }, // skip if not Order
//   );

//   // pick data from the active PO type
//   const turnOverData =
//     poType === "General" ? purchaseQuery.data : purchaseOrderQuery.data;
//   const isLoading =
//     poType === "General"
//       ? purchaseQuery.isLoading
//       : purchaseOrderQuery.isLoading;
//   const isError =
//     poType === "General" ? purchaseQuery.isError : purchaseOrderQuery.isError;
//   const error =
//     poType === "General" ? purchaseQuery.error : purchaseOrderQuery.error;

//   const { data: lastmonth } = useGetsallastmonthQuery();
//   const Year = lastmonth?.data?.find((x) => x.Year);

//   /* ---------------- MONTH AUTO SET ---------------- */
//   useEffect(() => {
//     if (Year?.month && !selectMonths) {
//       onMonthChange(Year.month);
//     }
//   }, [Year, selectMonths, onMonthChange]);

//   if (isLoading) {
//     return (
//       <Card sx={{ p: 4, textAlign: "center" }}>
//         <CircularProgress />
//       </Card>
//     );
//   }

//   if (isError) {
//     return (
//       <Typography color="error" sx={{ p: 2 }}>
//         Error: {error?.message || "Failed to load data"}
//       </Typography>
//     );
//   }
//   const formatShortINR = (value) => {
//     const num = Number(value);

//     if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(1)} Cr`; // Crore
//     if (num >= 100000) return `₹ ${(num / 100000).toFixed(1)} L`; // Lakh
//     if (num >= 1000) return `₹ ${(num / 1000).toFixed(1)} K`; // Thousand

//     return formatINR(num);
//   };
//   const companies = turnOverData?.data?.map((x) => x.COMPCODE) ?? [];

//   const companypurchaseValue = turnOverData?.data?.map((x) => x.VAL) ?? [];

//   const overallTurnover = companypurchaseValue.reduce(
//     (sum, val) => sum + val,
//     0,
//   );

//   /* ---------------- CHART ---------------- */
//   const options = {
//     chart: { type: "column", height: 250 },

//     title: { text: null },

//     xAxis: {
//       categories: companies,
//       crosshair: true,
//       labels: {
//         style: { fontSize: "13px" },
//       },
//     },

//     yAxis: {
//       min: 0,
//       title: { text: "Purchase Value" },
//       // labels: {
//       //   formatter() {
//       //     return `₹ ${this.value.toFixed(2)}`;
//       //   },
//       // },
//     },

//     tooltip: {
//       shared: true,
//       useHTML: true,
//       formatter() {
//         return `<b>${this.x}</b><br/>Purchase: ${formatINR(this.y)}`;
//       },
//     },

//     plotOptions: {
//       column: {
//         borderRadius: 5,
//         pointPadding: 0.2,
//         groupPadding: 0.1,
//         minPointLength: 20,
//         cursor: "pointer",
//         dataLabels: {
//           enabled: true,
//           formatter() {
//             return formatShortINR(this.y); // 👈 short format
//           },
//           style: {
//             fontSize: "9px",
//           },
//         },
//         point: {
//           events: {
//             click: function () {
//               const companyName = companies[this.index];

//               dispatch(setFilterBuyer(companyName));

//               dispatch(
//                 push({
//                   id: `Purchase`,
//                   name: "Purchase",
//                   component: "PurchaseHome",
//                   data: {
//                     companyName,
//                     selectedYear,
//                     filterBuyer,
//                     user,
//                     selectMonths,
//                     filterBuyerList,
//                     finYr,
//                     poType,
//                   },
//                 }),
//               );
//             },
//           },
//         },
//       },
//     },
//     series: [
//       {
//         name: "Purchase",
//         data: companypurchaseValue,
//         colorByPoint: true,
//       },
//     ],
//     legend: {
//       enabled: false, // 👈 FIX: removes clickable "Purchase"
//     },

//     credits: { enabled: false },
//   };
//   console.log(poType, "poType");

//   return (
//     <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
//       <CardHeader
//         title="Purchase"
//         titleTypographyProps={{
//           sx: { fontSize: "1rem", fontWeight: 600 },
//         }}
//         // action={
//         //   <Box
//         //     sx={{
//         //       display: "flex",
//         //       alignItems: "center",
//         //       gap: 1,
//         //       minWidth: 180,
//         //     }}
//         //   >
//         //     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//         //       PO Type :
//         //     </Typography>
//         //     <RadioGroup
//         //       row
//         //       value={poType || ""}
//         //       onChange={(e) => dispatch(setPoType(e.target.value))}
//         //       sx={{
//         //         "& .MuiFormControlLabel-root": {
//         //           mr: 1,
//         //           mt: 0,
//         //           mb: 0,
//         //         },
//         //         "& .MuiRadio-root": {
//         //           transform: "scale(0.85)", // smaller circles
//         //           padding: 0, // reduce default padding
//         //         },
//         //       }}
//         //     >
//         //       <FormControlLabel
//         //         value="Order"
//         //         control={<Radio size="small" />}
//         //         label="Order"
//         //         sx={{ m: 0 }}
//         //       />
//         //       <FormControlLabel
//         //         value="General"
//         //         control={<Radio size="small" />}
//         //         label="General"
//         //         sx={{ m: 0 }}
//         //       />
//         //     </RadioGroup>
//         //   </Box>
//         // }
//         sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
//       />
//       <CardContent>
//         {isLoading ? (
//           <div style={{ textAlign: "center", padding: "40px", height: 250 }}>
//             Loading...
//           </div>
//         ) : (
//           <>
//             <HighchartsReact highcharts={Highcharts} options={options} />
//             <Box
//               sx={{
//                 bgcolor: "background.default",
//                 borderRadius: 3,
//                 textAlign: "center",
//                 border: `1px solid ${theme.palette.divider}`,
//                 // mt: 2,
//                 p: 1,
//               }}
//             >
//               <Typography variant="h6" fontWeight={600}>
//                 Overall Purchase: {formatINR(overallTurnover)}
//               </Typography>
//             </Box>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default PurchaseIndex;

import React, { useMemo, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { useGetsallastmonthQuery } from "../../../redux/service/misDashboardService";
import { useGetCombinedPurchaseOrderQuery } from "../../../redux/service/purchaseService";
import { setFilterBuyer } from "../../../redux/features/dashboardFiltersSlice";

const PurchaseIndex = ({
  filterBuyer,
  selectedYear,
  selectMonths,
  finYr,
  user,
  filterBuyerList,
  onMonthChange,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const poType = useSelector((state) => state.dashboardFilters.poType);

  /* ---------------- YEAR HANDLING ---------------- */
  const filterYear = useMemo(() => {
    if (!selectedYear) return "";
    return typeof selectedYear === "object"
      ? selectedYear.finYr || selectedYear.name
      : selectedYear;
  }, [selectedYear]);

  const previousYear = useMemo(() => {
    if (!filterYear) return "";
    const [start, end] = filterYear.split("-").map(Number);
    return `${String(start - 1).padStart(2, "0")}-${String(end - 1).padStart(2, "0")}`;
  }, [filterYear]);

  /* ---------------- FETCH DATA ---------------- */
  const {
    data: response,
    isLoading,
    isError,
  } = useGetCombinedPurchaseOrderQuery(
    { params: { filterYear } },
    { skip: !filterYear },
  );

  const responseData = response?.data ?? [];

  /* ---------------- LAST MONTH AUTO SET ---------------- */
  const { data: lastmonth } = useGetsallastmonthQuery();
  const Year = lastmonth?.data?.find((x) => x.Year);

  useEffect(() => {
    if (Year?.month && !selectMonths) {
      onMonthChange(Year.month);
    }
  }, [Year, selectMonths, onMonthChange]);

  /* ---------------- HELPER FUNCTIONS ---------------- */
  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatShortINR = (value) => {
    const num = Number(value);
    if (num >= 1e7) return `₹ ${(num / 1e7).toFixed(1)} Cr`;
    if (num >= 1e5) return `₹ ${(num / 1e5).toFixed(1)} L`;
    if (num >= 1e3) return `₹ ${(num / 1e3).toFixed(1)} K`;
    return formatINR(num);
  };

  /* ---------------- PREPARE CHART DATA ---------------- */
  const chartData = useMemo(() => {
    return [...responseData].sort((a, b) =>
      a.COMPCODE.localeCompare(b.COMPCODE),
    );
  }, [responseData]);

  const companies = chartData.map((x) => x.COMPCODE);
  const companypurchaseValue = chartData.map((x) => x.VAL);
  const overallTurnover = companypurchaseValue.reduce(
    (sum, val) => sum + val,
    0,
  );

  /* ---------------- HIGHCHARTS OPTIONS ---------------- */
  const options = {
    chart: { type: "column", height: 233 },
    title: { text: null },
    xAxis: {
      categories: companies,
      crosshair: true,
      labels: { style: { fontSize: "13px" } },
    },
    yAxis: { min: 0, title: { text: "Purchase Value" } },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter() {
        const val = Number(this.y);
        let formatted;
        if (val >= 1e7) formatted = `₹ ${(val / 1e7).toFixed(1)} Cr`;
        else if (val >= 1e5) formatted = `₹ ${(val / 1e5).toFixed(1)} L`;
        else if (val >= 1e3) formatted = `₹ ${(val / 1e3).toFixed(1)} K`;
        else
          formatted = `₹ ${val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
        return `<b>${this.x}</b><br/>Purchase: ${formatted}`;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 5,
        pointPadding: 0.2,
        groupPadding: 0.1,
        minPointLength: 20,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() {
            return formatShortINR(this.y);
          },
          style: { fontSize: "9px" },
        },
        point: {
          events: {
            click() {
              const companyName = chartData[this.index]?.COMPCODE;
              dispatch(setFilterBuyer(companyName));
              dispatch(
                push({
                  id: `Purchase`,
                  name: "Purchase",
                  component: "PurchaseHome",
                  data: {
                    companyName,
                    selectedYear,
                    filterBuyer,
                    user,
                    selectMonths,
                    filterBuyerList,
                    finYr,
                    poType,
                  },
                }),
              );
            },
          },
        },
      },
    },
    series: [
      { name: "Purchase", data: companypurchaseValue, colorByPoint: true },
    ],
    legend: { enabled: false },
    credits: { enabled: false },
  };

  /* ---------------- RENDER ---------------- */
  if (isLoading) {
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error: Failed to load data
      </Typography>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Purchase"
        titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
        sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
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
            mt: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Overall Purchase: {formatINR(overallTurnover)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PurchaseIndex;
