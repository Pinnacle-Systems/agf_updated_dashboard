import { useTheme } from "@emotion/react";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch } from "react-redux";
import { Box, Card, CardHeader, Grid, Typography } from "@mui/material";
import { push } from "../../../redux/features/opentabs";

const HeadCount = () => {
  const dispatch = useDispatch();
  const [detailedpage, setDetailedpage] = useState(false);
  const theme = useTheme();
  const [chartData, setChartData] = useState({ male: [], female: [] });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalvalue, setTotalvalue] = useState([]);
  const [headcount, setHeadcount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:9008/misDashboard/yearlyComp"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        console.log(response.data, "getEmploy deatil");

        const result = await response.json();

        console.log(result.data, "getEmploy deatil");

        if (result.statusCode === 0 && result.data) {
          const apiCategories = result.data.map((item) => item.customer);
          // const maleData = result.data.map(item => item.male)
          const total = result.data.map((item) => item.total);
          const totalCount = total.reduce((sum, val) => sum + val, 0);
          // const totalFemale = femaleData.reduce((sum, val) => sum + val, 0)
          // console.log(maleData,"totalCount");
          setHeadcount(totalCount);
          setTotalvalue(total);
          setCategories(apiCategories);
          // setChartData({ male: maleData, female: femaleData })
          // setTotalStats({ totalMale, totalFemale, total: totalMale + totalFemale })
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      type: "bar",
      animations: { enabled: true, easing: "easeinout", speed: 800 },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const company = categories[config.dataPointIndex];
          dispatch(
            push({
              id: `Headcount`,
              name: `Headcount`,
              component: "DetailedHeadcount", 
              data: { companyName: company },
            })
          );
        },
      },
    },
    grid: {
      padding: {
        bottom: -35, 
        top: 0,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        distributed: true,
        barHeight: "100%",
        columnWidth: "55%",
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
    dataLabels: {
      enabled: false,
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex];
      },
    },
    xaxis: {
      categories: categories,
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "",
      data: totalvalue,
    },
  ];

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
          title="Employees Strenght on Date"
          titleTypographyProps={{
            sx: { fontSize: "1rem", fontWeight: 600 },
          }}
        />
        <Box sx={{ "& .apexcharts-bar-area:hover": { cursor: "pointer" } }}>
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={250}
          />
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
            OverAll Head Count : {headcount}
          </Typography>
        </Box>
      </Card>
    </>
  );
};

export default HeadCount;
