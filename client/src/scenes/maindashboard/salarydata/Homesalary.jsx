import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { push } from "../../../redux/features/opentabs";
import {
  Card,
  Typography,
  useTheme,
  CircularProgress,
  CardContent,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useGetMisDashboardSalaryDetQuery } from "../../../redux/service/misDashboardService";
import { Box } from "@mui/material";

const HomeSalary = () => {
  const theme = useTheme();
  const {
    data: Salarydata,
    isLoading,
    isError,
    error,
  } = useGetMisDashboardSalaryDetQuery({ params: {} });

  const dispatch = useDispatch();

  if (isLoading)
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Card>
    );

  if (isError)
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error: {error?.message || "Failed to load data"}
      </Typography>
    );

  const employees = Salarydata?.data || [];

  const totalsByComp = employees.reduce((acc, emp) => {
    const code = emp.COMPCODE || "Unknown";
    acc[code] = (acc[code] || 0) + (emp.NETPAY || 0);
    return acc;
  }, {});

  console.log(Salarydata, "Salarydata");

  const compList = Object.entries(totalsByComp).map(
    ([code, total], index, arr) => {
      const prevTotal = index > 0 ? arr[index - 1][1] : total;
      const trendDir = total >= prevTotal ? "up" : "down";
      const color = trendDir === "up" ? "success.main" : "error.main";
      return { COMPCODE: code, NETPAY: total, trendDir, color };
    }
  );
  console.log(compList, "compList");

  const Totalvalue = compList?.map((x) => x.NETPAY);
  const company = compList?.map((x) => x.COMPCODE);

  const Sumtotal = Totalvalue?.reduce((sum, total) => sum + total);

  console.log(Totalvalue, Sumtotal, "Sumtotal");

  const options = {
    chart: {
      type: "area",
      height: 267,
      zoomType: null,
      enabled: true, // same as zoom: { enabled: false }
    },

    title: {
      text: "Salary Contribution",
      align: "",
      style: {
    fontSize: "16px",     
    fontWeight: "600",    
    color: "#000",        
    
  },
    },

    subtitle: {
      text: "",
      align: "left",
    },

    xAxis: {
      type: "datetime",
      categories: company, // SAME AS APEX LABELS
    },

    yAxis: {
      title: { text: "" },
      opposite: true, // SAME AS APEX
    },

    legend: {
      align: "left",
      verticalAlign: "bottom",
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: false,
        },
      },
      area: {
        marker: {
          enabled: false,
        },
        lineWidth: 2,
      },
    },

    series: [
      {
        name: "Last Month salary",
        data: Totalvalue.map((value, index) => ({
          y: value,
          comp: company[index],
        })),
        point: {
          events: {
            click: function () {
              const company = this.category;
              dispatch(
                push({
                  id: `SalaryDetail`,
                  name: `SalaryDetail`,
                  component: "SunburstChart", //
                  data: { companyName: company },
                })
              );
            },
          },
        },
      },
    ],
  };

  return (
    <Card
      sx={{
        //   m:1,
        borderRadius: 3,
        boxShadow: 4,
        width: "100%",
        maxWidth: 1000,
        mx: 1,
      }}
    >
      <CardContent>
        <div>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
        <Box
          sx={{
            // m: 1,
            p: 1,
            // mb: 2,
            bgcolor: "background.default",
            borderRadius: 3,
            textAlign: "center",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            OverAll Contribution : {Sumtotal.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HomeSalary;
