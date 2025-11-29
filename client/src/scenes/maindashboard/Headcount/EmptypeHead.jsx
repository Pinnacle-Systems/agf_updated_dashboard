// import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Grid,
} from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useGetMisDashboardEsiDetQuery } from '../../../redux/service/misDashboardService'
import { useState } from 'react';
import EmptypeDetails from '../../../components/EmptypesalayDetails';
import ExpHeadDetail from '../../../components/Headcount/Expdetail';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B435E3", "#E35B5B"];

const EmptypeHead= ({ companyName, selectedState, HeadData }) => {
    const [search, setSearch] = useState({
        FNAME: "",
        GENDER: "",
        MIDCARD: "",
        DEPARTMENT: "",
        COMPCODE: "",
      });
      const [showTable, setShowTable] = useState(false);
       const [filterBuyer, setFilterBuyer] = useState(companyName);

  const filteredData = Array.isArray(HeadData)
    ? HeadData.filter((row) => {
        if (selectedState === "Labour") return row?.PAYCAT !== "STAFF";
        if (selectedState === "Staff") return row?.PAYCAT === "STAFF";
        return true;
      })
    : [];

  const groupeddata = filteredData?.reduce((acc, item) => {

    const code = item.EMPTYPE || "Unknown"
    if (!acc[code]) {
      acc[code]=[]
    }
    acc[code].push(item)

    return acc

  },{});

   const deptHeadcount = {};

  Object.keys(groupeddata || {}).forEach(dept => {
    deptHeadcount[dept] = groupeddata[dept].length;
  });

  console.log(deptHeadcount);

  console.log(deptHeadcount,"totalsByComp");
  

  const Chartdata = Object.entries(deptHeadcount).map(([emptype, netpay], index) => ({
    Emptype: emptype,
    headcount: netpay,
    color: COLORS[index % COLORS.length],
  }));

  const handlePieClick=(data, index)=>{

    
      setSearch((prev) => ({
                ...prev,
                EMPTYPE: data.Emptype,
              }));
              setShowTable(true);
  }

  return (
   <Card
         sx={{
           backgroundColor: "#f5f5f5",
           height:160,
   
           mt:1
         }}
       >
         <CardHeader
           title="Employee Type wise Headcount"
           titleTypographyProps={{
             sx: { fontSize: ".9rem", fontWeight: 600 },
           }}
           sx={{
             p: 1,
             borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
           }}
         />
          <Grid container spacing={1} >

            <Grid item md={6}>
              <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={Chartdata}
                  dataKey="headcount"
                  nameKey="Emptype"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={1}
                  onClick={(data, index) => handlePieClick(data, index)}
                >
                  {Chartdata.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [`₹ ${value.toLocaleString("en-IN")}`, name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: 1, border: '1px solid #ccc' }}
                />
              </PieChart>
              </ResponsiveContainer>

            </Grid>

            <Grid item md={6} sx={{mt:3}}>
              {Chartdata.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt:1 }}>
                <Box
                  sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color, mr: 1.5 }}
                />
                <Typography variant="body2" sx={{fontSize:"11px"}}>
                  <strong>{item.headcount.toLocaleString("en-IN")}</strong> — {item.Emptype}
                </Typography>
              </Box>
            ))}

            </Grid>
            

          </Grid>
      
        
    
      {showTable && (
          <ExpHeadDetail
            selectedBuyer={[filterBuyer]}
            closeTable={() => setShowTable(false)}
            setSearch={setSearch}
            search={search}
            HeadData={HeadData}
          />
        )}
    </Card>
  )
}

export default EmptypeHead;
