import { Box, Card, CardHeader } from "@mui/material";
import { useEffect, useState } from "react";
import EsiDetail from "../../../components/EsiDet";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import ESIDetailedCom from "../../../components/ESIdetailCom";

const DeptESI = ({ companyName, selectedYear1, ESIdata, selectedState }) => {
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

//   const groupdata = filteredData?.reduce((acc, emp) => {
//   const dept = emp.DEPARTMENT || "Unknown";

//   // Normalizing gender to consistent format
//   const genderRaw = emp.GENDER || "Unknown";
//   const gender = genderRaw.toLowerCase() === "male"
//       ? "Male"
//       : genderRaw.toLowerCase() === "female"
//       ? "Female"
//       : "Other";

//   if (!acc[dept]) {
//     acc[dept] = { Male: 0, Female: 0, Other: 0 };
//   }

//   acc[dept][gender] = (acc[dept][gender] || 0) + (emp.ESI || 0);
//   return acc;
// }, {});

// const groupdata = filteredData?.reduce((acc, emp) => {
//   const dept = emp.DEPARTMENT || "Unknown";
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

const groupdata = filteredData?.reduce((acc, emp) => {
  const dept = emp.DESIGNATION || "Unknown";
  const gender = (emp.GENDER || "Unknown").trim().toLowerCase();

  const normalizedGender =
    gender === "male" ? "Male" :
    gender === "female" ? "Female" :
    "Other";

  // Initialize default structure
  if (!acc[dept]) {
    acc[dept] = {
      Male: 0,
      Female: 0,
      Other: 0,
      highest: { key: "", value: 0 } // store highest value here
    };
  }

  // Add ESI value
  acc[dept][normalizedGender] += emp.ESI || 0;

  // Recalculate highest value after update
  const highestValue = Object.entries({
    Male: acc[dept].Male,
    Female: acc[dept].Female,
    Other: acc[dept].Other
  }).reduce(
    (max, [key, value]) => value > max.value ? { key, value } : max,
    { key: "", value: 0 }
  );

  acc[dept].highest = highestValue;

  return acc;
}, {});




const sortedDepartments = Object.entries(groupdata).sort((a, b) => {
    const aMax = Math.max(a[1].Male || 0, a[1].Female || 0, a[1].Other || 0);
    const bMax = Math.max(b[1].Male || 0, b[1].Female || 0, b[1].Other || 0);
    return aMax - bMax; 
});

const categories = sortedDepartments.map(([dep]) => dep);

const maleValues = sortedDepartments.map(([dep, values]) => -(values.Male || 0));
const femaleValues = sortedDepartments.map(([dep, values]) => values.Female || 0);

console.log(femaleValues, "groupdata");

  //     console.log(departments,"ESIyeardata1");
  //   const Chartdata = Object.entries(groupdata).map(([x, y]) => ({
  //         month: x,
  //         esi: y,
  //         // percent: ((y / totalNetPay) * 100).toFixed(2),
  //         // color:getRandomColor()
  //     }));

  //    const pfData = Chartdata?.map((item) => item.esi);
  //   const headCount = Chartdata?.map((item) => item.month);

  const options = {
    chart: {
      type: "bar",
       backgroundColor: "#f5f5f5",
      marginLeft:100,
      height:400,
      marginBottom:80,

    },
    title: {
      text: null,
    },
    // subtitle: {
    //     text: 'Source: <a ' +
    //         'href="https://countryeconomy.com/demography/population-structure/andorra"' +
    //         'target="_blank">countryeconomy.com</a>'
    // },
    accessibility: {
      point: {
        valueDescriptionFormat: "{index}. Age {xDescription}, {value}%.",
      },
    },
    xAxis: [
      {
        categories: categories,
        reversed: false,
        labels: {
          step: 1,
          style:{

              fontSize:"9px"
          }
        },
        accessibility: {
          description: "Age (male)",
        },
      },
      {
        opposite: true,
        reversed: false,
        categories: categories,
        linkedTo: 0,
        labels: {
          step: 1,
          style:{

              fontSize:"9px"
          }
        },
        accessibility: {
          description: "Age (female)",
        },
      },
    ],
    yAxis: {
      title: {
        text: null,
      },
      accessibility: {
        description: "Percentage population",
        rangeDescription: "Range: 0 to 5%",
      },
     
    },

    plotOptions: {
      series: {
        stacking: "normal",
        borderRadius: "50%",
        point: {
        events: {
          click: function () {

            const desg=this.category
            setSearch((prev) => ({
                ...prev,
                DESIGNATION: desg,
              }));
              setShowTable(true);

            
          },
        },
      }
      },
    },

    tooltip: {
      formatter() {
        return `<b>${this.series.name}, Dept: ${
          this.point.category
        }</b><br/>ESI: ${Math.abs(this.point.y)}`;
      },
    },

    series: [
      { name: "Male", data: maleValues },
      { name: "Female", data: femaleValues },
    ],
  };

  return (
    <>
       <Card
             sx={{ 
                backgroundColor: "#f5f5f5",
             
               mt:2,
               
             }}
           >
             <CardHeader title="Designation wise ESI-Male vs Female" titleTypographyProps={{
                   sx: { fontSize: ".9rem", fontWeight: 600},
                 }}
                 sx={{
                   p:1,
                   borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                 }}/>
        <Box>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Box>
        {showTable && (
          <ESIDetailedCom
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
export default DeptESI;
