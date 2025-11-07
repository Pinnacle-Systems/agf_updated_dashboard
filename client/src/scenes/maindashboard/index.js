    // ** MUI Imports
    import Grid from '@mui/material/Grid'

    // ** Icons Imports
    import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
    // import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

    import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
    import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

    // ** Custom Components Imports
    import CardStatisticsVerticalComponent from '../../components/CardStatsVertical.js'

    // ** Styled Component Import
    import ApexChartWrapper from '../../components/ApexChartWrapper.js'
    import YearlyComChart from '../MisDashboard/comParision/YearlyCompChart.jsx'
    import SalesByCountries from './SalesByCountries.js'

    // ** Demo Components Imports
    import Table from '../../scenes/maindashboard/Table.js'
    import Trophy from '../../scenes/maindashboard/Trophy.js'
    // import TotalEarning from '../../scenes/maindashboard/TotalEarning.js'
    import StatisticsCard from '../../scenes/maindashboard/StatisticsCard.js'
    import WeeklyOverview from '../maindashboard/WeeklyOverview.js'
    import DepositWithdraw from '../../scenes/maindashboard/DepositWithdraw.js'
    import { Poll } from '@mui/icons-material'
import DashboardHeader from './DashboardHeader.js'
import LeaveDetailsCard from './EmployeeDetail/LeaveDetailsCard.js'
    // import SalesByCountries from 'src/views/dashboard/SalesByCountries'

    const Main_Dashboad = () => {
      return (
        <ApexChartWrapper>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <DashboardHeader/>
            </Grid>
            <Grid item xs={12} md={4}>
              <Trophy />
            </Grid>
            <Grid item xs={12} md={8}>
              <StatisticsCard />
            </Grid>
            <Grid item xs={12} md={6} lg={7}>
              <WeeklyOverview />
            </Grid>
            {/* <Grid item xs={12} md={6} lg={4}>
              <TotalEarning />
            </Grid> */}
            <Grid item xs={12} md={6} lg={5}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <CardStatisticsVerticalComponent
                    stats='$25.6k'
                    icon={<Poll />}
                    color='success'
                    trendNumber='+42%'
                    title='Total Profit'
                    subtitle='Weekly Profit'
                  />

                </Grid>
                <Grid item xs={6}>
                  <CardStatisticsVerticalComponent
                    stats='$78'
                    title='Refunds'
                    trend='negative'
                    color='secondary'
                    trendNumber='-15%'
                    subtitle='Past Month'
                    icon={<CurrencyUsd />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CardStatisticsVerticalComponent
                    stats='862'
                    trend='negative'
                    trendNumber='-18%'
                    title='New Project'
                    subtitle='Yearly Project'
                    icon={<BriefcaseVariantOutline />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CardStatisticsVerticalComponent
                    stats='15'
                    color='warning'
                    trend='negative'
                    trendNumber='-18%'
                    subtitle='Last Week'
                    title='Sales Queries'
                    icon={<HelpCircleOutline />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CardStatisticsVerticalComponent
                    stats='15'
                    color='warning'
                    trend='negative'
                    trendNumber='-18%'
                    subtitle='Last Week'
                    title='Sales Queries'
                    icon={<HelpCircleOutline />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CardStatisticsVerticalComponent
                    stats='15'
                    color='warning'
                    trend='negative'
                    trendNumber='-18%'
                    subtitle='Last Week'
                    title='Sales Queries'
                    icon={<HelpCircleOutline />}
                  />
                </Grid>

              </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <LeaveDetailsCard/>
                            {/* <SalesByCountries /> */}
            </Grid>
            <Grid item xs={12} md={12} lg={8}>
              <DepositWithdraw />
            </Grid>
            <Grid item xs={12}>
              <Table />
            </Grid>
          </Grid>
        </ApexChartWrapper>
      )


    }

    export default Main_Dashboad





