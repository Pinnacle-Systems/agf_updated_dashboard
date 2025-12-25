// import { Avatar, Box, Grid, Typography, useTheme } from "@mui/material";
// import { useContext, useEffect, useState } from "react";
// import { DropdownWithSearch } from "../../../input/inputcomponent";
// import {
//   useGetYearlyCompQuery,
//   useGetsalarydelQuery,
// } from "../../../redux/service/misDashboardService";
// import { ColorContext } from "../../global/context/ColorContext";
// import FinYear from "../../../components/FinYear";
// import EmpType1 from "./CustomerWisereport";
// import { FaUsers, FaUserTie } from "react-icons/fa";
// // import { useGetFinYrQuery } from "../../../redux/service/poData";
// import CountryWisereport from '../CountryWise/CountryWiseReport'
// import { useSelector, useDispatch } from "react-redux";
// import { setSelectedYear, setFilterBuyer, setSelectMonths } from "../../../redux/features/dashboardFiltersSlice";
// const TurnOverIndex = ({ companyName, finYear, autoFocusBuyer}) => {
//   const theme = useTheme();
//   const dispatch = useDispatch();

//   const {
//     selectedYear,
//     filterBuyer,
//     selectMonths,
//     filterBuyerList,
//     finYr,
//   } = useSelector((state) => state.dashboardFilters);


//   return (
//     <>
//       {/* Header and Filters */}
//       <div
//         className="mt-2"
//         style={{
//           position: "sticky",
//           top: 30,
//           zIndex: 50,
//           backgroundColor: "white",
//         }}
//       >
//         <Grid
//           container
//           spacing={0}
//           sx={{
//             backgroundColor: "white",
//             color: "black",
//             p: 0.5,
//             borderBottom: "1px solid #afafaf",
//             borderTop: "1px solid #afafaf",
//           }}
//         >
//           <Grid item md={5}>
//             <Box sx={{ p: 0 }}>
//               <Typography
//                 variant="h4"
//                 sx={{ fontWeight: 600, textAlign: "start", mt: 0.5, ml: 1 }}
//               >
//                 Overview of TurnOver Distribution - {companyName}
//               </Typography>
//             </Box>
//           </Grid>
//           <Grid item md={7}>
//             <Grid container spacing={1}>


//               <Grid item md={6}>
//                 <Grid container spacing={1}>
//                   <Grid item md={3}>
//                     <DropdownWithSearch
//                       options={finYr?.data || []}
//                       labelField={"finYr"}
//                       label={""}
//                       value={selectedYear}
//                       setValue={setSelectedYear}
//                       className="mt-1"
//                     />
//                   </Grid>
//                   <Grid item md={5} sx={{ mt: 0.5, borderRadius: 5 }}>
//                     <FinYear
//                       selectedYear={selectedYear}
//                       selectmonths={selectMonths}
//                       setSelectmonths={setSelectMonths}
//                       autoFocusBuyer={autoFocusBuyer}
//                     />
//                   </Grid>
//                   <Grid item md={4}>
//                     <DropdownWithSearch
//                       options={filterBuyerList || []}
//                       labelField={"compname"}
//                       label={""}
//                       value={filterBuyer}
//                       setValue={setFilterBuyer}
//                       className="mt-1"
//                     />
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>

//         </Grid>
//       </div>

//       {/* Child components */}
//       <Grid container >
//         <Grid item md={12}>
//           <Grid container spacing={1}>
//             <Grid item md={6}>
//               <EmpType1
//                 companyName={companyName}
//                 finYear={finYear}
//               />
//             </Grid>
//             {/* <Grid  item  md={3}>
//               <CountryWisereport
//                 companyName={companyName}
//                 finYear={finYear}
//               />
//             </Grid> */}


//           </Grid>
//         </Grid>

//       </Grid>
//     </>
//   )
// }

// export default TurnOverIndex

import { Avatar, Box, Grid, Typography, useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { DropdownWithSearch } from "../../../input/inputcomponent";
import FinYear from "../../../components/FinYear";
import EmpType1 from "./CustomerWisereport";
import CountryWisereport from "../CountryWise/CountryWiseReport";
import ItemWisereport from './ItemWisereport'
import MonthWise from './MonthWiseReport'
import QuarterWise from './QuarterWiseReport'
import YearWise from './YearWise'
import SingleMonthWise from './SIngleMonthReport'
import { setSelectedYear, setFilterBuyer, setSelectMonths } from "../../../redux/features/dashboardFiltersSlice";
import { useEffect } from "react";

const TurnOverIndex = ({ companyName, autoFocusBuyer, filterBuyerList, }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Redux state
  const { selectedYear, filterBuyer, selectMonths, finYr } = useSelector((state) => state.dashboardFilters);
  // useEffect(() => {
  //   if (companyName && companyName !== filterBuyer) {
  //     dispatch(setFilterBuyer(companyName));
  //   }
  // }, [dispatch, companyName, filterBuyer]);
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
          // alignItems="center"
          justifyContent="space-between"
          sx={{
            backgroundColor: "white",
            color: "black",
            p: 0.5,
            borderBottom: "1px solid #afafaf",
            borderTop: "1px solid #afafaf",
          }}
        >
          {/* LEFT TITLE */}
          <Grid item md={5}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, textAlign: "start", pt: 0.5, ml: 1 }}
            >
              Overview of TurnOver Distribution - {filterBuyer}
            </Typography>
          </Grid>

          {/* RIGHT FILTERS GROUP */}
          <Grid
            item
            md={7}
            sx={{
              display: "flex",
              justifyContent: "flex-end", // push the group to the right
              alignItems: "center",
              pt: 0.5,
              pb: 0.4
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* FIN YEAR */}
              <DropdownWithSearch
                options={finYr?.data || []}
                labelField="finYr"
                label=""
                value={selectedYear}
                setValue={(val) => dispatch(setSelectedYear(val))}
              />

              {/* MONTH */}
              <FinYear
                selectedYear={selectedYear}
                selectmonths={selectMonths}
                setSelectmonths={(val) => dispatch(setSelectMonths(val))}
                autoFocusBuyer={autoFocusBuyer}
              />

              {/* COMPANY FILTER */}
              <DropdownWithSearch
                options={filterBuyerList || []}
                labelField="compname"
                label=""
                value={filterBuyer}
                className={`${filterBuyer ? "border-2 border-blue-600" : "border border-slate-300"
                  } w-full px-2 py-1 text-xs rounded-md focus:outline-none transition-all duration-200`}
                setValue={(val) => dispatch(setFilterBuyer(val))}
              />
            </Box>
          </Grid>
        </Grid>


      </div>

      {/* Child Components */}
      <Grid container className="" >
        <Grid item xs={12} md={6}>
          <EmpType1 key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CountryWisereport companyName={filterBuyer} finYear={selectedYear} key={filterBuyer} />
        </Grid>
      </Grid>
      <Grid container spacing={3}  >
        <Grid item xs={12} md={12}>
          <ItemWisereport key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
          />
        </Grid>
      </Grid>


      <Grid container className="" >
        <Grid item xs={12} md={6}>
          <SingleMonthWise key={filterBuyer} month={selectMonths}
            companyName={filterBuyer}
            finYear={selectedYear}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MonthWise key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
          />
        </Grid>

      </Grid>


      <Grid container className="" >
        <Grid item xs={12} md={6}>
          <QuarterWise key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
          />
        </Grid>

        
        <Grid item xs={12} md={6}>
          <YearWise key={filterBuyer}
            companyName={filterBuyer}
            finYear={selectedYear}
          />
        </Grid>



      </Grid>

    </>

  );
};

export default TurnOverIndex;
