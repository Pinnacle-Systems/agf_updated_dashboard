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
  useGetEsiPf1Query,
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
import DetailedESI from "./DetailedESI";
import { FaUsers, FaUserTie } from "react-icons/fa";
import DeptESI from "./deptESI";
import EmployerESI from "./EmployerESi";
import DeptmentESI from "./DepiEST";
import AgeESI from "./AgewiseESI";

const DetailedDashBoard = ({ companyName, Year }) => {
  
  const [filterBuyer, setfilterBuyer] = useState(companyName);
  const [selectedYear, setSelectedYear] = useState(Year);
  const [selectedState, setSelectedState] = useState("");
  const [readOnly, setReadonly] = useState(false);

  const { data: result } = useGetYearlyCompQuery({ params: {} });

  const { data: ESIyeardata } = useGetEsiPf1Query({
    params: {
      filterSupplier: filterBuyer,
      filterYear: selectedYear,
    },
  });

  const ESIdata = ESIyeardata?.data || [];

  // console.log(ESIdata,"Esidata");

  const filterBuyer1 = result?.data?.map((item) => item.customer) || [];

  const chartData = Object.entries(filterBuyer1 || {}).map(([id, company]) => ({
    compname: company,
    id: company,
  }));
  useEffect(() => {
    setfilterBuyer(companyName);
  }, [companyName]);

  const optionsArray = Object.values(chartData);

  const handleFilterClick = (type) => {
    setSelectedState(type);
  };

  useEffect(() => {}, [filterBuyer]);

  const { data: finYr } = useGetFinYrQuery();

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
        className=" mt-2"
        style={{
          position: "sticky",
          top: "30px", // set to height of tab list
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
          <Grid item md={6}>
            <Box sx={{ p: 0, backgroundColor: "" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, textAlign: "start", mt: 0.5, ml: 1 }}
              >
                Overview of ESI Contribution -{filterBuyer}
              </Typography>
            </Box>
          </Grid>

          <Grid item md={6}>
            <Grid container spacing={1}>
              <Grid item md={2}>
                <button
                  onClick={() => handleFilterClick("Labour")}
                  className={`flex items-center gap-2 px-5 py-2  text-[11px] font-semibold rounded-full shadow-md transition-all 
                          ${
                            selectedState === "Labour"
                              ? "bg-blue-600 text-white scale-105"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }
                          focus:outline-none focus:ring-2 focus:ring-blue-400`}
                >
                  <FaUserTie size={14} /> Employees
                </button>
              </Grid>
              <Grid item md={2}>
                <button
                  onClick={() => handleFilterClick("Staff")}
                  className={`flex items-center gap-2 px-5 py-2  ml-4  text-xs font-semibold rounded-full shadow-md transition-all 
                          ${
                            selectedState === "Staff"
                              ? "bg-blue-600 text-white scale-105"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }
                          focus:outline-none focus:ring-2 focus:ring-blue-400`}
                >
                  <FaUsers size={16} /> Staff
                </button>
              </Grid>
              <Grid item md={2}>
                <button
                  onClick={() => handleFilterClick("All")}
                  className={`flex items-center gap-2 px-5 py-2  ml-4  text-xs font-semibold rounded-full shadow-md transition-all 
                          ${
                            selectedState === "All"
                              ? "bg-blue-600 text-white scale-105"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }
                          focus:outline-none focus:ring-2 focus:ring-blue-400`}
                >
                  <FaUsers size={16} /> All
                </button>
              </Grid>
              <Grid item md={2}>
                <DropdownWithSearch
                  options={finYr?.data || []}
                  labelField={"finYr"}
                  // required={true}
                  label={""}
                  value={selectedYear}
                  setValue={setSelectedYear}
                  className="mt-1"
                  // disabled={readonly}
                />
              </Grid>

              <Grid item md={3}>
                <DropdownWithSearch
                  options={optionsArray || []}
                  labelField={"compname"}
                  // required={true}
                  label={""}
                  value={filterBuyer}
                  setValue={setfilterBuyer}
                  // disabled={readonly}
                  className="mt-1"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <Grid container spacing={1}>
        <Grid item xs={12} md={5}>
          <Grid container spacing={1}>
            <Grid item md={12}>
              <DetailedESI
                selectedYear1={selectedYear}
                companyName={filterBuyer}
                ESIdata={ESIdata}
                selectedState={selectedState}
              />
            </Grid>
            <Grid item md={12}>
              <DeptmentESI
                selectedYear1={selectedYear}
                companyName={filterBuyer}
                ESIdata={ESIdata}
                selectedState={selectedState}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={1}>
            <Grid item md={12}>
              <DeptESI
                selectedYear1={selectedYear}
                companyName={filterBuyer}
                ESIdata={ESIdata}
                selectedState={selectedState}
              />
            </Grid>
            <Grid item md={6}>
              <AgeESI
                selectedYear1={selectedYear}
                companyName={filterBuyer}
                ESIdata={ESIdata}
                selectedState={selectedState}
              />
            </Grid>
            <Grid item md={6}>
              <EmployerESI
                selectedYear1={selectedYear}
                companyName={filterBuyer}
                ESIdata={ESIdata}
                selectedState={selectedState}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default DetailedDashBoard;
