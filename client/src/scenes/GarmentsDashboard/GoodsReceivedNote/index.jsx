import React, { useMemo, useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";
import { setFilterBuyer } from "../../../redux/features/dashboardFiltersSlice";

const GoodsReceivedNoteIndex = ({
  filterBuyer,
  selectedYear,
  selectMonths,
  finYr,
  user,
  filterBuyerList,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const filterBuyerRef = useRef(filterBuyer);
  useEffect(() => {
    filterBuyerRef.current = filterBuyer;
  }, [filterBuyer]);

  const rawData = [
    { COMPANY: "AGF", TOTAL_VALUE: 4520000 },
    { COMPANY: "VEL", TOTAL_VALUE: 3850000 },
    { COMPANY: "KSM", TOTAL_VALUE: 2890000 },
    { COMPANY: "SLV", TOTAL_VALUE: 1940000 }
  ];

  const options = useMemo(() => ({
    chart: {
      type: "pie",
      height: 288,
    },
    colors: ["#3b82f6", "#10b981", "#8b5cf6", "#ec4899"],
    title: {
      text: null,
    },
    tooltip: {
      pointFormatter() {
        return `<br/>Value: ₹${this.y.toLocaleString("en-IN")}`;
      },
    },
    plotOptions: {
      pie: {
        innerSize: "60%",
        borderRadius: 6,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() {
            return `${this.point.name}: ₹${this.y.toLocaleString("en-IN")}`;
          },
          style: { fontSize: "10px" },
        },
        point: {
          events: {
            click() {
              const companyName = this.name;
              dispatch(setFilterBuyer(companyName));
              dispatch(
                push({
                  id: "GoodsReceivedNoteStatus",
                  name: "GoodsReceivedNoteStatus",
                  component: "GoodsReceivedNoteStatus",
                  data: {
                    companyName,
                    selectedYear,
                    filterBuyer: filterBuyerRef.current,
                    user,
                    selectMonths,
                    filterBuyerList,
                    finYr,
                  },
                })
              );
            },
          },
        },
      },
    },
    series: [
      {
        name: "Goods Received Note",
        data: (rawData ?? []).map((x) => ({
          name: x.COMPANY || "Unknown",
          y: Number(x.TOTAL_VALUE || 0),
        })),
      },
    ],
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
    },
    credits: { enabled: false },
  }), [rawData, selectedYear, selectMonths, filterBuyerList, finYr, user, dispatch]);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Goods Received Note Details (Outside Suppliers)"
        titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
        sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default GoodsReceivedNoteIndex;
