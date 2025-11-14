import {
  Avatar,
  Box,
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

const DetailedHeadcount = ({ companyName }) => {
  const { color } = useContext(ColorContext);
  const dispatch = useDispatch();
  const [detailedpage, setDetailedpage] = useState({});
  const theme = useTheme();
  const [chartData, setChartData] = useState({ male: [], female: [] });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStats, setTotalStats] = useState({
    totalMale: 0,
    totalFemale: 0,
    total: 0,
  });
  const [filterBuyer, setFilterBuyer] = useState([]);
  const [readOnly, setReadonly] = useState(false);
  const params = getCommonParams();

  const { userId, isSuperAdmin } = params;

  const { data: compCode } = useGetCompCodeDataQuery(
    { userId: isSuperAdmin ? false : userId },
    { skip: !isSuperAdmin && !userId }
  );

  //   console.log(compCode.data,"compCode");

//   useEffect(() => {
//     if (companyName) {
//       setFilterBuyer(companyName);
//     }
//   }, [companyName]);

// setFilterBuyer(
//         compCode?compCode?.map((item) => {
//               return {
//                 value: item.com,
//                 label: item.com
//               };
//             })
//           : []
//       )
  console.log("Opened for company:", filterBuyer);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:9008/misDashboard/yearlyComp"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        // console.log(response.data, "getEmploy deatil");

        const result = await response.json();
        // console.log(result.data, "getEmploy deatil");
        if (result.statusCode === 0 && result.data) {
          const compdetail = result.data.find(
            (item) => item.customer === companyName
          );
          // console.log(compdetail,"compdetail");
          setDetailedpage(compdetail);

          const apiCategories = result.data.map((item) => item.customer);
          const maleData = result.data.map((item) => item.male);
          const femaleData = result.data.map((item) => item.female);
          const totalMale = maleData.reduce((sum, val) => sum + val, 0);
          const totalFemale = femaleData.reduce((sum, val) => sum + val, 0);

          setCategories(apiCategories);
          setChartData({ male: maleData, female: femaleData });
          setTotalStats({
            totalMale,
            totalFemale,
            total: totalMale + totalFemale,
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyName]);
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
          title={`Overview - ${companyName || ""}`}
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
          <MultiSelectDropdown
            name="Allocation Company List"
            readOnly={readOnly}
            options={multiSelectOption(
              compCode ? compCode.data : [],
              "com",
              "com"
            )}
            selected={filterBuyer}
            setSelected={setFilterBuyer}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={2}>
              <StatBox
                icon={<IoIosPeople size={40} />}
                value={detailedpage?.total}
                label="Head Count"
                color={color}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <StatBox
                icon={<BiMaleSign size={40} />}
                value={detailedpage?.male}
                label="Total Male"
                color={color}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <StatBox
                icon={<IoMdFemale size={40} />}
                value={detailedpage?.female}
                label="Total Female"
                color={color}
              />
            </Grid>
          </Grid>
          <Grid>{/* <HeadcountDept companyName={filterBuyer} /> */}</Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <DeptHeadCount companyName={filterBuyer} />
            </Grid>
            <Grid item md={5}>
              <EmployeeByDepartment />
            </Grid>
            <Grid item xs={12} md={4}>
              {/* <CompanywiseEsi companyName={filterBuyer} /> */}
            </Grid>
            <Grid item xs={12} md={4}>
              {/* <Companywisessalary companyName={filterBuyer} /> */}
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
export default DetailedHeadcount;
