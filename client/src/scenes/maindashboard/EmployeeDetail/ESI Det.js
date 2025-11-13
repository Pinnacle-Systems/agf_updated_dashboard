// import ReactApexcharts from "react-apexcharts";
// import { useState, useEffect } from "react";
// import {
//   Box,
//   Card,
//   CardHeader,
//   CardContent,
//   Typography,
//   IconButton,
//   Tooltip,
//   CircularProgress,
//   useTheme
// } from "@mui/material";
// import DotsVertical from "mdi-material-ui/DotsVertical";
// import { useGetMisDashboardSalaryDetQuery } from "../../../redux/service/misDashboardService";

// const NewjoiningChart = () => {
//   const theme = useTheme();
//   const { data: Salarydata, isLoading, isError, error } = useGetMisDashboardSalaryDetQuery({ params: {} });
//   const [series, setSeries] = useState([]);
//   const [labels, setLabels] = useState([]);
//   console.log(Salarydata,"Salarydata");

//   useEffect(() => {
//     if (Salarydata && Salarydata.success && Salarydata.data) {
//       // ✅ Group NETPAY by COMPCODE
//       const totalsByComp = {};
//       Salarydata.data.forEach((item) => {
//         const comp = item.COMPCODE || "Unknown";
//         totalsByComp[comp] = (totalsByComp[comp] || 0) + item.NETPAY;
//       });

//       setLabels(Object.keys(totalsByComp));
//       setSeries(Object.values(totalsByComp));
//     }
//   }, [Salarydata]);

//   const chartOptions = {
//     chart: {
//       type: "pie",
//       toolbar: { show: false },
//       animations: { enabled: true, easing: "easeinout", speed: 800 },
//     },
//     labels,
//     legend: {
//       position: "bottom",
//       horizontalAlign: "center",
//       markers: { width: 12, height: 12, radius: 6 },
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: (val) => `${val.toFixed(1)}%`,
//     },
//     colors: [
//       theme.palette.primary.main,
//       theme.palette.secondary.main,
//       theme.palette.success.main,
//       theme.palette.warning.main,
//       theme.palette.error.main,
//     ],
//   };

//   if (isLoading)
//     return (
//       <Card sx={{ p: 6, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
//         <CircularProgress />
//       </Card>
//     );

//   if (isError)
//     return (
//       <Typography color="error" variant="h6">
//         Error: {error?.message || "Failed to load data"}
//       </Typography>
//     );

//   return (
//     <Card sx={{ borderRadius: 3, boxShadow: 4, p: 2 }}>
//       <CardHeader
//         title="Salary Distribution Company Code"
//         sx={{
//           borderBottom:'2px solid #ccc',
//           borderBlockStyle:"solid",
//           // background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//           color: "#fff",
//         }}
//         action={
//           <Tooltip title="Options">
//             <IconButton sx={{ color: "#fff" }}>
//               <DotsVertical />
//             </IconButton>
//           </Tooltip>
//         }
//       />

//       <CardContent>
//         <Box sx={{ height: 400 }}>
//           <ReactApexcharts type="pie" height="100%" options={chartOptions} series={series} />
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default NewjoiningChart;
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
// import { useGetPfDetQuery } from "../../redux/service/misDashboardService";
import {
  useGetMisDashboardEsiDetQuery,
  useGetMisDashboardPfDetQuery,
} from "../../../redux/service/misDashboardService";
import DotsVertical from "mdi-material-ui/DotsVertical";
import { useTheme } from "@emotion/react";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { theme } from "highcharts";
import { Box } from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A020F0",
  "#FF4560",
  "#A020F5",
  "#FF8046",
];

const NewjoiningChart = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetMisDashboardEsiDetQuery({
    params: {}, // or pass filterBuyer/search if needed
  });

  console.log(data,"ESI Hole Data");
  
  const chartData = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];
    const compMap = {};

    data.data.forEach((emp) => {
      const code = emp.COMPCODE || "UNKNOWN";
      const pf = Number(emp.NETPAY) || 0;
      if (!compMap[code]) compMap[code] = 0;
      compMap[code] += pf;
    });

    return Object.entries(compMap).map(([key, value]) => ({
      name: key,
      value,
    }));
  }, [data]);

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error loading PF data</div>;
  if (!chartData.length) return <div>No PF data found for last month</div>;

  return (
    <Card sx={{}}>
      <CardHeader
        title="ESI Contribution"
        titleTypographyProps={{
          sx: {
            lineHeight: "1.2 !important",
            letterSpacing: "0.31px !important",
            fontSize: "16px",
            p: 1,
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="settings"
            sx={{ color: "text.secondary" }}
          >
            <DotsVertical />
          </IconButton>
        }
        sx={{
          borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
          pb: 0,
        }}
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              // label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ cursor: 'pointer' }} 
                  onClick={() => {
                    dispatch(
                      push({
                        id: `EmployeeDetail`,
                        name: `EmployeeDetail`,
                        component: "DetailedDashBoard", //
                        data: { companyName: entry.name },
                      })
                    );                 
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                fontSize: "11px",
                fontWeight: 500,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 1,
            py: 1,
            borderRadius: 3,
            background: `linear-gradient(200deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            fontSize: ".75rem",
            fontWeight: 600,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 4,
            },
          }}
        >
          View Detailed Report
        </Button> */}
        <Box>
          <Typography>
            
            Total ESI cosdt
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewjoiningChart;
