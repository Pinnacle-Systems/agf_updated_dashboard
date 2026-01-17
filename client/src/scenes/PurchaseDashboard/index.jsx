import { Grid } from "@mui/material"
import Trophy from "../maindashboard/Trophy.js"
import StatisticsCard from "../maindashboard/StatisticsCard.js"
import CardStatisticsVerticalComponent from "../../components/CardStatsVertical.js";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Poll } from "@mui/icons-material";
import { useGetPurchaseOrderLoadDataQuery } from "../../redux/service/purchaseOrder.js";
import DashboardHeader from "./DashboardHeader.jsx";
import { useGetFinYearQuery } from "../../redux/service/misDashboardService.js";
import { useState } from "react";
import SupplierDetails from "./Supplier/SupplierDetails.jsx";
import SupplierDetailsMonth from "./Supplier/SupplierDetailsMonth.jsx";
import RejectedPO from "./InComplete/RejectedPO.jsx";

const index = () => {
  const [selectedYear, setSelectedYear] = useState("25-26");
  const [selectMonths, setSelectMonths] = useState("")
  const { data: finYear } = useGetFinYearQuery()
  const {
    data: loadData,
    isFetching,
    isLoading,
  } = useGetPurchaseOrderLoadDataQuery({
    params: {
    },
  });
  return (
    <div className="w-full  rounded-md shadow-lg py-1 overflow-y-auto">
      <Grid container spacing={1} gap={1}>

        <Grid item xs={12} md={12} >
          <DashboardHeader selectedYear={selectedYear} setSelectedYear={setSelectedYear} finYear={finYear} selectMonths={selectMonths} setSelectMonths={setSelectMonths} />
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <Trophy />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>  */}
        <Grid container sx={{ paddingX: 1 }}>
          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<Poll />}
              color="warning"
              // trendNumber="+42%"
              title="Orders"
              subtitle="Current Month Orders"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CardStatisticsVerticalComponent
              stats="$78"
              title="Received"
              trend="negative"
              color="info"
              // trendNumber="-15%"
              subtitle="Received POs"
              icon={<ImportExportIcon />}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<Poll />}
              color="primary"
              // trendNumber="+42%"
              title="Pending"
              subtitle="Pending POs"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <CardStatisticsVerticalComponent
              stats="$25.6k"
              icon={<CurrencyUsd />}
              color="success"
              // trendNumber="+42%"
              title="Expense"
              subtitle="Past Month Expense"
            />
          </Grid>

        </Grid>
        <Grid container spacing={1} sx={{ marginX: 1 }}>
          <Grid item xs={12} md={6}>
            <SupplierDetails selectedYear={selectedYear} setSelectedYear={setSelectedYear} finYear={finYear} selectmonths={selectMonths} setSelectmonths={setSelectMonths} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SupplierDetailsMonth selectedYear={selectedYear} setSelectedYear={setSelectedYear} finYear={finYear} selectmonths={selectMonths} setSelectmonths={setSelectMonths} />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ marginX: 1 }}>
          <Grid item xs={12} md={6}>
            <RejectedPO selectedYear={selectedYear} setSelectedYear={setSelectedYear} finYear={finYear} selectmonths={selectMonths} setSelectmonths={setSelectMonths} />
          </Grid>
         
        </Grid>
      </Grid>
    </div>
  )
}

export default index