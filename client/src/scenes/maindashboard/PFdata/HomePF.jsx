import {
  Card,
  CardHeader,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useGetEPFlastmonthQuery } from "../../../redux/service/misDashboardService";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { Box } from "@mui/material";
import DotsVertical from "mdi-material-ui/DotsVertical";

Highcharts3D(Highcharts);

const HomePF = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { data: pfdata } = useGetEPFlastmonthQuery();

  const year = pfdata?.data.map((item) => item.Year);
  console.log(pfdata, "PFdata");

  const totalvalue = pfdata?.data.map((item) => item.pf);
  const headcount = totalvalue?.reduce((sum, val) => sum + val, 0);

  const options = {
    chart: {
      type: "pie",
      options3d: {
        enabled: true,
        alpha: 40,
      },
      backgroundColor: "#FFFFFF",
      width: 330,
      height: 265,
      borderRadius: 10,
      margin: [0, 0, 0, 0],
    },
    title: {
      text: "",
      align: "left",
      style: {
        color: "#000000",
        fontWeight: "normal",
      },
    },
    subtitle: {
      text: "",
      align: "left",
      style: {
        color: "#000000",
        fontWeight: "normal",
      },
    },
    plotOptions: {
      pie: {
        innerSize: 100,
        depth: 45,
        dataLabels: {
          formatter: function () {
            return `${this.point.name}`;
          },
          style: {
            color: "#000000",
            fontWeight: "normal",
          },
        },

        point: {
          events: {
            click: function () {
              const companyName = this.name;
              const Year = this.Year;
              console.log("Clicked:", companyName, Year);

              dispatch(
                push({
                  id: "PFDetails",
                  name: "PFDetails",
                  component: "PFIndex",
                  data: { companyName, Year },
                })
              );
            },
          },
        },
      },
    },
    tooltip: {
      style: {
        color: "#374151",
        fontSize: "10px",
      },
      headerFormat: "<b> {point.key}</b><br/>",
      pointFormatter: function () {
        return `
                    <span style="color:${this.color}">\u25CF</span>
                    <span style="color: #2d2d2d;"> PF Amount: <b>${this.y.toLocaleString()}</b></span><br/>
                    <span style="color: #2d2d2d;"> headCount: <b>${this.count.toLocaleString()}</b></span><br/>
                `;
      },
    },
    series: [
      {
        name: "PF Amount",
        data: pfdata?.data.map((item, index) => ({
          name: item.customer,
          y: item.pf,
          count: item.headCount,
          Year: year[index],
        })),
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <Card
        sx={{
          // m:1,
          borderRadius: 3,
          boxShadow: 4,
          width: "100%",
          maxWidth: 1000,
          mx: 1,
        }}
      >
        <CardHeader
          title="PF contribution"
          titleTypographyProps={{
            sx: { fontSize: "1rem", fontWeight: 600 },
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
          }}
        />
        <Box>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Box>
        <Box
          sx={{
            m: 1,
            p: 1,
            // mb: 2,
            bgcolor: "background.default",
            borderRadius: 3,
            textAlign: "center",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            OverAll Contribution : {headcount?.toLocaleString()}
          </Typography>
        </Box>
      </Card>
    </>
  );
};

export default HomePF;
