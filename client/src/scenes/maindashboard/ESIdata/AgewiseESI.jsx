import { useState } from "react";
import { useGetEsiPf1Query } from "../../../redux/service/misDashboardService";
import { useEffect } from "react";
import { Box, Card } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Chart from "react-apexcharts";
import EsiDetail from "../../../components/EsiDet";

const AgeESI = ({
  companyName,
  selectedYear1,
  ESIdata,
  selectedState,
}) => {
  
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

  // FIX: sync year from parent
  useEffect(() => {
    setSelectedYear(selectedYear1);
  }, [selectedYear1]);
  const filteredData = Array.isArray(ESIdata)
    ? ESIdata.filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
    : [];

 const groupdata = filteredData?.reduce((acc, emp) => {
  const dept = Math.floor(emp.AGE) || "Unknown";
  const gender = (emp.GENDER || "Unknown").trim().toLowerCase();

  const normalizedGender =
    gender === "male" ? "Male" :
    gender === "female" ? "Female" :
    "Other";

  if (!acc[dept]) {
    acc[dept] = { Male: 0, Female: 0, Other: 0 };
  }

  acc[dept][normalizedGender] += emp.ESI || 0;

  return acc;
}, {});

console.log(groupdata,"groupdata");


  const Chartdata = Object.entries(groupdata).map(([x, y]) => ({
    month: x,
    esi: y,
    // percent: ((y / totalNetPay) * 100).toFixed(2),
    // color:getRandomColor()
  }));

  // console.log(Chartdata,"ESIyeardata");
  const pfData = Chartdata?.map((item) => item.esi);
  const headCount = Chartdata?.map((item) => item.month);

  const options = {
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <>
      <Card
        sx={{
          ml: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box>
  <Chart options={options.options} series={options.series} type="pie" width="380" />
</Box>
        {showTable && (
          <EsiDetail
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

export default AgeESI;
