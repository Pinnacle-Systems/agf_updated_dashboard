import { Box, Card } from "@mui/material";
import { useEffect, useState } from "react";
import EsiDetail from "../../../components/EsiDet";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const DeptmentESI = ({
  companyName,
  selectedYear1,
  ESIdata,
  selectedState,
}) => {
  console.log(selectedState, "selectedState");

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
        const code = emp.DEPARTMENT || "Unknown";
        acc[code] = (acc[code] || 0) + (emp.ESI || 0);
        
        return acc;
    }, {});

  
  const Chartdata = Object.entries(groupdata).map(([x, y]) => ({
      dept: x,
      esi: y,
      // percent: ((y / totalNetPay) * 100).toFixed(2),
      // color:getRandomColor()
    }));
    
    console.log(Chartdata, "groupdata");

    const options = {
         chart: {
        type: 'column'
    },
    title: {
        text: 'World\'s largest cities per 2021'
    },
    // subtitle: {
    //     text: 'Source: <a href="https://worldpopulationreview.com/world-cities" target="_blank">World Population Review</a>'
    // },
    xAxis: {
        type: 'category',
        labels: {
            autoRotation: [-45, -90],
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Population (millions)'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: 'Population in 2021: <b>{point.y:.1f} millions</b>'
    },
    series: [{
        name: 'Population',
        colors: [
            '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
            '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
            '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
            '#03c69b',  '#00f194'
        ],
        colorByPoint: true,
        groupPadding: 0,
        data: Chartdata?.map((x,y)=>({
            name: x.dept,
      y: x.esi

        })),
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            inside: true,
            verticalAlign: 'top',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
    
  };
  return (
    <>
      <Card
        sx={{
          mt: 2,
          ml: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box>
          <HighchartsReact highcharts={Highcharts} options={options} />
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
export default DeptmentESI;
