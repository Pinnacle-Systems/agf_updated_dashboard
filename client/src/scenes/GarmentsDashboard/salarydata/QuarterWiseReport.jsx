// import React, { useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import Highcharts3D from "highcharts/highcharts-3d";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   useTheme,
// } from "@mui/material";
// import { useGetMisDashboardErpQuarterWiseQuery } from "../../../redux/service/misDashboardServiceERP";
// import QuarterWiseTable from "./TableData/QuarterWiseTable";

// // Initialize Highcharts 3D module
// Highcharts3D(Highcharts);

// const COLORS = ["#4F46E5", "#22C55E", "#F97316", "#EF4444"];

// const Form = ({ companyName, finYear, finYr, filterBuyerList }) => {
//   const theme = useTheme();
//   const [showTable, setShowTable] = useState(false);
//   const [selectedQuarter, setSelectedQuarter] = useState(null);

//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   const { data: response, isLoading } =
//     useGetMisDashboardErpQuarterWiseQuery({
//       params: { finYear, companyName },
//     });

//   const chartData = Array.isArray(response?.data) ? response.data : [];

//   // Build pie chart data: each month as a slice
//   const pieData = chartData.map((item) => ({
//     name: `${item.quarter} - ${item.monthName.trim()}`,
//     y: Number(item.value) || 0,
//     quarter: item.quarter,
//     color: COLORS[(Number(item.quarter.replace("Q", "")) - 1) % COLORS.length],
//   }));
//   const quarterLegend = Array.from(
//     new Set(chartData.map((item) => item.quarter))
//   ).map((q) => ({
//     quarter: q,
//     color: COLORS[(Number(q.replace("Q", "")) - 1) % COLORS.length],
//   }));

//   const options = {
//     chart: {
//       type: "pie",
//       options3d: {
//         enabled: true,
//         alpha: 45,
//         beta: 0,
//       },
//       height: 380,
//     },

//     title: { text: "" },

//     tooltip: {
//       pointFormatter() {
//         return `<b>${this.name}</b>: ${formatINR(this.y)}`;
//       },
//     },
//     legend: {
//       enabled: true,             // ✅ show legend
//       align: "center",           // center horizontally
//       verticalAlign: "bottom",   // place at bottom of chart
//       layout: "horizontal",      // horizontal legend
//       itemStyle: {
//         fontWeight: "normal",
//         fontSize: "12px",
//       },
//       symbolHeight: 12,           // size of color box
//       symbolWidth: 12,
//       symbolRadius: 2,            // rounded corners
//     },

//     plotOptions: {
//       pie: {
//         allowPointSelect: true,
//         cursor: "pointer",
//         depth: 45,
//         dataLabels: {
//           enabled: true,
//           useHTML: true, // 👈 important for rupee symbol
//           formatter() {
//             return `<span>${this.point.name}: ${formatINR(this.point.y)}</span>`;
//           },
//           style: {
//             color: "#000",
//             textOutline: "none",
//             fontSize: "11px",
//           },
//         },
//          showInLegend: true, 
//         point: {
//           events: {
//             click() {
//               // Show table for quarter
//               setSelectedQuarter({ quarter: this.quarter });
//               setShowTable(true);
//             },
//           },
//         },
//       },
//     },

//     series: [
//       {
//         name: "Turnover",
//         data: pieData,
//       },
//     ],

//     credits: { enabled: false },
//   };

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title="Quarter Wise TurnOver"
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
//       />

//       <CardContent>
//         {isLoading ? (
//           <div style={{ textAlign: "center", padding: "40px" }}>
//             Loading...
//           </div>
//         ) : (
//           <>
//             <HighchartsReact highcharts={Highcharts} options={options} />
        

//           </>
//         )}
//       </CardContent>

//       {showTable && selectedQuarter && (
//         <QuarterWiseTable
//           quarter={selectedQuarter.quarter}
//           filterBuyerList={filterBuyerList}
//           finYr={finYr}
//           closeTable={() => setShowTable(false)}
//         />
//       )}
//     </Card>
//   );
// };

// export default Form;

import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3D from "highcharts/highcharts-3d";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
} from "@mui/material";
import { useGetMisDashboardErpQuarterWiseQuery } from "../../../redux/service/misDashboardServiceERP";
import QuarterWiseTable from "./TableData/QuarterWiseTable";

// Initialize Highcharts 3D module
Highcharts3D(Highcharts);

const COLORS = ["#4F46E5", "#22C55E", "#F97316", "#EF4444"];

const Form = ({ companyName, finYear, finYr, filterBuyerList }) => {
  const theme = useTheme();
  const [showTable, setShowTable] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const { data: response, isLoading } =
    useGetMisDashboardErpQuarterWiseQuery({
      params: { finYear, companyName },
    });

  const chartData = Array.isArray(response?.data) ? response.data : [];

  // Aggregate data by quarter
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const pieData = quarters.map((q, index) => {
    const quarterItems = chartData.filter((item) => item.quarter === q);
    const quarterValue = quarterItems.reduce(
      (sum, item) => sum + Number(item.value || 0),
      0
    );

    // Month names only
    const monthLabels = quarterItems.map((item) => item.monthName.trim()).join("<br/>");

    return {
      name: q,
      y: quarterValue,
      color: COLORS[index % COLORS.length],
      monthLabels,
      quarter: q, // for click event
    };
  });

  const options = {
    chart: {
      type: "pie",
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      height: 380,
    },

    title: { text: "" },

    tooltip: {
      pointFormatter() {
        return `<b>${this.name}</b>: ₹ ${this.y.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        depth: 45,
        dataLabels: {
          enabled: true,
          useHTML: true,
          formatter() {
            // Show quarter name + months inside the slice
            return `<div style="text-align:center">
                      <b>${this.point.name}</b><br/>
                      ${this.point.monthLabels}
                    </div>`;
          },
          style: {
            color: "#000",
            textOutline: "none",
            fontSize: "11px",
          },
        },
        showInLegend: false, // hide legend
        point: {
          events: {
            click() {
              setSelectedQuarter({ quarter: this.quarter });
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

    credits: { enabled: false },
    legend: { enabled: false },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Quarter Wise TurnOver"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}
      </CardContent>

      {showTable && selectedQuarter && (
        <QuarterWiseTable
          quarter={selectedQuarter.quarter}
          filterBuyerList={filterBuyerList}
          finYr={finYr}
          closeTable={() => setShowTable(false)}
        />
      )}
    </Card>
  );
};

export default Form;
