

import { Avatar, Box, Grid, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DropdownWithSearch } from "../../../input/inputcomponent";
import {
    useGetYearlyCompQuery,
    useGetsalarydelQuery,
} from "../../../redux/service/misDashboardService";
import { ColorContext } from "../../global/context/ColorContext";
import FinYear from "../../../components/FinYear";
import EmpType1 from "./CustomerWisereport";

import { FaUsers, FaUserTie } from "react-icons/fa";
import { useGetFinYrQuery } from "../../../redux/service/poData";


const TurnOverIndex = ({companyName,finYear}) => {
   
  console.log(companyName,
  finYear,"props");


 
    return (
         <>
      {/* Header and Filters */}
      <div
        className="mt-2"
        style={{
          position: "sticky",
          top: 30,
          zIndex: 50,
          backgroundColor: "white",
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            backgroundColor: "white",
            color: "black",
            p: 0.5,
            borderBottom: "1px solid #afafaf",
            borderTop: "1px solid #afafaf",
          }}
        >
          <Grid item md={5}>
            <Box sx={{ p: 0 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, textAlign: "start", mt: 0.5, ml: 1 }}
              >
                Overview of TurnOver Distribution - {companyName}
              </Typography>
            </Box>
          </Grid>

         
        </Grid>
      </div>

      {/* Child components */}
      <Grid container spacing={1}>
        <Grid item md={6}>
          <Grid container spacing={1}>
            <Grid item md={5}>
              <EmpType1
               companyName={companyName}
               finYear={finYear}
              />
            </Grid>
          
          </Grid>
        </Grid>
      </Grid>
    </>
    )
}

export default TurnOverIndex