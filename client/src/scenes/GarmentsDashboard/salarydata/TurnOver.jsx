// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import {
//   Card,
//   Typography,
//   useTheme,
//   CircularProgress,
//   CardContent,
//   CardHeader,
//   Box
// } from "@mui/material";
// import { useGetMisDashboardQuery } from "../../../redux/service/misDashboardServiceERP";
// import { useGetsallastmonthQuery } from "../../../redux/service/misDashboardService";
// import { useMemo, useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { push } from "../../../redux/features/opentabs";

// const TurnOver = ({ selectedYear, filterBuyer, setFilterBuyer, setSelectedYear, user, selectMonths, setSelectMonths, filterBuyerList, finYr }) => {
//   const theme = useTheme();
//   const [selectedmonth, setSelectedmonth] = useState("")
//   const dispatch = useDispatch();

//   /* ---------------- YEAR HANDLING ---------------- */
//   const filterYear = useMemo(() => {
//     if (!selectedYear) return "";
//     return typeof selectedYear === "object"
//       ? selectedYear.name
//       : selectedYear;
//   }, [selectedYear]);

//   const previousYear = useMemo(() => {
//     if (!filterYear) return "";

//     const [start, end] = filterYear.split("-").map(Number);

//     // Handles 09-10, 99-00 safely
//     const prevStart = (start - 1 + 100) % 100;
//     const prevEnd = (end - 1 + 100) % 100;

//     return `${prevStart.toString().padStart(2, "0")}-${prevEnd
//       .toString()
//       .padStart(2, "0")}`;
//   }, [filterYear]);

//   /* ---------------- API ---------------- */
//   const {
//     data: turnOverData,
//     isLoading,
//     isError,
//     error,
//   } = useGetMisDashboardQuery(
//     { params: { filterYear, previousYear } },
//     { skip: !filterYear }
//   );
//   const { data: lastmonth } = useGetsallastmonthQuery()
//   const Year = lastmonth?.data.find((x) => x.Year)
//   const company =
//     lastmonth?.data?.map((x) => x.customer) ?? [];
//   useEffect(() => {
//     setSelectedmonth(Year?.month)
//   }, [Year])


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

//   const companies =
//     turnOverData?.data?.totalTurnOver?.map(x => x.company) ?? [];

//   const companyTurnover =
//     turnOverData?.data?.totalTurnOver?.map(x => x.currentValue) ?? [];
//   const overallTurnover = companyTurnover.reduce(
//     (sum, val) => sum + val,
//     0
//   );

//   /* ---------------- DATA ---------------- */
//   const totalTurnOverValue =
//     turnOverData?.data?.totalTurnOver?.currentValue ?? 0;

//   /* ---------------- CHART ---------------- */
//   const options = {
//     chart: {
//       type: "area",
//       height: 250,
//     },

//     title: { text: null },

//     xAxis: {
//       categories: companies,
//       title: { text: "Company" },
//       labels: { style: { fontSize: "11px" } },
//     },


//     yAxis: {
//       title: { text: "Turnover Value" },
//       labels: {
//         formatter() {
//           return this.value.toLocaleString("en-IN");
//         },
//       },
//     },

//     tooltip: {
//       useHTML: true,
//       formatter: function () {
//         return `
//         <b>${this.key}</b><br/>
//         <b>${this.y.toLocaleString("en-IN")}</b>
//       `;
//       },
//     },

//     plotOptions: {
//       series: {
//         cursor: "pointer",
//         point: {
//           events: {
//             click: function () {
//               const companyCode = this.category; // xAxis value

//               dispatch(
//                 push({
//                   id: `TurnOver-${companyCode}`,
//                   name: `TurnOver`,
//                   component: "TurnOverIndex",
//                   data: {
//                     companyCode: companyCode,
//                     finYear: filterYear, // ✅ "25-26"
//                     selectedYear,
//                     filterBuyer,
//                     user,
//                     selectMonths,
//                     filterBuyerList,
//                     finYr,


//                   },
//                 })
//               );
//             },
//           },
//         },
//         dataLabels: {
//           enabled: true,
//           formatter() {
//             return this.y.toLocaleString("en-IN");
//           },
//         },
//       },
//     },

//     series: [
//       {
//         name: "Company Turnover",
//         data: companyTurnover,
//         color: "#1976d2",
//         point: {
//           events: {
//             click: function () {
//               const company = this.category;
//               dispatch(
//                 push({
//                   id: `TurnOver`,
//                   name: `TurnOver`,
//                   component: "TurnOverIndex",
//                   data: {
//                     companyName: company,
//                     finYear: filterYear,
//                     selectedYear,
//                     filterBuyer,
//                     user,
//                     selectMonths,
//                     filterBuyerList,
//                     finYr,

//                   },
//                 })
//               );
//             },
//           },
//         },
//       },

//     ],

//   };

//   /* ---------------- RENDER ---------------- */
//   return (
//     <Card
//       sx={{
//         borderRadius: 3,
//         boxShadow: 4,
//         width: "100%",
//         ml: 1,
//       }}
//     >
//       <CardHeader
//         title="Turn Over"
//         titleTypographyProps={{
//           sx: { fontSize: "1rem", fontWeight: 600 },
//         }}
//         sx={{
//           borderBottom: `2px solid ${theme.palette.divider}`,
//         }}
//       />

//       <CardContent sx={{ pb: 0 }}>
//         <HighchartsReact highcharts={Highcharts} options={options} />
//         <Box
//           sx={{
//             // m: 1,
//             p: 1,
//             // mb: 2,
//             bgcolor: "background.default",
//             borderRadius: 3,
//             textAlign: "center",
//             border: `1px solid ${theme.palette.divider}`,
//           }}
//         >
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Overall Turnover : {overallTurnover.toLocaleString("en-IN")}
//           </Typography>

//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// // export default TurnOver;
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
// import { useGetMisDashboardQuery } from "../../../redux/service/misDashboardServiceERP";
// import { useGetsallastmonthQuery } from "../../../redux/service/misDashboardService";
// import { useMemo, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { push } from "../../../redux/features/opentabs";
// import { setSelectedYear, setFilterBuyer, setSelectMonths } from "../../../redux/features/dashboardFiltersSlice";

// const TurnOver = ({ filterBuyerList, finYr, user }) => {
//   const theme = useTheme();
//   const dispatch = useDispatch();

//   // Redux state
//   const { selectedYear, filterBuyer, selectMonths } = useSelector(
//     (state) => state.dashboardFilters
//   );

//   // Local state
//   const [selectedmonth, setSelectedmonth] = useState("");

//   /* ---------------- YEAR HANDLING ---------------- */
//   const filterYear = useMemo(() => {
//     if (!selectedYear) return "";
//     return typeof selectedYear === "object" ? selectedYear.name : selectedYear;
//   }, [selectedYear]);

//   const previousYear = useMemo(() => {
//     if (!filterYear) return "";

//     const [start, end] = filterYear.split("-").map(Number);
//     const prevStart = (start - 1 + 100) % 100;
//     const prevEnd = (end - 1 + 100) % 100;

//     return `${prevStart.toString().padStart(2, "0")}-${prevEnd
//       .toString()
//       .padStart(2, "0")}`;
//   }, [filterYear]);

//   /* ---------------- API ---------------- */
//   const { data: turnOverData, isLoading, isError, error } = useGetMisDashboardQuery(
//     { params: { filterYear, previousYear } },
//     { skip: !filterYear }
//   );
//   const { data: lastmonth } = useGetsallastmonthQuery();
//   const Year = lastmonth?.data?.find((x) => x.Year);
//   const company = lastmonth?.data?.map((x) => x.customer) ?? [];

//   useEffect(() => {
//     setSelectedmonth(Year?.month);
//     if (Year?.month) {
//       dispatch(setSelectMonths(Year.month));
//     }
//   }, [Year, dispatch]);

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

//   const companies = turnOverData?.data?.totalTurnOver?.map((x) => x.company) ?? [];
//   const companyTurnover = turnOverData?.data?.totalTurnOver?.map((x) => x.currentValue) ?? [];
//   const overallTurnover = companyTurnover.reduce((sum, val) => sum + val, 0);

//   /* ---------------- CHART ---------------- */
//   const options = {
//     chart: { type: "area", height: 250 },
//     title: { text: null },
//     xAxis: {
//       categories: companies,
//       title: { text: "Company" },
//       labels: { style: { fontSize: "11px" } },
//     },
//     yAxis: {
//       title: { text: "Turnover Value" },
//       labels: { formatter() { return this.value.toLocaleString("en-IN"); } },
//     },
//     tooltip: {
//       useHTML: true,
//       formatter: function () {
//         return `<b>${this.key}</b><br/><b>${this.y.toLocaleString("en-IN")}</b>`;
//       },
//     },
//     plotOptions: {
//       series: {
//         cursor: "pointer",
//         point: {
//           events: {
//             click: function () {
//               const companyName = options.xAxis.categories[this.index]; // reliable
//               dispatch(
//                 push({
//                   id: `TurnOver-${companyName}`,
//                   name: `TurnOver`,
//                   component: "TurnOverIndex",
//                   data: {
//                     companyName, // correct company
//                     finYear: filterYear,
//                     selectedYear,
//                     filterBuyer,
//                     user,
//                     selectMonths,
//                     filterBuyerList,
//                     finYr,
//                   },
//                 })
//               );
//             },
//           },
//         },

//         dataLabels: {
//           enabled: true,
//           formatter() {
//             return this.y.toLocaleString("en-IN");
//           },
//         },
//       },
//     },
//     series: [
//       {
//         name: "Company Turnover",
//         data: companyTurnover,
//         color: "#1976d2",
//       },
//     ],
//   };

//   /* ---------------- RENDER ---------------- */
//   return (
//     <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
//       <CardHeader
//         title="Turn Over"
//         titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
//         sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
//       />
//       <CardContent sx={{ pb: 0 }}>
//         <HighchartsReact highcharts={Highcharts} options={options} />
//         <Box
//           sx={{
//             p: 1,
//             bgcolor: "background.default",
//             borderRadius: 3,
//             textAlign: "center",
//             border: `1px solid ${theme.palette.divider}`,
//           }}
//         >
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Overall Turnover: {overallTurnover.toLocaleString("en-IN")}
//           </Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default TurnOver;
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  Typography,
  useTheme,
  CircularProgress,
  CardContent,
  CardHeader,
  Box,
} from "@mui/material";
import { useGetMisDashboardQuery } from "../../../redux/service/misDashboardServiceERP";
import { useGetsallastmonthQuery } from "../../../redux/service/misDashboardService";
import { useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";

const TurnOver = ({
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
    return `${String(start - 1).padStart(2, "0")}-${String(end - 1).padStart(
      2,
      "0"
    )}`;
  }, [filterYear]);

  /* ---------------- API ---------------- */
  const { data: turnOverData, isLoading, isError, error } =
    useGetMisDashboardQuery(
      { params: { filterYear, previousYear } },
      { skip: !filterYear }
    );

  const { data: lastmonth } = useGetsallastmonthQuery();
  const Year = lastmonth?.data?.find((x) => x.Year);

  /* ---------------- MONTH AUTO SET ---------------- */
  useEffect(() => {
    if (Year?.month && !selectMonths) {
      onMonthChange(Year.month);
    }
  }, [Year, selectMonths, onMonthChange]);

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
        Error: {error?.message || "Failed to load data"}
      </Typography>
    );
  }

  const companies =
    turnOverData?.data?.totalTurnOver?.map((x) => x.company) ?? [];
  const companyTurnover =
    turnOverData?.data?.totalTurnOver?.map((x) => x.currentValue) ?? [];

  const overallTurnover = companyTurnover.reduce(
    (sum, val) => sum + val,
    0
  );

  /* ---------------- CHART ---------------- */
  const options = {
    chart: { type: "area", height: 250 },
    title: { text: null },
    xAxis: { categories: companies },
    yAxis: {
      title: { text: "Turnover Value" },
      labels: {
        formatter() {
          return this.value.toLocaleString("en-IN");
        },
      },
    },
    plotOptions: {
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              const companyName = companies[this.index];
              dispatch(
                push({
                  // id: `TurnOver-${companyName}`,
                  id: `TurnOver`,
                  name: "TurnOver",
                  component: "TurnOverIndex",
                  data: {
                    companyName,
                    selectedYear,
                    filterBuyer,
                    user,
                    selectMonths,
                    filterBuyerList,
                    finYr,
                  },
                })
              );
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter() {
            return this.y.toLocaleString("en-IN");
          },
        },
      },
    },
    series: [
      {
        name: "Company Turnover",
        data: companyTurnover,
        color: "#1976d2",
      },
    ],
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Turn Over"
        titleTypographyProps={{
          sx: { fontSize: "1rem", fontWeight: 600, },
        }}
        sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Overall Turnover: {overallTurnover.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TurnOver;
