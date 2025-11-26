import { useState } from "react";
import {
  useGetAgewiseEsiQuery,
  useGetEsiPf1Query,
} from "../../../redux/service/misDashboardService";
import { useEffect } from "react";
import { Box, Card, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Chart from "react-apexcharts";
import EsiDetail from "../../../components/EsiDet";
import AgewiseESIlDetail from "../../../components/AgeESIdetail";

const AgeESI = ({
  companyName,
  selectedYear1,

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

  const { data: salaryDet1, isLoading } = useGetAgewiseEsiQuery({
    params: {
      filterBuyer: filterBuyer,
      filterYear: selectedYear,
    },
  });

  console.log(salaryDet1, "ESIsalaryDet21");

  const ESIdata = salaryDet1?.data || [];

  useEffect(() => {
    setFilterBuyer(companyName);
  }, [companyName]);

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
    const code = emp.SLAP || "Unknown";
    acc[code] = (acc[code] || 0) + (emp.TOTAL_ESI || 0);
    return acc;
  }, {});
  console.log(groupdata, "groupdata");

  const Chartdata = Object.entries(groupdata).map(([x, y]) => ({
    slap: x,
    esi: y,
    // percent: ((y / totalNetPay) * 100).toFixed(2),
    // color:getRandomColor()
  }));

  console.log(Chartdata, "ESIyeardata");
  const pfData = Chartdata?.map((item) => item.esi);
  const headCount = Chartdata?.map((item) => item.slap);

  const options = {
    series: pfData,
    options: {
      chart: {
        type: "pie",
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const index = config.dataPointIndex;
            const value = pfData[index];
            const label = headCount[index];

            setSearch((prev) => ({
              ...prev,
              AGE: label,
            }));
            setShowTable(true);

            
          },
        },
      },
      labels: headCount,
      legend: {
        position: "right",
        fontSize: "14px",
        itemMargin: {
          horizontal: 10, // spacing width
          vertical: 4, // spacing height
        },
        markers: {
          width: 14,
          height: 14,
        },
      },
      dataLabels: {
        style: {
          fontSize: "10px",
        },
      },
      // responsive: [
      //   {
      //     breakpoint: 480,
      //     options: {
      //       chart: {
      //         width: 200,
      //       },
      //       legend: {
      //         position: "bottom",
      //       },
      //     },
      //   },
      // ],
    },
  };

  return (
    <>
      <Card
        sx={{
          backgroundColor: "#f5f5f5",
          // borderRadius: 3,
          // boxShadow: 4,
          //  mt:2,
          height: 275,
        }}
      >
        <CardHeader
          title="Age wise ESI "
          titleTypographyProps={{
            sx: { fontSize: ".9rem", fontWeight: 600 },
          }}
          sx={{
            p: 1,
            borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
          }}
        />
        <Box>
          <Chart options={options.options} series={options.series} type="pie" />
        </Box>
        {showTable && (
          <AgewiseESIlDetail
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

export default AgeESI;
