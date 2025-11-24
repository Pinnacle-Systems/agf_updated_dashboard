import React, { useEffect, useState } from "react";
import { Card, CardHeader, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { useGetMisDashboardSalaryDetQuery } from "../../../redux/service/misDashboardService";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SunburstModule from "highcharts/modules/sunburst";
import { Center } from "@chakra-ui/react";
import SalaryDetail from "../../../components/SalaryDet";
import SortedBarChart from "../../MisDashboard/BloodGroupDistribution/SortedBarChart";
import SortedBarChart1 from "./designchart";

SunburstModule(Highcharts);

const SunburstChart = ({ companyName, selectedState, salaryDet }) => {
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

  useEffect(() => {
    setFilterBuyer(companyName);
  }, [companyName]);

  // if (salaryDet?.length === 0)
  //   return (
  //     <Card sx={{ p: 2, textAlign: "center", m: 20 }}>No data available</Card>
  //   );

  const filteredData = Array.isArray(salaryDet)
    ? salaryDet.filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
    : [];

  const totalsByComp = filteredData.reduce((acc, emp) => {
    const code = emp.DEPARTMENT || "Unknown";
    acc[code] = (acc[code] || 0) + (emp.NETPAY || 0);
    return acc;
  }, {});
  const Chartdata = Object.entries(totalsByComp).map(([x, y]) => ({
    Department: x,
    Netpay: y,
  }));


  const sortchartdata=Chartdata?.sort((a,b)=>b.Netpay-a.Netpay)


  
  return (
    <Card
      sx={{ 
         backgroundColor: "#f5f5f5",
        // borderRadius: 3,
        // boxShadow: 4,
        mt:2,
        ml:1
      }}
    >
      <CardHeader title="Department wise salary" titleTypographyProps={{
            sx: { fontSize: ".9rem", fontWeight: 600},
          }}
          sx={{
            p:1,
            borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
          }}/>
      <SortedBarChart1 topItems={sortchartdata} setSearch={setSearch} setShowTable={setShowTable} selectedState={selectedState} />

      {showTable && (
        <SalaryDetail
          selectedBuyer={[filterBuyer]}
          closeTable={() => setShowTable(false)}
          setSearch={setSearch}
          search={search}
          // selectGender1={selectGender}
        />
      )}
    </Card>
  );
};

export default SunburstChart;


