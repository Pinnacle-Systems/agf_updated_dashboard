import {
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { DropdownWithSearch } from "../../input/inputcomponent";
import FinYear from "../../components/FinYear";
const DashboardHeader = ({ filterBuyer, setFilterBuyer, selectedYear, setSelectedYear,
  selectMonths, setSelectMonths, filterBuyerList, finYr, user }) => {

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1.5,
        backgroundColor: "#fff",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* LEFT : USER */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar src="/images/avatars/1.png" sx={{ width: 48, height: 48 }} />
        <Typography fontWeight={600}>
          Welcome Back, {user || "SuperAdmin"} 👋
        </Typography>
      </Box>

      {/* RIGHT : OVERVIEW + FILTERS */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          whiteSpace: "nowrap",
        }}
      >
        {/* OVERVIEW */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mr: 1,
            width: "220px",
            fontSize: "17px"
          }}
        >
          Overview of ERP – {filterBuyer || ""}
        </Typography>

        {/* FIN YEAR */}
        <DropdownWithSearch
          options={finYr?.data || []}
          labelField="finYr"
          value={selectedYear}
          setValue={setSelectedYear}
        />

        {/* MONTH */}
        <FinYear
          selectedYear={selectedYear}
          selectmonths={selectMonths}
          setSelectmonths={setSelectMonths}
        // autoFocusBuyer={autoFocusBuyer}
        />

        {/* COMPANY */}
        <DropdownWithSearch
          options={filterBuyerList}
          labelField="compname"
          value={filterBuyer}
          setValue={setFilterBuyer}
        />
      </Box>
    </Box>
  );
};

export default DashboardHeader;
