import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedYear: '24-25',
  filterBuyer: null,
  selectMonths: [],
  finYr: null,
  user: null,
};

const dashboardFiltersSlice = createSlice({
  name: "dashboardFilters",
  initialState,
  reducers: {
    setSelectedYear: (state, action) => {
      state.selectedYear = action.payload;
    },
    setFilterBuyer: (state, action) => {
      state.filterBuyer = action.payload;
    },
    setSelectMonths: (state, action) => {
      state.selectMonths = action.payload;
    },
    setFinYr: (state, action) => {
      state.finYr = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetDashboardFilters: () => initialState,
  },
});

export const {
  setSelectedYear,
  setFilterBuyer,
  setSelectMonths,
  setFinYr,
  setUser,
  resetDashboardFilters,
} = dashboardFiltersSlice.actions;

export default dashboardFiltersSlice.reducer;
