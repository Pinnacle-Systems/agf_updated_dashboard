// import { Card, CardContent, CardHeader, IconButton, useTheme } from "@mui/material"
// import HighchartsReact from "highcharts-react-official"
// import { HiDotsVertical } from "react-icons/hi"
// import Highcharts from "highcharts";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { push } from "../../redux/features/opentabs";
// import { Style } from "@mui/icons-material";
// import ReactApexChart from "react-apexcharts";

// import React from "react";
// import ReactApexChart from "react-apexcharts";

// const HeadCount=()=>{
//     const dispatch = useDispatch();
//       const[detailedpage,setDetailedpage]=useState(false)
//       const theme = useTheme()
//       const [chartData, setChartData] = useState({ male: [], female: [] })
//       const [categories, setCategories] = useState([])
//       const [isLoading, setIsLoading] = useState(true)
//       const [error, setError] = useState(null)
//       const [totalStats, setTotalStats] = useState({ totalMale: 0, totalFemale: 0, total: 0 })



//     useEffect(() => {
//         const fetchData = async () => {
//           try {
//             const response = await fetch('http://localhost:9008/misDashboard/yearlyComp')
//             if (!response.ok) throw new Error('Failed to fetch data')
//               console.log(response.data,"getEmploy deatil");
              
    
//             const result = await response.json()
//             console.log(result.data,"getEmploy deatil");
//             if (result.statusCode === 0 && result.data) {
//               const apiCategories = result.data.map(item => item.customer)
//               const maleData = result.data.map(item => item.male)
//               const femaleData = result.data.map(item => item.female)
//               const totalMale = maleData.reduce((sum, val) => sum + val, 0)
//               const totalFemale = femaleData.reduce((sum, val) => sum + val, 0)
    
//               setCategories(apiCategories)
//               setChartData({ male: maleData, female: femaleData })
//               setTotalStats({ totalMale, totalFemale, total: totalMale + totalFemale })
//             }
//           } catch (err) {
//             setError(err.message)
//           } finally {
//             setIsLoading(false)
//           }
//         }
    
//         fetchData()
//       }, [])

//       const series= [
//               {
//                 name: "",
//                 data: [200, 330, 548, 740, 880, 990, 1100, 1380],
//               },
//             ]
//            const options= {
//               chart: {
//                 type: 'bar',
//                 height: 350,
//                 dropShadow: {
//                   enabled: true,
//                 },
//               },
//               plotOptions: {
//                 bar: {
//                   borderRadius: 0,
//                   horizontal: true,
//                   distributed: true,
//                   barHeight: '80%',
//                   isFunnel: true,
//                 },
//               },
//               colors: [
//                 '#F44F5E',
//                 '#E55A89',
//                 '#D863B1',
//                 '#CA6CD8',
//                 '#B57BED',
//                 '#8D95EB',
//                 '#62ACEA',
//                 '#4BC3E6',
//               ],
//               dataLabels: {
//                 enabled: true,
//                 formatter: function (val, opt) {
//                   return opt.w.globals.labels[opt.dataPointIndex] 
//                 },
//                 dropShadow: {
//                   enabled: true,
//                 },
//               },
//               title: {
//                 text: 'Pyramid Chart',
//                 align: 'middle',
//               },
//               xaxis: {
//                 categories: ['Sweets', 'Processed Foods', 'Healthy Fats', 'Meat', 'Beans & Legumes', 'Dairy', 'Fruits & Vegetables', 'Grains'],
//               },
//               legend: {
//                 show: false,
//               },
//             }

    


//     return(
//         <>
//           <Card sx={{
//           borderRadius: 3,
//           boxShadow: 4,
//           width: '100%',
//           maxWidth: 1000,
//           mx:1
//         }}
//       >
//         <CardHeader title={"Employee Strenth"}
//         titleTypographyProps={{
//                   sx: {
//                     lineHeight: "1.2 !important",
//                     letterSpacing: "0.31px !important",
//                     fontSize: "16px",
//                     p: 1,
//                   },
//                 }}
//                 action={
//                   <IconButton
//                     size="small"
//                     aria-label="settings"
//                     sx={{ color: "text.secondary" }}
//                   >
//                     <HiDotsVertical />
//                   </IconButton>
//                 }
//                 sx={{
//                   borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
//                   pb: 0,
//                 }}/>
//                 <CardContent>
//                     <ReactApexChart   options={options} series={series} />
//                 </CardContent>
            

        


//       </Card>

//         </>
//     )
// }
// export default HeadCount
import { useTheme } from "@emotion/react";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch } from "react-redux";

const HeadCount = () => {

    const dispatch = useDispatch();
  const[detailedpage,setDetailedpage]=useState(false)
  const theme = useTheme()
  const [chartData, setChartData] = useState({ male: [], female: [] })
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalStats, setTotalStats] = useState({ totalMale: 0, totalFemale: 0, total: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:9008/misDashboard/yearlyComp')
        if (!response.ok) throw new Error('Failed to fetch data')
          console.log(response.data,"getEmploy deatil");
          

        const result = await response.json()
        console.log(result.data,"getEmploy deatil");
        if (result.statusCode === 0 && result.data) {
          const apiCategories = result.data.map(item => item.customer)
          const maleData = result.data.map(item => item.male)
          const femaleData = result.data.map(item => item.female)
          const totalMale = maleData.reduce((sum, val) => sum + val, 0)
          const totalFemale = femaleData.reduce((sum, val) => sum + val, 0)

          setCategories(apiCategories)
          setChartData({ male: maleData, female: femaleData })
          setTotalStats({ totalMale, totalFemale, total: totalMale + totalFemale })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  console.log(totalStats.total,"totalStats");
  
  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        distributed: true,
        barHeight: "80%",
      },
    },
    colors: ["#F44F5E", "#E55A89", "#D863B1", "#CA6CD8", "#B57BED", "#8D95EB", "#62ACEA", "#4BC3E6"],
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex];
      },
    },
    xaxis: {
      categories:categories,
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "",
      data: [200, 330, 548, 740, 880, 990, 1100, 1380],
    },
  ];

  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default HeadCount;
