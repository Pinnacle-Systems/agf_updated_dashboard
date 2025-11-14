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

const HeadcountDept = ({companyName}) => {
      
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

            const compdetail= result.data.find((item)=>item.customer === companyName)
            // console.log(compdetail,"compdetail");
            setDetailedpage(compdetail)
            

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
        borderRadius:50,
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
      <Card sx={{p:1}}>
        
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
      </Card>
    </>
  );
};

export default HeadcountDept;
