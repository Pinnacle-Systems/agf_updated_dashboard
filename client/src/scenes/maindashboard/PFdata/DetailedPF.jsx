import { useState } from "react";
import {
  useGetEsiPf1Query,
  useGetEsiPfQuery,
} from "../../../redux/service/misDashboardService";
import { useEffect } from "react";
import { Card, CardHeader } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Title } from "@mui/icons-material";
import PfDetail from "../../../components/PfDet";
import PFDetailedCom from "../../../components/PF detail/pfDetail";

const DetailedPF = ({ companyName, selectedYear1, PFdata, selectedState }) => {
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

  //     const { data: PFyeardata } = useGetEsiPfQuery(
  //         {params: {
  //             filterSupplier: filterBuyer ,
  //             filterYear: selectedYear ,
  //         }},

  //     );
  //     console.log(PFyeardata, "PFyeardata")
  //    const pfData = PFyeardata?.data.map((item) => item.esi);
  //     const headCount = PFyeardata?.data.map((item) => item.headCount);

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
    const code = emp.DEPARTMENT || "Unknown";
    acc[code] = (acc[code] || 0) + (emp.PF || 0);

    return acc;
  }, {});

  const Chartdata = Object.entries(groupdata).map(([x, y]) => ({
    dept: x,
    pf: y,
    // percent: ((y / totalNetPay) * 100).toFixed(2),
    // color:getRandomColor()
  }));
  const pfData = Chartdata?.map((item) => item.pf);
  const Xdata=Chartdata?.map((item)=>item.dept)

  const options = {
    chart: {
      backgroundColor: "#f5f5f5",
      marginTop: 10,
      marginBottom: 100, 
      type: "line",
      height: 250,
      borderRadius: 10,
    },
    xAxis: {
      categories: Xdata,
      title: {
        text: "Department",
        style: { fontSize: "10px" },
      },
      labels: {
        style: { fontSize: "10px"},
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Amount (PF)",
        style: { fontSize: "10px" },
      },
      labels: {
        style: { fontSize: "10px" },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      style: { fontSize: "10px" },
      formatter: function () {
        let index = this.points[0].point.index;
        
        let pf = pfData[index];
        let monthName = this.x;

        return `<b>Dept:</b> ${monthName} <br/>
                        <b>PF Value:</b> ${pf} <br/>
                        `;
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 3,
          symbol: "circle",
        },
        dataLabels: {
          style: { fontSize: "10px" },
        },
        point: {
          events: {
            click: function () {
                setSearch((prev) => ({
              ...prev,
              DEPARTMENT: this.category,
            }));
              setShowTable(true);
            },
          },
        },
      },
    },
    title: {
      text: null,
    },
    legend: {
      enabled:false,
      itemStyle: { fontSize: "10px" },
    },
    series: [
      {
        name: "Department",
        data: pfData,
        color: "#FF5733",
      },
    ],
  };

  return (
    <>
      <Card
        sx={{
          // mt: 2,
          // ml: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
         <CardHeader
                title="Department wise PF"
                titleTypographyProps={{
                  sx: { fontSize: ".9rem", fontWeight: 600 },
                }}
                sx={{
                  p: 1,
                  borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                }}
              />
        <HighchartsReact highcharts={Highcharts} options={options} />

        {showTable && (
                  <PFDetailedCom
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

export default DetailedPF;
