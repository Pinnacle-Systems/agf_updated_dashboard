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
import {
  DropdownWithSearch,
  MultiSelectDropdown,
} from "../../../input/inputcomponent";
import {
  useGetMisDashboardSalaryDetQuery,
  useGetYearlyCompQuery,
} from "../../../redux/service/misDashboardService";
import { ColorContext } from "../../global/context/ColorContext";
import { useDispatch } from "react-redux";
import SunburstChart from "./detailedSalary";
import { FaUsers, FaUserTie } from "react-icons/fa";
import EmpType from "./Emptypesalart";
import DesignationSalary from "./DesignationSalary";
import AgeSalary from "./AgewiseSalary";
import OTwagessalary from "./OTWagesSalary";
import EmpType1 from "./Emptypesal";
// import CompanywiseEsi from "./Emptypesal";

const SalaryIndex = ({ companyName, Year }) => {
  const { color } = useContext(ColorContext);
  const [selectedState, setSelectedState] = useState("");
  const dispatch = useDispatch();
  const theme = useTheme();
  const [filterBuyer, setfilterBuyer] = useState(companyName);
  const [selectedYear, setSelectedYear] = useState(Year);
  const [readOnly, setReadonly] = useState(false);

  const { data: result } = useGetYearlyCompQuery({ params: {} });

  const { data: Salary, isLoading } = useGetMisDashboardSalaryDetQuery({
    params: {
      filterBuyer: filterBuyer,
    },
  });

  const SalaryData = Salary?.data || [];

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
           top: "30px",   // set to height of tab list
    zIndex: 50,
    backgroundColor: "white"
          
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            backgroundColor: "white",
            color: "black",
            p:.5,
            borderBottom:"1px solid #afafaf",
            borderTop:"1px solid #afafaf"

            
          }}
        >
          <Grid item md={8}>
            <Box sx={{p:0,backgroundColor:""}}>
                      <Typography variant="h4" sx={{ fontWeight: 600,textAlign:"start",mt:.5,ml:1 }}>
                        Overview of Salary Distribution -{filterBuyer}
                      </Typography>
                      {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        You have{' '}
                        <span style={{ color: '#E53935', fontWeight: 600 }}>21</span> Pending Approvals &{' '}
                        <span style={{ color: '#E53935', fontWeight: 600 }}>14</span> Leave Requests
                      </Typography> */}
                    </Box>
          </Grid>

          <Grid item md={4}>
            <Grid container spacing={0}>

             <Grid item md={4}>
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
          <Grid item md={4}>
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

          <Grid item md={4}>
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
      <div>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <SunburstChart
              companyName={filterBuyer}
              selectedState={selectedState}
              salaryDet={SalaryData}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <DesignationSalary
              companyName={filterBuyer}
              selectedState={selectedState}
              salaryDet={SalaryData}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <OTwagessalary
              companyName={filterBuyer}
              selectedState={selectedState}
            />
          </Grid>
          <Grid item md={3}>
            <Grid container spacing={1}>
              <Grid item md={12}>
                <AgeSalary
                  companyName={filterBuyer}
                  selectedState={selectedState}
                  salaryDet={SalaryData}
                />
              </Grid>
              {/* <Grid item md={12}>
                <EmpType
                  companyName={filterBuyer}
                  selectedState={selectedState}
                  salary={SalaryData}
                />
              </Grid> */}
            </Grid>
          </Grid>
          <Grid item md={3}>
            <EmpType1 companyName={filterBuyer}
            selectedState={selectedState}
                  salary={SalaryData}/>
          </Grid>

          
        </Grid>
      </div>
    </>
  );
};
export default SalaryIndex;
