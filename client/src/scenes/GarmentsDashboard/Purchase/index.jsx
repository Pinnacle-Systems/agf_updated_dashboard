import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  Typography,
  useTheme,
  CircularProgress,
  CardContent,
  CardHeader,
  Box,
} from "@mui/material";
import {
  useGetPurchaseQuery,
  useGetPurchaseOrderQuery,
} from "../../../redux/service/purchaseService";
import { useGetsallastmonthQuery } from "../../../redux/service/misDashboardService";
import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import {
  setFilterBuyer,
  setPoType,
} from "../../../redux/features/dashboardFiltersSlice";

const PurchaseIndex = ({
  filterBuyer,
  selectedYear,
  selectMonths,
  finYr,
  user,
  filterBuyerList,
  onMonthChange,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const poType = useSelector((state) => state.dashboardFilters.poType);
const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  /* ---------------- YEAR HANDLING ---------------- */
  const filterYear = useMemo(() => {
    if (!selectedYear) return "";
    return typeof selectedYear === "object"
      ? selectedYear.finYr || selectedYear.name
      : selectedYear;
  }, [selectedYear]);

  const previousYear = useMemo(() => {
    if (!filterYear) return "";
    const [start, end] = filterYear.split("-").map(Number);
    return `${String(start - 1).padStart(2, "0")}-${String(end - 1).padStart(
      2,
      "0",
    )}`;
  }, [filterYear]);

  const purchaseQuery = useGetPurchaseQuery(
    { params: { filterYear, previousYear } },
    { skip: !filterYear || poType !== "General" }, // skip if not General
  );

  const purchaseOrderQuery = useGetPurchaseOrderQuery(
    { params: { filterYear, previousYear } },
    { skip: !filterYear || poType !== "Order" }, // skip if not Order
  );

  // pick data from the active PO type
  const turnOverData =
    poType === "General" ? purchaseQuery.data : purchaseOrderQuery.data;
  const isLoading =
    poType === "General"
      ? purchaseQuery.isLoading
      : purchaseOrderQuery.isLoading;
  const isError =
    poType === "General" ? purchaseQuery.isError : purchaseOrderQuery.isError;
  const error =
    poType === "General" ? purchaseQuery.error : purchaseOrderQuery.error;

  const { data: lastmonth } = useGetsallastmonthQuery();
  const Year = lastmonth?.data?.find((x) => x.Year);

  /* ---------------- MONTH AUTO SET ---------------- */
  useEffect(() => {
    if (Year?.month && !selectMonths) {
      onMonthChange(Year.month);
    }
  }, [Year, selectMonths, onMonthChange]);

  if (isLoading) {
    return (
      <Card sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error: {error?.message || "Failed to load data"}
      </Typography>
    );
  }
  const formatShortINR = (value) => {
    const num = Number(value);

    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(1)} Cr`; // Crore
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(1)} L`; // Lakh
    if (num >= 1000) return `₹ ${(num / 1000).toFixed(1)} K`; // Thousand

    return formatINR(num);
  };
  const companies = turnOverData?.data?.map((x) => x.COMPCODE) ?? [];

  const companypurchaseValue = turnOverData?.data?.map((x) => x.VAL) ?? [];

  const overallTurnover = companypurchaseValue.reduce(
    (sum, val) => sum + val,
    0,
  );

  /* ---------------- CHART ---------------- */
  const options = {
    chart: { type: "column", height: 250 },

    title: { text: null },

    xAxis: {
      categories: companies,
      crosshair: true,
      labels: {
        style: { fontSize: "13px" },
      },
    },

    yAxis: {
      min: 0,
      title: { text: "Purchase Value" },
      // labels: {
      //   formatter() {
      //     return `₹ ${this.value.toFixed(2)}`;
      //   },
      // },
    },

    tooltip: {
      shared: true,
      useHTML: true,
      formatter() {
        return `<b>${this.x}</b><br/>Purchase: ${formatINR(this.y)}`;
      },
    },

    plotOptions: {
      column: {
        borderRadius: 5,
        pointPadding: 0.2,
        groupPadding: 0.1,
        minPointLength: 20,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() {
            return formatShortINR(this.y); // 👈 short format
          },
          style: {
            fontSize: "9px",
          },
        },
        point: {
          events: {
            click: function () {
              const companyName = companies[this.index];

              dispatch(setFilterBuyer(companyName));

              dispatch(
                push({
                  id: `Purchase`,
                  name: "Purchase",
                  component: "PurchaseHome",
                  data: {
                    companyName,
                    selectedYear,
                    filterBuyer,
                    user,
                    selectMonths,
                    filterBuyerList,
                    finYr,poType
                  },
                }),
              );
            },
          },
        },
      },
    },
    series: [
      {
        name: "Purchase",
        data: companypurchaseValue,
        colorByPoint: true,
      },
    ],
    legend: {
      enabled: false, // 👈 FIX: removes clickable "Purchase"
    },

    credits: { enabled: false },
  };
  console.log(poType, "poType");

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Purchase"
        titleTypographyProps={{
          sx: { fontSize: "1rem", fontWeight: 600 },
        }}
        action={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: 180,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              PO Type:
            </Typography>
            <Select
              size="small"
              value={poType || ""}
              onChange={(e) => dispatch(setPoType(e.target.value))}
              sx={{
                minWidth: 120,
                height: 28, // 👈 reduce height
                "& .MuiSelect-select": {
                  paddingTop: 3,
                  paddingBottom: 3, // 👈 adjust text vertical padding
                  fontSize: "12px", // optional smaller text
                },
              }}
            >
              <MenuItem value="General" sx={{ fontSize: "12px" }}>
                General
              </MenuItem>
              <MenuItem value="Order" sx={{ fontSize: "12px" }}>
                Order
              </MenuItem>
            </Select>
          </Box>
        }
        sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
        <Box
          sx={{
            bgcolor: "background.default",
            borderRadius: 3,
            textAlign: "center",
            border: `1px solid ${theme.palette.divider}`,
            // mt: 2,
            p: 1,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Overall Purchase: {formatINR(overallTurnover)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PurchaseIndex;
