import { Avatar, Box, Grid, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DropdownWithSearch } from "../../../input/inputcomponent";
import {
  useGetEsiPfQuery,
  useGetHeadCountDetailQuery,
  useGetYearlyCompQuery,
} from "../../../redux/service/misDashboardService";
import { ColorContext } from "../../global/context/ColorContext";
import { useDispatch } from "react-redux";
import { useGetFinYrQuery } from "../../../redux/service/poData";
import { FaUsers, FaUserTie } from "react-icons/fa";
import DeptHeadCount from "./DeptHead";
import EmptypeHead from "./EmptypeHead";
import HeadcountDept from "./HeadCountDept";
import AgeHead from "./AgeHeadcount";
import BGhead from "./BloodwiseHead";
import DesgHead from "./desnhead";
import RegionHead from "./RegionHead";
import ExperienceHead from "./ExperienceHead";

const DetailedHeadcount = ({ companyName, Year }) => {
  const { color } = useContext(ColorContext);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [filterBuyer, setfilterBuyer] = useState(companyName);
  const [selectedYear, setSelectedYear] = useState(Year);
  const [selectedState, setSelectedState] = useState("");
  const [readOnly, setReadonly] = useState(false);

  const { data: result } = useGetYearlyCompQuery({ params: {} });

  const { data: HeadDetail } = useGetHeadCountDetailQuery({
    params: { compCode: filterBuyer },
  });

  const PFyeardata = HeadDetail?.data || [];

  console.log(PFyeardata, "PFyeardata");

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
          <Grid item md={7}>
            <Box sx={{ p: 0, backgroundColor: "" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, textAlign: "start", mt: 0.5, ml: 1 }}
              >
                Overview of HeadCount -{filterBuyer}
              </Typography>
            </Box>
          </Grid>

          <Grid item md={5}>
            <Grid container spacing={1}>
              <Grid item md={3}>
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
              <Grid item md={3}>
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
              <Grid item md={3}>
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
              {/* <Grid item md={2}>
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
              </Grid> */}

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
        <Grid item xs={6} md={5}>
          <Grid container spacing={1}>
            <Grid item md={12}>
              <HeadcountDept
                companyName={filterBuyer}
                HeadData={PFyeardata}
                selectedState={selectedState}
              />
            </Grid>
            <Grid item md={12}>
              <Grid container spacing={1}>
                <Grid item md={5}>
                  <EmptypeHead
                    companyName={filterBuyer}
                    HeadData={PFyeardata}
                    selectedState={selectedState}
                  />
                </Grid>
                <Grid item md={7}>
                  <AgeHead
                    companyName={filterBuyer}
                    HeadData={PFyeardata}
                    selectedState={selectedState}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={7}>
          <DeptHeadCount
            selectedYear1={selectedYear}
            companyName={filterBuyer}
            HeadData={PFyeardata}
            selectedState={selectedState}
          />
        </Grid>
        <Grid md={12}>
        <DesgHead
          companyName={filterBuyer}
          HeadData={PFyeardata}
          selectedState={selectedState}
        />
        </Grid>
        <Grid item xs={6} md={4}>
          <BGhead
            companyName={filterBuyer}
            HeadData={PFyeardata}
            selectedState={selectedState}
          />
        </Grid>
        {/* <Grid item xs={6} md={3}>
          <Grid container spacing={1}>
            <Grid item md={12}>
              <EmptypeHead
                companyName={filterBuyer}
                HeadData={PFyeardata}
                selectedState={selectedState}
              />
            </Grid>
            <Grid item md={12}>
              <AgeHead
                companyName={filterBuyer}
                HeadData={PFyeardata}
                selectedState={selectedState}
              />
            </Grid>
          </Grid>
        </Grid> */}
        <Grid item xs={12} md={4}>
          <RegionHead
            companyName={filterBuyer}
            HeadData={PFyeardata}
            selectedState={selectedState}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ExperienceHead
            companyName={filterBuyer}
            HeadData={PFyeardata}
            selectedState={selectedState}
          />
        </Grid>
        
      </Grid>
    </>
  );
};
export default DetailedHeadcount;
