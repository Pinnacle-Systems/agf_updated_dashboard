import React, { useEffect, useState } from "react";
import { Card, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { useGetMisDashboardSalaryDetQuery } from "../../../redux/service/misDashboardService";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SunburstModule from "highcharts/modules/sunburst";
import { Center } from "@chakra-ui/react";
import SalaryDetail from "../../../components/SalaryDet";

SunburstModule(Highcharts);

const SunburstChart = ({ companyName }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [search, setSearch] = useState({
    FNAME: "",
    GENDER: "",
    MIDCARD: "",
    DEPARTMENT: "",
    COMPCODE: "",
  });
  const [showTable, setShowTable] = useState(false);
  const [filterBuyer, setFilterBuyer] = useState(companyName);

  const { data: Salarydata, isLoading } = useGetMisDashboardSalaryDetQuery({
    params: {
      filterBuyer: filterBuyer,
    },
  });

  useEffect(() => {
    setFilterBuyer(companyName);
  }, [companyName]);

  if (isLoading) return <div>Loading...</div>;

  if (Salarydata?.data?.length === 0)
    return (
      <Card sx={{ p: 2, textAlign: "center", m: 20 }}>No data available</Card>
    );

  // Build sunburst hierarchy
  const buildSunburst = (data) => {
    const result = [];

    const baseColors = [
      "#1f77b4", // blue
      "#ff7f0e", // orange
      "#2ca02c", // green
      "#d62728", // red
      "#9467bd", // purple
      "#8c564b", // brown
      "#e377c2", // pink
      "#7f7f7f", // gray
      "#bcbd22", // olive
      "#17becf", // cyan
    ];

    // Company level total netpay
    const totalCompanySalary = data.reduce(
      (sum, e) => sum + (e.NETPAY || 0),
      0
    );

    result.push({
      id: "root",
      parent: "",
      name: `${companyName}`,
      value: totalCompanySalary,
      total: totalCompanySalary,
    });

    const grouped = {};

    data.forEach((emp) => {
      const d = emp.DEPARTMENT || "UNKNOWN";
      const g = emp.GENDER || "UNKNOWN";

      if (!grouped[d]) grouped[d] = {};
      if (!grouped[d][g]) grouped[d][g] = [];

      grouped[d][g].push(emp);
    });

    let colorIndex = 0;
    Object.keys(grouped).forEach((dept) => {
      const deptSalary = Object.values(grouped[dept])
        .flat()
        .reduce((sum, e) => sum + (e.NETPAY || 0), 0);

      const deptColor = baseColors[colorIndex % baseColors.length];
      colorIndex++;

      result.push({
        id: dept,
        parent: "root",
        name: dept,
        value: deptSalary,
        total: deptSalary,
        color: deptColor,
      });

      Object.keys(grouped[dept]).forEach((gender) => {
        const genderSalary = grouped[dept][gender].reduce(
          (sum, e) => sum + (e.NETPAY || 0),
          0
        );

        const genderId = `${dept}-${gender}`;

        result.push({
          id: genderId,
          parent: dept,
          name: gender,
          value: genderSalary,
          dept,
          gender,
          total: genderSalary,
        });
      });
    });

    return result;
  };

  const sunburstData = buildSunburst(Salarydata.data);

  const options = {
    chart: { height: 410 },

    title: {
      text: "Company → Department → Gender",
     style: {
    fontSize: "16px",     
    fontWeight: "600",    
    color: "#000",        
    
  },
    },

    series: [
      {
        type: "sunburst",
        data: sunburstData,
        allowDrillToNode: true,
        cursor: "pointer",
        borderRadius: 3,

        levels: [
          {
            // Company level (root)
            level: 0,
            
            color: "#1976d2", // optional
            dataLabels: {
              enabled: false,
              style: { fontSize: "12px", fontWeight: "light" },
            },
          },
          {
            // Department level
            level: 1,
            levelSize: {
              unit: "percentage",
              value: 30, // outer ring size
            },
            colorByPoint: true,
            dataLabels: {
              style: { fontSize: "", fontWeight: "bold" },
            },
          },
          {
            // Gender level
            level: 2,
            levelSize: {
              unit: "percentage",
              value: 50, // outer ring size
            },
            colorVariation: {
              key: "brightness",
              // top:15
            },
            dataLabels: {
              style: { fontSize: "10px" ,fontWeight: "bold" },
            },
          },
          {
            // Gender level
            level: 3,
           
            colorVariation: {
              key: "brightness",
              // top:15
            },
            dataLabels: {
              style: { fontSize: "8px" ,fontWeight: "bold" },
            },
          },
        ],

        // dataLabels: {
        //   format: "{point.name}",
        // },

        point: {
          events: {
            click: function () {
              if (this.dept && this.gender) {
                setSearch((prev) => ({
                  ...prev,
                  DEPARTMENT: this.dept,
                  GENDER: this.gender,
                }));
                setShowTable(true);
              }
            },
          },
        },
      },
    ],

    tooltip: {
      useHTML: true,
      formatter: function () {
        return `
        <b>${this.point.name}</b><br/>
        Total NetPay: ₹${this.point.total?.toLocaleString()}
      `;
      },
    },
  };

  return (
    <Card
      sx={{
        mt: 2,
        // p: 10,
        borderRadius: 3,
        boxShadow: 4,
        width: "100%",
        maxWidth: 1000,
        //   mx: 1,
      }}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />

      {showTable && (
        <SalaryDetail
          selectedBuyer={[filterBuyer]}
          closeTable={() => setShowTable(false)}
          setSearch={setSearch}
          search={search}
        />
      )}
    </Card>
  );
};

export default SunburstChart;
