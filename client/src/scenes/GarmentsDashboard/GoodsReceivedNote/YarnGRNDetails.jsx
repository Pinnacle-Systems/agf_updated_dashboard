import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, CircularProgress } from "@mui/material";
import {
  useGetGreyYarnGRNTableQuery,
  useGetDyedYarnGRNTableQuery,
} from "../../../redux/AgfServices/GRNservices";
import YarnGRNDetailsTable from "./TableData/YarnGRNDetailsTable";

const YarnGRNDetails = ({ companyName, selectedYear }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubReport, setSelectedSubReport] = useState("Grey");

  const { data: greyResponse, isLoading: greyLoading } = useGetGreyYarnGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );

  const { data: dyedResponse, isLoading: dyedLoading } = useGetDyedYarnGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );

  const stats = useMemo(() => {
    const greyVal = (greyResponse?.data ?? []).reduce((acc, row) => acc + Number(row.amount || 0), 0);
    const dyedVal = (dyedResponse?.data ?? []).reduce((acc, row) => acc + Number(row.amount || 0), 0);

    const greyQty = (greyResponse?.data ?? []).reduce((acc, row) => acc + Number(row.qty || 0), 0);
    const dyedQty = (dyedResponse?.data ?? []).reduce((acc, row) => acc + Number(row.qty || 0), 0);

    return { greyVal, dyedVal, greyQty, dyedQty };
  }, [greyResponse, dyedResponse]);

  const options = useMemo(() => ({
    chart: {
      type: "bar",
      height: 320,
    },
    colors: ["#f59e0b", "#8b5cf6"],
    title: { text: null },
    xAxis: {
      categories: ["Received Value (₹)", "Received Weight (Kgs)"],
    },
    yAxis: {
      min: 0,
      title: { text: "Yarn Statistics" },
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
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
        name: "Grey Yarn GRN",
        data: [stats.greyVal, stats.greyQty],
      },
      {
        name: "Dyed Yarn GRN",
        data: [stats.dyedVal, stats.dyedQty],
      },
    ],
    credits: { enabled: false },
  }), [stats]);

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
        title="Yarn GRN Details"
        titleTypographyProps={{ variant: "h6", fontWeight: "600" }}
        sx={{ borderBottom: "1px solid rgba(0,0,0,0.08)", py: 2 }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>

      {modalOpen && (
        <YarnGRNDetailsTable
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

export default YarnGRNDetails;
