
import Grid from "@mui/material/Grid";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";

import CardStatisticsVerticalComponent from "../../components/CardStatsVertical.js";

import Trophy from "../../scenes/maindashboard/Trophy.js";
// import TotalEarning from '../../scenes/maindashboard/TotalEarning.js'
import StatisticsCard from "../../scenes/maindashboard/StatisticsCard.js";

import { Poll } from "@mui/icons-material";
import DashboardHeader from "./DashboardHeader.js";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HeadCount from "./Headcount/HeadCount.jsx";
import HomeAttrition from "./Attrition/HomeAttrition.jsx";
// import HomeESI from './EmployeeDetail/ESI Det.js'
import HomePF from "./PFdata/HomePF.jsx";
import HomeESI from "./ESIdata/ESI Det.js";

import HomeSalary from "./salarydata/TurnOver.jsx";
import {
  useGetYearlyCompQuery,
} from "../../redux/service/misDashboardService";
import { useEffect, useState } from "react";

import { getCommonParams } from "../../utils/hleper";
import { useGetFnameQuery } from "../../redux/service/user";
import { useGetFinYrQuery } from "../../redux/service/poData";

const GarmentsDashboard = () => {
  const [user, setUser] = useState(null);
  const params = getCommonParams();
  const { isSuperAdmin, employeeId } = params;

  const { data: userName } = useGetFnameQuery({
    params: { employeeId },
  });

  useEffect(() => {
    if (!isSuperAdmin && userName?.data?.length) {
      const usernameObj = userName.data.find((x) => x.userName);
      if (usernameObj) setUser(usernameObj.userName);
    }
  }, [isSuperAdmin, userName]);

  /* ---------------- FILTER STATE ---------------- */
  const [filterBuyer, setFilterBuyer] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectMonths, setSelectMonths] = useState( "");

  const { data: result } = useGetYearlyCompQuery({ params: {} });
  const { data: finYr } = useGetFinYrQuery();

  // useEffect(() => {
  //   setFilterBuyer(companyName);
  // }, [companyName]);

  // useEffect(() => {
  //   setSelectMonths(selectedmonth || "");
  // }, [selectedmonth]);

  const filterBuyerList =
    result?.data?.map((item) => ({
      compname: item.customer,
      id: item.customer,
    })) || [];
  return (
    <div className="w-full  mx-auto rounded-md shadow-lg py-1 overflow-y-auto">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <DashboardHeader filterBuyer={filterBuyer} setFilterBuyer={setFilterBuyer} selectedYear={selectedYear} setSelectedYear={setSelectedYear} user={user}
          selectMonths={selectMonths} setSelectMonths={setSelectMonths} filterBuyerList={filterBuyerList} finYr={finYr}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
        <Grid container spacing={1} sx={{ mt: 1, ml: 1 }}>
          <Grid item xs={12} md={3}>
            <CardStatisticsVerticalComponent
              stats="$78"
              title="Revenue"
              trend="negative"
              color="secondary"
              trendNumber="-15%"
              subtitle="Past Month"
              icon={<CurrencyUsd />}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<ReceiptLongIcon />}
              color="success"
              trendNumber="+42%"
              title="Expense"
              subtitle="Weekly Profit"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<Poll />}
              color="primary"
              trendNumber="+42%"
              title="Sales"
              subtitle="Weekly Profit"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<Poll />}
              color="warning"
              trendNumber="+42%"
              title="Orders"
              subtitle="Weekly Profit"
            />
          </Grid>

        </Grid>

        <Grid item xs={12} md={7}>
          <HomeSalary />
        </Grid>

        <Grid item xs={12} md={5}>
          <HomeESI />
        </Grid>
        <Grid item xs={12} md={4} >
          <HomePF />
        </Grid>
        <Grid item xs={12} md={4}>
          <HeadCount />
        </Grid>
        <Grid item xs={12} md={4}>
          <HomeAttrition />
        </Grid>
        <Grid item xs={12} md={6} >
          {/* <HomeRegion /> */}
        </Grid>

        <Grid item xs={12} md={6} >
          {/* <Table /> */}
          {/* <HomeOTWages/> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default GarmentsDashboard;
