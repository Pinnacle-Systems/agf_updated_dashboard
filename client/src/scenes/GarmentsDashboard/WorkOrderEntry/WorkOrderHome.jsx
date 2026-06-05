import { Box, Grid, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { DropdownWithSearch } from "../../../input/inputcomponent";
import WorkOrderStatus from "./WorkOrderStatus";
import { useGetCompanyQuery } from "../../../redux/service/purchaseService";

import {
  setSelectedYear,
  setFilterBuyer,
  setSelectMonths,
} from "../../../redux/features/dashboardFiltersSlice";
import { useEffect, useRef, useState } from "react";

const WorkOrderEntryIndex = ({
  companyName,
  autoFocusBuyer,
  filterBuyerList,
}) => {
  const dispatch = useDispatch();
  const buyerRef = useRef();
  // Redux state
  const { selectedYear, filterBuyer, selectMonths, finYr } = useSelector(
    (state) => state.dashboardFilters,
  );
  const { data: companyList } = useGetCompanyQuery(
    { params: { selectedYear } },
    { skip: !selectedYear },
  );
  const [focusBuyer, setFocusBuyer] = useState(false);

  useEffect(() => {
    setFocusBuyer(true);

    return () => setFocusBuyer(false);
  }, []); // runs when page/tab is entered

  return (
    <>
      {/* Header and Filters */}
      <div
        className="mt-2"
        style={{
          position: "sticky",
          top: 30,
          zIndex: 50,
          backgroundColor: "white",
        }}
      >
        <Grid
          container
          spacing={0}
          // alignItems="center"
          justifyContent="space-between"
          sx={{
            backgroundColor: "white",
            color: "black",
            p: 0.5,
            borderBottom: "1px solid #afafaf",
            borderTop: "1px solid #afafaf",
          }}
        >
          {/* LEFT TITLE */}
          <Grid item md={5}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, textAlign: "start", pt: 0.5, ml: 1 }}
            >
              Overview of Work Order Distribution
            </Typography>
          </Grid>

          {/* RIGHT FILTERS GROUP */}
          <Grid
            item
            md={7}
            sx={{
              display: "flex",
              justifyContent: "flex-end", // push the group to the right
              alignItems: "center",
              pt: 0.5,
              pb: 0.4,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <select
                value={selectedYear || ""}
                onChange={(e) => dispatch(setSelectedYear(e.target.value))}
                className="w-full px-2 py-1 text-xs border-2   rounded-md 
      border-blue-600 transition-all duration-200"
              >
                <option value="">Select Year</option>

                {(finYr?.data || []).map((item) => (
                  <option key={item.finYear} value={item.finYear}>
                    {item.finYear}
                  </option>
                ))}
              </select>

              <select
                ref={buyerRef}
                value={filterBuyer || ""}
                onChange={(e) => dispatch(setFilterBuyer(e.target.value))}
                autoFocus={focusBuyer}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              >
                <option value="">Select Company</option>
                {companyList?.data?.map((item) => (
                  <option key={item.COMPCODE} value={item.COMPCODE}>
                    {item.COMPCODE}
                  </option>
                ))}
                /{" "}
              </select>
            </Box>
          </Grid>
        </Grid>
      </div>

      {/* Child Components */}
      <Grid md={12}>
        <WorkOrderStatus
          key={filterBuyer}
          companyName={filterBuyer}
          finYear={selectedYear}
          finYr={finYr}
          filterBuyerList={filterBuyerList}
        />
      </Grid>
    </>
  );
};

export default WorkOrderEntryIndex;
