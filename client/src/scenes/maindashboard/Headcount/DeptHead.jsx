import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import { useGetHeadCountQuery } from "../../../redux/service/misDashboardService";
import { useTheme } from "@emotion/react";

// Initialize Highcharts drilldown safely
if (typeof Highcharts === "object") {
  drilldown(Highcharts);
}

const DeptHeadCount = ({ companyName }) => {
  const theme = useTheme();
  const { data: DeptCount } = useGetHeadCountQuery({
    params: { compCode: companyName },
  });
  console.log(companyName,"companyName");
  

  const chartData = useMemo(() => {
    if (!DeptCount?.data) return [];
    return DeptCount.data.map((item) => ({
      name: item.department,
      y: Number(item.headCount || 0),
    }));
  }, [DeptCount]);

  const totalHeadCount = chartData.reduce((sum, d) => sum + d.y, 0);

  const options = useMemo(
    () => ({
      chart: {
        type: "pie",
        backgroundColor: "transparent",
      },
      title: {
        text: "Department-wise Headcount",
        style: { fontSize: "16px", fontWeight: "600" },
      },
      subtitle: {
        text: "Click on a slice for details",
        style: { fontSize: "13px", color: "#888" },
      },
      tooltip: {
        pointFormat:
          '<b>{point.name}</b>: {point.y} Employees<br/>({point.percentage:.1f}%)',
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          borderRadius: 6,
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.percentage:.1f}%",
            style: {
              fontSize: "12px",
              textOutline: "none",
            },
          },
        },
      },
      colors: [
        "#F44F5E",
        "#E55A89",
        "#D863B1",
        "#CA6CD8",
        "#B57BED",
        "#8D95EB",
        "#62ACEA",
        "#4BC3E6",
      ],
      series: [
        {
          name: "Departments",
          colorByPoint: true,
          data: chartData,
        },
      ],
      drilldown: {
        series: [],
      },
    }),
    [chartData]
  );

  return (
    <Card
      sx={{ 
        m:1,
        borderRadius: 3,
        boxShadow: 4,
        width: "100%",
        maxWidth: 1000,
        mx: "auto",
        p: 1,
      }}
    >
     

      <Box>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>

      <Box
        sx={{
          mt: 2,
          p: 1.5,
          bgcolor: "background.default",
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          textAlign: "center",
        }}
      > 
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Overall Head Count: {totalHeadCount}
        </Typography>
      </Box>
    </Card>
  );
};

export default DeptHeadCount;
