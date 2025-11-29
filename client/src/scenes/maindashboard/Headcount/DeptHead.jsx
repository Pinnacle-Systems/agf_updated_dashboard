import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import {
  useGetHeadCountDetailQuery,
  useGetHeadCountQuery,
  useGetMisDashboardOrdersInHandQuery,
} from "../../../redux/service/misDashboardService";
import { useTheme } from "@emotion/react";
import HeadDetailedCom from "../../../components/Headcount/HeadDetail";

// Initialize Highcharts drilldown safely
if (typeof Highcharts === "object") {
  drilldown(Highcharts);
}

const DeptHeadCount = ({ companyName, selectedState, HeadData }) => {
  const [search, setSearch] = useState({
    FNAME: "",
    GENDER: "",
    MIDCARD: "",
    DEPARTMENT: "",
    COMPCODE: "",
  });
  const [showTable, setShowTable] = useState(false);

  const [filterBuyer, setFilterBuyer] = useState(companyName);



  useEffect(() => {
    setFilterBuyer(companyName);
  }, [companyName]);

  const filteredData = Array.isArray(HeadData)
    ? HeadData.filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
    : [];

    const groupdata1 = filteredData?.reduce((acc, emp) => {
    const dept = emp.DEPARTMENT || "Unknown";
    const gender = (emp.GENDER || "Unknown").trim().toLowerCase();

    const normalizedGender =
      gender === "male" ? "Male" : gender === "female" ? "Female" : "Other";

    if (!acc[dept]) {
      acc[dept] = { Male: 0, Female: 0 };
    }

    acc[dept][normalizedGender] += 1;

    return acc;
  }, {});

  console.log(groupdata1, "depatmet");

  const departments = Object.keys(groupdata1 || []);

  const maleCounts = departments.map((dept) => groupdata1[dept].Male || 0);
  const femaleCounts = departments.map((dept) => groupdata1[dept].Female || 0);

  const option = {
    chart: {
      height: 300,
      type: "spline",
      marginBottom: 100,
      backgroundColor: "#f5f5f5",
    },
    title: {
      text: null,
    },

    xAxis: {
      categories: departments,
      accessibility: {
        description: "Months of the year",
      },
      labels: {
        style: { fontSize: "8px"},
      },
    },
    yAxis: {
      title: {
        text: "HeadCount", style: { fontSize: "10px" },
      },
      labels: {
        style: { fontSize: "10px"},
      },
      
    },
    tooltip: {
      crosshairs: true,
      shared: true,
    },
    plotOptions: {
      series: {
      cursor: "pointer",

      point: {
        events: {
          click: function () {
            setSearch((prev) => ({
                ...prev,
                DEPARTMENT: this.category,
              }));

            setShowTable(true)
            console.log("Department:", this.category);
            console.log("Gender:", this.series.name);
            console.log("Headcount:", this.y);

          },
        },
      },
    },
      spline: {
        marker: {
          radius: 4,
          lineColor: "#666666",
          lineWidth: 1,
        },
      },
    },
    series: [
      {
        name: "Male",

        data: maleCounts,
      },
      {
        name: "Female",
        data: femaleCounts,
      },
    ],
  };

  return (
    <Card
            sx={{
              ml: 1,
              backgroundColor: "#f5f5f5",
            }}
          >
             <CardHeader
                    title="Department wise HeadCount-Male vs Female"
                    titleTypographyProps={{
                      sx: { fontSize: ".9rem", fontWeight: 600 },
                    }}
                    sx={{
                      p: 1,
                      borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                    }}
                  />
      <Box>
        <HighchartsReact highcharts={Highcharts} options={option} />
      </Box>

    
        {showTable && (
          <HeadDetailedCom
            selectedBuyer={[filterBuyer]}
            closeTable={() => setShowTable(false)}
            setSearch={setSearch}
            search={search}
            HeadData={HeadData}
           />
        )}

     
    </Card>
  );
};

export default DeptHeadCount;
