// import React, { useMemo, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   CardHeader,
//   Button,
//   useTheme,
// } from "@mui/material";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import { useGetItemGroupWiseQuery } from "../../../redux/service/purchaseService";

// const ItemGroupWiseReport = ({ companyName, finYear }) => {
//   const theme = useTheme();
//   const { data: response, isLoading } = useGetItemGroupWiseQuery({
//     params: { finYear, companyName },
//   });

//   const [selectedGroup, setSelectedGroup] = useState(null); // null = show parent

//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   // Aggregate data by ItemGroup
//   const groupMap = useMemo(() => {
//     if (!Array.isArray(response?.data)) return {};
//     const map = {};
//     response.data.forEach((item) => {
//       if (!map[item.ItemGroup]) map[item.ItemGroup] = [];
//       map[item.ItemGroup].push(item);
//     });
//     return map;
//   }, [response]);

//   // Parent chart options
//   const parentOptions = useMemo(() => {
//     const seriesData = Object.entries(groupMap).map(([groupName, items]) => ({
//       name: groupName,
//       y: items.reduce((acc, i) => acc + i.value, 0),
//     }));

//     return {
//       chart: { type: "column", backgroundColor: "transparent", height: 450 },
//       title: { text: "" },
//       xAxis: { type: "category", labels: { style: { fontSize: "12px" } } },
//       yAxis: { title: { text: "Total Value" } },
//       tooltip: {
//         formatter() {
//           return `<b>${this.key}</b><br/>${formatINR(this.y)}`;
//         },
//       },
//       plotOptions: {
//         column: {
//           borderRadius: 6,
//           minPointLength: 40,
//           cursor: "pointer",
//           point: {
//             events: {
//               click() {
//                 setSelectedGroup(this.name); // show child chart
//               },
//             },
//           },
//         },
//       },
//       series: [{ name: "Item Groups", colorByPoint: true, data: seriesData }],
//       credits: { enabled: false },
//       legend: { enabled: false },
//     };
//   }, [groupMap]);

//   // Child chart options
//   const childOptions = useMemo(() => {
//     if (!selectedGroup) return {};
//     const items = groupMap[selectedGroup] || [];
//     return {
//       chart: { type: "column", backgroundColor: "transparent", height: 400 },
//       title: { text: `` },
//       xAxis: { type: "category", labels: { style: { fontSize: "12px" } } },
//       yAxis: { title: { text: "Value" } },
//       tooltip: {
//         formatter() {
//           return `<b>${this.key}</b><br/>${formatINR(this.y)}`;
//         },
//       },
//       plotOptions: { column: { borderRadius: 6, minPointLength: 40 } },
//       series: [
//         {
//           name: selectedGroup,
//           colorByPoint: true,
//           data: items.map((i) => ({ name: i.ItemName, y: i.value })),
//         },
//       ],
//       credits: { enabled: false },
//       legend: { enabled: false },
//     };
//   }, [groupMap, selectedGroup]);

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title="Item Group Wise Purchase"
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
//       />
//       <CardContent sx={{ height: 500 }}>
//         {isLoading ? (
//           <Box sx={{ textAlign: "center", padding: 4 }}>Loading...</Box>
//         ) : (
//           <>
//             {/* Parent chart shown only if no group selected */}
//             {!selectedGroup && (
//               <HighchartsReact
//                 highcharts={Highcharts}
//                 options={parentOptions}
//               />
//             )}

//             {/* Child chart shown only if group selected */}
//             {selectedGroup && (
//               <Box
//                 sx={{
//                   mb: 2,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   gap: 2,
//                 }}
//               >
//                 {/* Selected group name */}
//                 <Box sx={{ fontWeight: 600, fontSize: "1rem" }}>
//                   {selectedGroup}
//                 </Box>

//                 {/* Back button */}
//                 <Button
//                   variant="contained"
//                   size="small"
//                   onClick={() => setSelectedGroup(null)}
//                 >
//                   Back
//                 </Button>
//               </Box>
//             )}
//             {selectedGroup && (
//               <HighchartsReact highcharts={Highcharts} options={childOptions} />
//             )}
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ItemGroupWiseReport;


import React, { useMemo, useState, useCallback } from "react";
import {
  Box, Card, CardContent, CardHeader, Button, useTheme,
} from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useGetItemGroupWiseQuery } from "../../../redux/service/purchaseService";

const PAGE_SIZE = 25;

const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ── Parent Arrow: bold blue pill ──────────────────────────────────────────────
const ParentArrow = ({ direction, onClick, disabled, label }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
    <Box
      onClick={!disabled ? onClick : undefined}
      sx={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 44, height: 44, borderRadius: "12px",
        background: disabled
          ? "#e0e0e0"
          : "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 4px 12px rgba(37,99,235,0.35)",
        transition: "all 0.2s ease",
        "&:hover": !disabled ? { transform: "scale(1.08)" } : {},
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {direction === "left"
          ? <path d="M13 4L7 10L13 16" stroke={disabled ? "#aaa" : "#fff"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M7 4L13 10L7 16" stroke={disabled ? "#aaa" : "#fff"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        }
      </svg>
    </Box>
    <Box sx={{ fontSize: "10px", color: "#64748b", fontWeight: 600 }}>{label}</Box>
  </Box>
);

// ── Child Arrow: purple outlined circle ───────────────────────────────────────
const ChildArrow = ({ direction, onClick, disabled, label }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
    <Box
      onClick={!disabled ? onClick : undefined}
      sx={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 40, height: 40, borderRadius: "50%",
        border: disabled ? "2px solid #e0e0e0" : "2px solid #7c3aed",
        background: disabled ? "#f5f5f5" : "#faf5ff",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        "&:hover": !disabled ? { background: "#7c3aed" } : {},
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke={disabled ? "#ccc" : "#7c3aed"} strokeWidth="1.5" />
        {direction === "left"
          ? <path d="M11 5.5L7 9L11 12.5" stroke={disabled ? "#ccc" : "#7c3aed"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M7 5.5L11 9L7 12.5" stroke={disabled ? "#ccc" : "#7c3aed"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        }
      </svg>
    </Box>
    <Box sx={{ fontSize: "10px", color: "#7c3aed", fontWeight: 600 }}>{label}</Box>
  </Box>
);

// ── Paginated Chart ───────────────────────────────────────────────────────────
const PaginatedChart = ({ allData, buildOptions, ArrowComponent }) => {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(allData.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages - 1);

  const pageData = useMemo(
    () => allData.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [allData, safePage],
  );

  const options = useMemo(
    () => buildOptions(pageData),
    [pageData, buildOptions],
  );

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
      <ArrowComponent
        direction="left"
        onClick={() => setPage((p) => Math.max(0, p - 1))}
        disabled={safePage === 0}
        label={`${safePage + 1}/${totalPages}`}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* key forces full remount on every page change — fixes stale chart data */}
        <HighchartsReact
          key={safePage}
          highcharts={Highcharts}
          options={options}
        />
      </Box>

      <ArrowComponent
        direction="right"
        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        disabled={safePage >= totalPages - 1}
        label={`${safePage + 1}/${totalPages}`}
      />
    </Box>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const ItemGroupWiseReport = ({ companyName, finYear }) => {
  const theme = useTheme();

  const { data: response, isLoading } = useGetItemGroupWiseQuery({
    params: { finYear, companyName },
  });

  const [selectedGroup, setSelectedGroup] = useState(null);

  // ── Group map ─────────────────────────────────────────────────────────────
  const groupMap = useMemo(() => {
    if (!Array.isArray(response?.data)) return {};
    const map = {};
    response.data.forEach((item) => {
      if (!map[item.ItemGroup]) map[item.ItemGroup] = [];
      map[item.ItemGroup].push(item);
    });
    return map;
  }, [response]);

  // ── Parent data ───────────────────────────────────────────────────────────
  const parentAllData = useMemo(
    () =>
      Object.entries(groupMap)
        .map(([groupName, items]) => ({
          name: groupName,
          y: items.reduce((acc, i) => acc + i.value, 0),
        }))
        .sort((a, b) => b.y - a.y),
    [groupMap],
  );

  // ── Child data ────────────────────────────────────────────────────────────
  const childAllData = useMemo(() => {
    if (!selectedGroup) return [];
    return (groupMap[selectedGroup] || [])
      .map((i) => ({ name: i.ItemName, y: i.value }))
      .sort((a, b) => b.y - a.y);
  }, [groupMap, selectedGroup]);

  // ── Parent chart builder ──────────────────────────────────────────────────
  const buildParentOptions = useCallback((pageData) => ({
    chart: { type: "column", backgroundColor: "transparent", height: 480 },
    title: { text: "" },
    xAxis: { type: "category", labels: { style: { fontSize: "11px" } } },
    yAxis: { title: { text: "Total Value" } },
    tooltip: {
      formatter() { return `<b>${this.key}</b><br/>${formatINR(this.y)}`; },
    },
    plotOptions: {
      column: {
        borderRadius: 6,
        minPointLength: 40,
        cursor: "pointer",
        point: {
          events: {
            click() { setSelectedGroup(this.name); },
          },
        },
      },
    },
    series: [{ name: "Item Groups", colorByPoint: true, data: pageData }],
    credits: { enabled: false },
    legend: { enabled: false },
  }), []);

  // ── Child chart builder ───────────────────────────────────────────────────
  const buildChildOptions = useCallback((pageData) => ({
    chart: { type: "column", backgroundColor: "transparent", height: 440 },
    title: { text: "" },
    xAxis: { type: "category", labels: { style: { fontSize: "11px" } } },
    yAxis: { title: { text: "Value" } },
    tooltip: {
      formatter() { return `<b>${this.key}</b><br/>${formatINR(this.y)}`; },
    },
    plotOptions: { column: { borderRadius: 6, minPointLength: 40 } },
    series: [{ name: selectedGroup, colorByPoint: true, data: pageData }],
    credits: { enabled: false },
    legend: { enabled: false },
  }), [selectedGroup]);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Item Group Wise Purchase"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
        action={
          selectedGroup && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#7c3aed" }}>
                {selectedGroup}
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setSelectedGroup(null)}
                sx={{
                  fontSize: "11px", px: 1.5, py: 0.3,
                  borderColor: "#7c3aed", color: "#7c3aed",
                  "&:hover": { borderColor: "#6d28d9", background: "#faf5ff" },
                }}
              >
                ← Back
              </Button>
            </Box>
          )
        }
      />

      <CardContent sx={{ height: 520 }}>
        {isLoading ? (
          <Box sx={{ textAlign: "center", padding: 4 }}>Loading...</Box>
        ) : (
          <>
            {/* ── PARENT: always mounted, hidden via CSS when child is active ── */}
            <Box sx={{ display: selectedGroup ? "none" : "block" }}>
              <PaginatedChart
                allData={parentAllData}
                buildOptions={buildParentOptions}
                ArrowComponent={ParentArrow}
              />
            </Box>

            {/* ── CHILD: always mounted once data exists, hidden when not needed ── */}
            {childAllData.length > 0 && (
              <Box sx={{ display: selectedGroup ? "block" : "none" }}>
                <PaginatedChart
                  key={selectedGroup}          // remount only when group changes
                  allData={childAllData}
                  buildOptions={buildChildOptions}
                  ArrowComponent={ChildArrow}
                />
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemGroupWiseReport;