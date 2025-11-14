import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
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
// import LeaveDetailsCard from "../EmployeeDetail/";
import EmployeeDetail from "./EmployDetail";
import CompanywiseEsi from "./companywiseEsi";
import CompanywiseStrenth from "./companywiseStrenth";
import Companywisessalary from "./companywisalary";
import HeadcountDept from "../Headcount/HeadCountDept";
import DeptHeadCount from "../Headcount/DeptHead";
import EmployeeByDepartment from "../Headcount/StautusofEmploy";
import CompAttrition from "../Attrition/CompanyAttrition";

const DetailedDashBoard = ({ companyName }) => {
  const [filterBuyer, setFilterBuyer] = useState([]);
  const [readOnly, setReadonly] = useState(false);
  const params = getCommonParams();

  const { userId, isSuperAdmin } = params;

  const { data: compCode } = useGetCompCodeDataQuery(
    { userId: isSuperAdmin ? false : userId },
    { skip: !isSuperAdmin && !userId }
  );
  useEffect(() => {
    if (companyName) {
      setFilterBuyer(companyName);
    }
  }, [companyName]);
  console.log("Opened for company:", filterBuyer);

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          width: "100%",
          maxWidth: 1200,
          mx: 1,
        }}
      >
        <CardHeader
          title="OverView "
          sx={{
            color: "black",
            py: 1,
          }}
          titleTypographyProps={{
            sx: { fontSize: "1.1rem", fontWeight: 600 },
          }}
          action={
            <Tooltip title="Options">
              <IconButton sx={{ color: "#fff" }}>
                <DotsVertical />
              </IconButton>
            </Tooltip>
          }
        />
        <CardContent sx={{ p: 2, my: "auto" }}>
          {/* <MultiSelectDropdown
            name="Allocation Company List"
            readOnly={readOnly}
            options={multiSelectOption(
              compCode ? compCode?.data : [],
              "com",
              "com"
            )}
            selected={filterBuyer}
            setSelected={setFilterBuyer}
          /> */}
          <Grid>
            <HeadcountDept companyName={filterBuyer} />
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <DeptHeadCount companyName={filterBuyer} />
            </Grid>
            <Grid item md={5}>
              <EmployeeByDepartment />
            </Grid>
            <Grid item xs={12} md={4}>
              <CompanywiseEsi companyName={filterBuyer} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Companywisessalary companyName={filterBuyer} />
            </Grid>
            <Grid item xs={12} md={4}>
              <CompAttrition companyName={filterBuyer} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
export default DetailedDashBoard;
