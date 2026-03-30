import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  useTheme,
} from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useGetItemGroupWiseQuery } from "../../../redux/service/purchaseService";

const ItemGroupWiseReport = ({ companyName, finYear }) => {
  const theme = useTheme();
  const { data: response, isLoading } = useGetItemGroupWiseQuery({
    params: { finYear, companyName },
  });

  const [selectedGroup, setSelectedGroup] = useState(null); // null = show parent

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Aggregate data by ItemGroup
  const groupMap = useMemo(() => {
    if (!Array.isArray(response?.data)) return {};
    const map = {};
    response.data.forEach((item) => {
      if (!map[item.ItemGroup]) map[item.ItemGroup] = [];
      map[item.ItemGroup].push(item);
    });
    return map;
  }, [response]);

  // Parent chart options
  const parentOptions = useMemo(() => {
    const seriesData = Object.entries(groupMap).map(([groupName, items]) => ({
      name: groupName,
      y: items.reduce((acc, i) => acc + i.value, 0),
    }));

    return {
      chart: { type: "column", backgroundColor: "transparent", height: 450 },
      title: { text: "" },
      xAxis: { type: "category", labels: { style: { fontSize: "12px" } } },
      yAxis: { title: { text: "Total Value" } },
      tooltip: {
        formatter() {
          return `<b>${this.key}</b><br/>${formatINR(this.y)}`;
        },
      },
      plotOptions: {
        column: {
          borderRadius: 6,
          minPointLength: 40,
          cursor: "pointer",
          point: {
            events: {
              click() {
                setSelectedGroup(this.name); // show child chart
              },
            },
          },
        },
      },
      series: [{ name: "Item Groups", colorByPoint: true, data: seriesData }],
      credits: { enabled: false },
      legend: { enabled: false },
    };
  }, [groupMap]);

  // Child chart options
  const childOptions = useMemo(() => {
    if (!selectedGroup) return {};
    const items = groupMap[selectedGroup] || [];
    return {
      chart: { type: "column", backgroundColor: "transparent", height: 400 },
      title: { text: `` },
      xAxis: { type: "category", labels: { style: { fontSize: "12px" } } },
      yAxis: { title: { text: "Value" } },
      tooltip: {
        formatter() {
          return `<b>${this.key}</b><br/>${formatINR(this.y)}`;
        },
      },
      plotOptions: { column: { borderRadius: 6, minPointLength: 40 } },
      series: [
        {
          name: selectedGroup,
          colorByPoint: true,
          data: items.map((i) => ({ name: i.ItemName, y: i.value })),
        },
      ],
      credits: { enabled: false },
      legend: { enabled: false },
    };
  }, [groupMap, selectedGroup]);

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Item Group Wise Purchase"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />
      <CardContent sx={{ height: 500 }}>
        {isLoading ? (
          <Box sx={{ textAlign: "center", padding: 4 }}>Loading...</Box>
        ) : (
          <>
            {/* Parent chart shown only if no group selected */}
            {!selectedGroup && (
              <HighchartsReact
                highcharts={Highcharts}
                options={parentOptions}
              />
            )}

            {/* Child chart shown only if group selected */}
            {selectedGroup && (
              <Box
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}
              >
                {/* Selected group name */}
                <Box sx={{ fontWeight: 600, fontSize: "1rem" }}>
                  {selectedGroup}
                </Box>

                {/* Back button */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setSelectedGroup(null)}
                >
                  Go Back
                </Button>
              </Box>
            )}
            {selectedGroup && (
  <HighchartsReact highcharts={Highcharts} options={childOptions} />
)}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemGroupWiseReport;
