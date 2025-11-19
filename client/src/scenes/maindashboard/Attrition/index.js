import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import DotsVertical from "mdi-material-ui/DotsVertical";
import {
  DropdownWithSearch,
  MultiSelectDropdown,
} from "../../../input/inputcomponent";
import { useGetCompCodeDataQuery } from "../../../redux/service/commonMasters";
import { getCommonParams, multiSelectOption } from "../../../utils/hleper";
import { effect } from "@chakra-ui/system";
import { useEditable } from "@chakra-ui/react";

import {
  useGetMisDashboardEsiDetQuery,
  useGetMisDashboardSalaryDetQuery,
  useGetYearlyCompQuery,
} from "../../../redux/service/misDashboardService";
import GenderDistributionChart from "../WeeklyOverview";

import HeadcountDept from "../Headcount/HeadCountDept";
import DeptHeadCount from "../Headcount/DeptHead";
import EmployeeByDepartment from "../Headcount/StautusofEmploy";
import CompAttrition from "../Attrition/CompanyAttrition";
import { ColorContext } from "../../global/context/ColorContext";
import { useDispatch } from "react-redux";
import { IoIosPeople, IoMdFemale } from "react-icons/io";
import { BiMaleSign } from "react-icons/bi";
import DropdownData from "../../../Ui Component/modelUi";
import { useGetFinYrQuery } from "../../../redux/service/poData";

const DetailedAttribution = ({ companyName }) => {
  const { color } = useContext(ColorContext);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [filterBuyer, setfilterBuyer] = useState(companyName);
  const [selectedYear, setSelectedYear] = useState();
  const [readOnly, setReadonly] = useState(false);

  const { data: result } = useGetYearlyCompQuery({ params: {} });

  const filterBuyer1 = result?.data.map((item) => item.customer);

  const chartData = Object.entries(filterBuyer1).map(([id, company]) => ({
    compname: company,
    id: company,
  }));
  useEffect(() => {
    setfilterBuyer(companyName);
  }, [companyName]);

  const { data: finYr } = useGetFinYrQuery();

  console.log(finYr, "useGetFinYrQuery");

  const optionsArray = Object.values(chartData);

  useEffect(() => {}, [filterBuyer]);


  console.log("Opened for company:", filterBuyer,selectedYear);

  const StatBox = ({ icon: Icon, value, label, color }) => (
    <Box
      sx={{
        p: 1,
        borderRadius: 3,
        background: "#DE5959",
        display: "flex",
        alignItems: "center",
        gap: 2,
        boxShadow: 2,
        height: "100%",
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          //   mr: 3,
          borderRadius: 50,
          width: 50,
          height: 50,
          boxShadow: 3,
          color: "common.black",
          backgroundColor: "white",
        }}
      >
        {Icon}
      </Avatar>

      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <div
        style={{}}
      >
        <CardContent sx={{ p: 1, my: "auto" }}>
          <Grid
            container
            spacing={3}
            sx={{
              color: "black",
              // py: 1,
              borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
              // pb: 1,
            }}
          >
            <Grid item md={8}>
              <CardHeader
                title={`Overview of Headcount - ${filterBuyer}`}
                titleTypographyProps={{
                  sx: { fontSize: "1.1rem", fontWeight: 600 },
                }}
                // action={
                //   <Tooltip title="Options">
                //     <IconButton sx={{ color: "#fff" }}>
                //       <DotsVertical />
                //     </IconButton>
                //   </Tooltip>
                // }
              />
            </Grid>
            <Grid item md={2}>
              <DropdownWithSearch
                options={finYr?.data || []}
                labelField={"finYr"}
                // required={true}
                label={"Select Year"}
                value={selectedYear}
                setValue={setSelectedYear}
                // disabled={readonly}
              />
            </Grid>
            <Grid item md={2}>
              <DropdownWithSearch
                options={optionsArray || []}
                labelField={"compname"}
                // required={true}
                label={"Select company"}
                value={filterBuyer}
                setValue={setfilterBuyer}
                // disabled={readonly}
              />
            </Grid>
            {/* <Grid item md={2}>
              <Button
                variant="contained"
                //   startIcon={<AddCircleOutlineIcon />}
                sx={{
                    mt:1,ml:1,p:1,
                  backgroundColor: "#446D7F",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#365A6A" },
                }}
              >
                Show
              </Button>
            </Grid> */}
          </Grid>
          <Grid>
            {/* <HeadcountDept
                companyName={filterBuyer }
                /> */}
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
                            <CompAttrition selectedYear1={selectedYear}companyName={filterBuyer} />
            </Grid>
            <Grid item md={5}>
              {/* <EmployeeByDepartment /> */}
            </Grid>
            <Grid item xs={12} md={4}>
              {/* <CompanywiseEsi companyName={filterBuyer} /> */}
            </Grid>
            <Grid item xs={12} md={4}>
              {/* <Companywisessalary companyName={filterBuyer} /> */}
            </Grid>
            <Grid item xs={12} md={4}>
              
            </Grid>
          </Grid>
        </CardContent>
      </div>
    </>
  );
};
export default DetailedAttribution;
