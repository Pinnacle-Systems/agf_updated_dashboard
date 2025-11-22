import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { push } from "../../../redux/features/opentabs";
import {
  Card,
  Typography,
  useTheme,
  CircularProgress,
  CardContent,
  CardHeader,
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

  // console.log(employees, "Home Salary");

  const totalsByComp = employees.reduce((acc, emp) => {
    const code = emp.COMPCODE || "Unknown";
    acc[code] = (acc[code] || 0) + (emp.NETPAY || 0);
    return acc;
  }, {});

  const compList = Object.entries(totalsByComp).map(
    ([code, total], index, arr) => {
      const prevTotal = index > 0 ? arr[index - 1][1] : total;
      const trendDir = total >= prevTotal ? "up" : "down";
      const color = trendDir === "up" ? "success.main" : "error.main";
      return { COMPCODE: code, NETPAY: total, trendDir, color };
    }
  );

  const Totalvalue = compList?.map((x) => x.NETPAY);
  const company = compList?.map((x) => x.COMPCODE);

  const Sumtotal = Totalvalue?.reduce((sum, total) => sum + total);

  const options = {
    chart: {
      type: "area",
      height: 250,
      zoomType: null,
      enabled: true,
      // spacingTop: 0,
      // spacingBottom: 0,
      // spacingLeft: 0,
      // spacingRight: 0,
    },

    title: {
      text: null,
    },

    subtitle: {
      text: "",
      align: "left",
    },

    xAxis: {
      // minPadding: 0,
      // maxPadding: 0,

      title: { text: "Company", style: { fontSize: "12px" } },
      labels: { style: { fontSize: "10px" } },
      categories: company,
    },

    yAxis: {
      opposite: true,
      title: { text: "Amount", style: { fontSize: "12px" } },
      labels: { style: { fontSize: "10px" } },
    },

    legend: {
      align: "left",
      verticalAlign: "bottom",
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          rotation: -45,
          formatter: function () {
            return this.y.toLocaleString();
          },
        },
      },
      area: {
        marker: {
          enabled: true,
        },
        lineWidth: 1,
      },
    },

    series: [
      {
        name: "Last month salary",
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
                  component: "SunburstChart",
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
          borderRadius: 3,
        boxShadow: 4,
        width: "100%",

        ml: 1,
      }}
    >
      <CardHeader
        title="Salary Distribution"
        titleTypographyProps={{
          sx: { fontSize: "1rem", fontWeight: 600 },
        }}
        sx={{
          borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
        }}
      />
      <CardContent sx={{ pb: 0 }}>
        <HighchartsReact highcharts={Highcharts} options={options} />

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
            OverAll Distribution : {Sumtotal.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HomeSalary;
