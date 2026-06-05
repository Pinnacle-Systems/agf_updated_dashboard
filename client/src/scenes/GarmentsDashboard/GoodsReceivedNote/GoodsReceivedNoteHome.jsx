import React, { useMemo } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFilterBuyer, setSelectedYear } from "../../../redux/features/dashboardFiltersSlice";

import GeneralGRNCard from "./GeneralGRNCard";
import GreyFabricGRNCard from "./GreyFabricGRNCard";
import GreyYarnGRNCard from "./GreyYarnGRNCard";
import DyedYarnGRNCard from "./DyedYarnGRNCard";
import DyedFabricGRNCard from "./DyedFabricGRNCard";
import AccessoryGRNCard from "./AccessoryGRNCard";
import CuttingPrintingGRNCard from "./CuttingPrintingGRNCard";
import KnittingStoreGRNCard from "./KnittingStoreGRNCard";
import EmbroideryAccessoryCard from "./EmbroideryAccessoryCard";

const GoodsReceivedNoteHome = ({
  companyName,
  finYear,
  selectedYear,
  filterBuyer,
  user,
  selectMonths,
  filterBuyerList,
  finYr,
}) => {

  console.log("filterBuyerList", filterBuyerList);

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.dashboardFilters);

  const activeCompany = filters.filterBuyer || companyName || "VEL";
  const activeYear = filters.selectedYear || selectedYear || "2024-25";

  const handleCompanyChange = (e) => {
    dispatch(setFilterBuyer(e.target.value));
  };

  return (
    <Box m="20px">
      {/* Sticky top filters bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        mb={3}
        bgcolor="background.paper"
        borderRadius="8px"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
      >
        <Typography variant="h5" fontWeight="600" color="text.primary">
          Goods Received Note (Outside Suppliers)
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {/* YEAR SELECTOR */}
          <select
            value={activeYear}
            onChange={(e) => dispatch(setSelectedYear(e.target.value))}
            className="px-3 py-1.5 text-xs font-semibold border-2 rounded-md border-blue-600 bg-white"
          >
            <option value="">Select Year</option>
            {(finYr?.data || ["2023-24", "2024-25", "2025-26"]).map((year) => {
              const yrName = typeof year === "object" ? year.finYr || year.finYear || year.name : year;
              return (
                <option key={yrName} value={yrName}>
                  {yrName}
                </option>
              );
            })}
          </select>

          {/* COMPANY SELECTOR */}
          <select
            value={activeCompany}
            onChange={handleCompanyChange}
            className="px-3 py-1.5 text-xs font-semibold border-2 rounded-md border-blue-600 bg-white"
          >
            <option value="">Select Company</option>
            {(filterBuyerList ?? []).map((item) => (
              <option key={item.compname || item} value={item.compname || item}>
                {item.compname}
              </option>
            ))}
          </select>
        </Box>
      </Box>

      {/* Grid of the 9 granular visual GRN modules */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <GeneralGRNCard companyName={activeCompany} selectedYear={activeYear} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <GreyFabricGRNCard companyName={activeCompany} selectedYear={activeYear} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <GreyYarnGRNCard companyName={activeCompany} selectedYear={activeYear} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <DyedYarnGRNCard companyName={activeCompany} selectedYear={activeYear} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <DyedFabricGRNCard companyName={activeCompany} selectedYear={activeYear} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <AccessoryGRNCard companyName={activeCompany} selectedYear={activeYear} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CuttingPrintingGRNCard companyName={activeCompany} selectedYear={activeYear} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <KnittingStoreGRNCard companyName={activeCompany} selectedYear={activeYear} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <EmbroideryAccessoryCard companyName={activeCompany} selectedYear={activeYear} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default GoodsReceivedNoteHome;
