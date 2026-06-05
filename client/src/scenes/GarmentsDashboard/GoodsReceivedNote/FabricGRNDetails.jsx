import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, CircularProgress } from "@mui/material";
import {
  useGetGreyFabricGRNTableQuery,
  useGetDyedFabricGRNTableQuery,
} from "../../../redux/AgfServices/GRNservices";
import FabricGRNDetailsTable from "./TableData/FabricGRNDetailsTable";

const FabricGRNDetails = ({ companyName, selectedYear }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubReport, setSelectedSubReport] = useState("Grey");

  const { data: greyResponse, isLoading: greyLoading } = useGetGreyFabricGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );

  const { data: dyedResponse, isLoading: dyedLoading } = useGetDyedFabricGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );

  // Group data by month
  const chartData = useMemo(() => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const greyMonthly = new Array(12).fill(0);
    const dyedMonthly = new Array(12).fill(0);

    const parseMonthIndex = (dateStr) => {
      if (!dateStr) return -1;
      const d = new Date(dateStr);
      const m = d.getMonth(); // 0 is Jan, 11 is Dec
      // Adjust to financial year index starting in April (index 0)
      const adjusted = (m + 9) % 12;
      return adjusted;
    };

    (greyResponse?.data ?? []).forEach((row) => {
      const idx = parseMonthIndex(row.docDate);
      if (idx >= 0 && idx < 12) greyMonthly[idx] += Number(row.amount || 0);
    });

    (dyedResponse?.data ?? []).forEach((row) => {
      const idx = parseMonthIndex(row.docDate);
      if (idx >= 0 && idx < 12) dyedMonthly[idx] += Number(row.amount || 0);
    });

    return { months, greyMonthly, dyedMonthly };
  }, [greyResponse, dyedResponse]);

  const options = useMemo(() => ({
    chart: {
      type: "areaspline",
      height: 320,
    },
    colors: ["#10b981", "#ef4444"],
    title: { text: null },
    xAxis: {
      categories: chartData.months,
    },
    yAxis: {
      title: { text: "Value (₹)" },
    },
    tooltip: {
      shared: true,
      valuePrefix: "₹",
      valueDecimals: 2,
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.12,
        cursor: "pointer",
        point: {
          events: {
            click() {
              setSelectedSubReport(this.series.name.includes("Grey") ? "Grey" : "Dyed");
              setModalOpen(true);
            },
          },
        },
      },
    },
    series: [
      {
        name: "Grey Fabric GRN",
        data: chartData.greyMonthly,
      },
      {
        name: "Dyed Fabric GRN",
        data: chartData.dyedMonthly,
      },
    ],
    credits: { enabled: false },
  }), [chartData]);

  if (greyLoading || dyedLoading) {
    return (
      <Card sx={{ p: 4, textAlign: "center", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
      <CardHeader
        title="Fabric GRN Details"
        titleTypographyProps={{ variant: "h6", fontWeight: "600" }}
        sx={{ borderBottom: "1px solid rgba(0,0,0,0.08)", py: 2 }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>

      {modalOpen && (
        <FabricGRNDetailsTable
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          companyName={companyName}
          selectedYear={selectedYear}
          subReportType={selectedSubReport}
        />
      )}
    </Card>
  );
};

export default FabricGRNDetails;
