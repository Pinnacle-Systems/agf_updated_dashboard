import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Icon,
  Typography,
  useTheme,
} from "@mui/material";

import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Woman2Icon from "@mui/icons-material/Woman2";
import { GrUserFemale } from "react-icons/gr";
import { BiMaleSign } from "react-icons/bi";
import { ColorContext } from "../../global/context/ColorContext";
import { IoMdFemale } from "react-icons/io";
import { IoIosPeople } from "react-icons/io";
import { useGetYearlyCompQuery } from "../../../redux/service/misDashboardService";
import DeptHeadCount from "./DeptHead";
import EmployeeByDepartment from "./StautusofEmploy";
import CompAttrition from "../Attrition/CompanyAttrition";
import { DropdownWithSearch, DropdownWithSearch3 } from "../../../input/inputcomponent";

const HeadcountDept = ({ companyName }) => {
  const { color } = useContext(ColorContext);
  const dispatch = useDispatch();
  const [filterBuyer, setfilterBuyer] = useState({});
  const theme = useTheme();

  const { data: result } = useGetYearlyCompQuery({ params: {} });
  // console.log(result, "result");

  const detailedpage = result?.data.find(
    (item) => item.customer === companyName
  );

  const filterBuyer1=result?.data.map((item)=>item.customer)

  // console.log(filterBuyer1,"filterBuyer");

const chartData = Object.entries(filterBuyer1).map(([id,company]) => ({
    compname: company,
    id: company,
  }));
  
  const optionsArray = Object.values(chartData);
  
  console.log(filterBuyer,"filterBuyer");



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
      <Card sx={{ p: 1 }}>
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
          {/* <Grid item xs={12} md={2}>
            <DropdownWithSearch3
                            options={optionsArray || []}
                            labelField={"compname"}
                            // required={true}
                            label={"Select company"}
                            value={filterBuyer}
                            setValue={setfilterBuyer}
                            // disabled={readonly}
                          />
          </Grid> */}
        </Grid>

        
      </Card>
    </>
  );
};

export default HeadcountDept;
