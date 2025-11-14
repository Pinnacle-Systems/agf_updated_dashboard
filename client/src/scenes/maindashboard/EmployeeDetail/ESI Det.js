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
import Highcharts from "highcharts";
// import { useGetPfDetQuery } from "../../redux/service/misDashboardService";
import {
  useGetEsilastmonthQuery,
  useGetMisDashboardEsiDetQuery,
  useGetMisDashboardPfDetQuery,
} from "../../../redux/service/misDashboardService";
import DotsVertical from "mdi-material-ui/DotsVertical";
import { useTheme } from "@emotion/react";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { theme } from "highcharts";
import { Box } from "lucide-react";
import HighchartsReact from "highcharts-react-official";

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

const HomeESI = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetMisDashboardEsiDetQuery({
    params: {}, // or pass filterBuyer/search if needed
  });

  const {data:ESIdata}=useGetEsilastmonthQuery()
  console.log(ESIdata,"ESIdata");
  

  // console.log(data,"ESI Hole Data");
  

  const chartData1 =ESIdata?.data.map((item)=>item.customer)
  const chartvalue =ESIdata?.data.map((item)=>item.esi)
  const chartcount =ESIdata?.data.map((item)=>item.headCount)
  const month =ESIdata?.data.find((item)=>item.month)
  console.log(month);
  const colors = chartData1?.map(() =>
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  );
  
  const formattedData = chartData1?.map((name, i) => ({
    name,
    y: chartvalue[i],
    color: colors[i],
    headCount: chartcount[i],
    
  }));
  
  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false
    },        
    title: {
      text: `ESI<br>shares of<br>${month?.month}`,
      align: 'center',
      verticalAlign: 'middle',
      y: -20,
      style: {
        fontSize: '1.1em'
      }
    },
    tooltip: {
      formatter: function () {
    return `
      <b>${this.point.name}</b><br/>
      ESI Share: <b>${this.point.percentage.toFixed(1)}%</b><br/>
      Amount: <b>${this.point.y}</b><br/>
      Head Count: <b>${this.point.headCount}</b>
    `;
  },
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: 'bold',
            color: 'white'
          }
        },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '50%'],
        size: '110%',
        point: {
                        events: {
                            click: function () {
                                const companyName = this.category;
                                console.log("Clicked:", companyName);
        
                                dispatch(
                                  push({
                                    id: "EmployeeDetail",
                                    name: "EmployeeDetail",
                                    component: "DetailedDashBoard",
                                    data: { companyName },
                                  }) 
                                );
                            }
                        }
                    }
      },
      

    },
    
    series: [
      {
        type: "pie",
        name: "ESI share",
        innerSize: "50%",
        data: formattedData
      }
    ]
  };

  
  console.log(chartvalue,chartData1,chartcount,"New ESi data");
  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error loading PF data</div>;
  if (!chartData1.length) return <div>No PF data found for last month</div>;

  return (
    <Card sx={{}}>
      <CardHeader
        title="ESI Contribution"
        titleTypographyProps={{
          sx: {
            lineHeight: "1.2 !important",
            letterSpacing: "0.31px !important",
            fontSize: "15px",
            fontWeight:600,
           
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
        // sx={{
        //   borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
        //   pb: 1,
        // }}
      />
      <CardContent>
        
                <div style={{ height: "280px" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
        {/* <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 1,
            py: 1,
            borderRadius: 3,
            // background: `linear-gradient(200deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
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
        
             </CardContent>
    </Card>
  );
};

export default HomeESI;
