import { useState } from "react";
import { useGetEsiPf1Query } from "../../../redux/service/misDashboardService";
import { useEffect } from "react";
import { Avatar, Box, Card, CardHeader, Grid, Typography } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Chart from "react-apexcharts";
import EsiDetail from "../../../components/EsiDet";

import Highcharts from "highcharts";
import ESIDetailed from "../../../components/MonthESIde";
import { IoIosPeople, IoMdFemale } from "react-icons/io";
import { BiMaleSign } from "react-icons/bi";

const EmployerPF = ({ companyName, selectedYear1, PFdata, selectedState }) => {
  const [search, setSearch] = useState({
    FNAME: "",
    GENDER: "",
    MIDCARD: "",
    DEPARTMENT: "",
    COMPCODE: "",
  });
  const [showTable, setShowTable] = useState(false);

  const [selectedYear, setSelectedYear] = useState(selectedYear1);
  const [filterBuyer, setFilterBuyer] = useState(companyName);

  useEffect(() => {
    setFilterBuyer(companyName);
  }, [companyName]);

  useEffect(() => {
    setSelectedYear(selectedYear1);
  }, [selectedYear1]);
  const filteredData = Array.isArray(PFdata)
    ? PFdata.filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
    : [];

  const groupdata = filteredData?.reduce((acc, emp) => {
    const code = emp.GENDER || "Unknown";
    acc[code] = (acc[code] || 0) + (Math.round(emp.EMPLOYER_CON) || 0);

    return acc;
  }, {});

  const chartdata = Object.entries(groupdata).map(([x, y]) => ({
    gender: x,
    contribution: y,
  }));

  const colourdata = chartdata?.map((x) => x.gender);

  //    const groupdata = filteredData?.reduce((acc, emp) => {
  //   const dept = Math.floor(emp.AGE) || "Unknown";
  //   const gender = (emp.GENDER || "Unknown").trim().toLowerCase();

  //   const normalizedGender =
  //     gender === "male" ? "Male" :
  //     gender === "female" ? "Female" :
  //     "Other";

  //   if (!acc[dept]) {
  //     acc[dept] = { Male: 0, Female: 0, Other: 0 };
  //   }

  //   acc[dept][normalizedGender] += emp.ESI || 0;

  //   return acc;
  // }, {});
  const colors = colourdata?.map(
    () => "#" + Math.floor(Math.random() * 16777215).toString(16)
  );

  const maledata = chartdata?.find((x) => x.gender === "MALE");
  const femaledata = chartdata?.find((x) => x.gender === "FEMALE");
  console.log(maledata, "maledata");

  const option = {
    chart: {
      backgroundColor: "#f5f5f5",
      type: "pie",
      height: 238,
      custom: {},

      events: {
        render() {
          const chart = this;
          const series = chart.series[0];

          // Get total value
          const total = chart.options.chart.custom.total ?? 0;

          let customLabel = chart.customLabel;

          if (!customLabel) {
            customLabel = chart.customLabel = chart.renderer
              .label(
                `<br/><strong>${total}</strong>`,
                0,
                0,
                null,
                null,
                null,
                null,
                null,
                "center"
              )
              .css({
                color: "#000",
                textAnchor: "middle",
              })
              .add();
          } else {
            customLabel.attr({
              text: `Total<br/><strong>${total}</strong>`,
            });
          }

          const x = series.center[0] + chart.plotLeft;
          const y = series.center[1] + chart.plotTop;

          customLabel.attr({
            x,
            y,
          });

          // Dynamic font size adjust
          customLabel.css({
            fontSize: `${series.center[2] / 12}px`,
          });
        },
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    title: {
      text: null,
    },

    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 8,
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: "{point.name}",
          },
          {
            enabled: true,
            distance: -15,
            format: "{point.percentage:.0f}%",
            style: {
              fontSize: "0.9em",
            },
          },
        ],
        showInLegend: true,

        point: {
          events: {
            click: function () {
              console.log("Clicked Slice:", this.name);
              console.log("Value:", this.y);
              setShowTable(true);
            },
          },
        },
      },
    },
    series: [
      {
        name: "Employer contribution",
        colorByPoint: true,
        innerSize: "75%",
        data: chartdata?.map((x, y) => ({
          name: x.gender,
          y: x.contribution,
        })),
      },
    ],
  };

  const options = {
    chart: {
      backgroundColor: "#f5f5f5",
      height: 100,
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: true,
      spacing: [0, 0, 0, 0],
    },
    title: {
      text: null,
      align: "center",
      verticalAlign: "middle",
      y: 70,
      style: { fontSize: ".9em" },
    },
    tooltip: {
      formatter: function () {
        return `
            <b>${this.point.name}</b><br/>
            PF value: <b>${this.point.y}</b><br/>
            
          `;
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
          distance: -50,
          style: { fontWeight: "bold", color: "white" },
        },
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "100%"],
        size: "180%",
        innerSize: "60%",
        point: {
          events: {
            click: function () {
              // dispatch(
              //   push({
              //     id: "ESIDetail",
              //     name: "ESIDetail",
              //     component: "DetailedDashBoard",
              //     data: { companyName: this.name, Year: this.Year },
              //   })
              // );
            },
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        name: "PF share",
        innerSize: "50%",
        data: chartdata?.map((x, i) => ({
          name: x.gender,
          y: x.contribution,
          color: colors[i],
        })),
      },
    ],
  };

  const StatBox = ({ icon: Icon, value, label, color }) => (
    <Box
      sx={{
        p: 1,
        borderRadius: 3,
        background: "#e9eef6",
        display: "flex",
        alignItems: "center",
        gap: 2,
        boxShadow: 2,
        height: "100%",
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          //   mr: 3,
          borderRadius: 50,
          width: 40,
          height: 40,
          boxShadow: 3,
          color: "common.black",
          backgroundColor: "white",
        }}
      >
        {Icon}
      </Avatar>

      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Card
        sx={{
          mt: 2,
          ml: 1,
        
          backgroundColor: "#f5f5f5",
        }}
      >
        <CardHeader
          title="Employer Contribution"
          titleTypographyProps={{
            sx: { fontSize: ".9rem", fontWeight: 600 },
          }}
          sx={{
            p: 1,
            borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
          }}
        />
        <Grid container spacing={1}>
          <Grid item md={4}>
            <Box sx={{ml:1,mt:2}}>
              <StatBox
                icon={<BiMaleSign size={30} />}
                value={maledata?.contribution}
                label="Male"
              />
            </Box>
            </Grid>
            <Grid item md={4}>
            <Box sx={{mt:2}}>
              <StatBox
                icon={<IoMdFemale size={30} />}
                value={femaledata?.contribution}
                label="Female"
              />
            </Box>
          </Grid>
          <Grid item md={4}>
            <Box>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </Box>
          </Grid>
        </Grid>

        {showTable && (
          <ESIDetailed
            selectedYear={selectedYear}
            selectedBuyer={[filterBuyer]}
            closeTable={() => setShowTable(false)}
            setSearch={setSearch}
            search={search}
          />
        )}
      </Card>
    </>
  );
};

export default EmployerPF;
