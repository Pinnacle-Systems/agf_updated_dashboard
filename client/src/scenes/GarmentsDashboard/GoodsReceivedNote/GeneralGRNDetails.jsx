import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, CircularProgress, Typography } from "@mui/material";
import {
  useGetGeneralGRNTableQuery,
  useGetCuttingPrintingGRNTableQuery,
  useGetKnittingStoreGRNTableQuery,
} from "../../../redux/AgfServices/GRNservices";
import GeneralGRNDetailsTable from "./TableData/GeneralGRNDetailsTable";

const GeneralGRNDetails = ({ companyName, selectedYear }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubReport, setSelectedSubReport] = useState("General");

  const { data: genResponse, isLoading: genLoading } = useGetGeneralGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );

  const { data: cutResponse, isLoading: cutLoading } = useGetCuttingPrintingGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );

  const { data: knitResponse, isLoading: knitLoading } = useGetKnittingStoreGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );

  const stats = useMemo(() => {
    const genVal = (genResponse?.data ?? []).reduce((acc, row) => acc + Number(row.amount || 0), 0);
    const cutVal = (cutResponse?.data ?? []).reduce((acc, row) => acc + Number(row.amount || 0), 0);
    const knitVal = (knitResponse?.data ?? []).reduce((acc, row) => acc + Number(row.amount || 0), 0);

    return [
      { name: "General Purchase GRN", val: genVal, key: "General" },
      { name: "Cutting/Printing Store GRN", val: cutVal, key: "Cutting" },
      { name: "Knitting Store GRN", val: knitVal, key: "Knitting" },
    ];
  }, [genResponse, cutResponse, knitResponse]);

  const options = useMemo(() => ({
    chart: {
      type: "column",
      height: 320,
    },
    colors: ["#3b82f6", "#14b8a6", "#6366f1"],
    title: { text: null },
    xAxis: {
      categories: ["General Store", "Cutting Store", "Knitting Store"],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: { text: "Value (₹)" },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>₹{point.y:,.2f}</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        borderRadius: 4,
        cursor: "pointer",
        point: {
          events: {
            click() {
              const clickedKey = stats[this.index].key;
              setSelectedSubReport(clickedKey);
              setModalOpen(true);
            },
          },
        },
      },
    },
    series: [
      {
        name: "Received Value",
        colorByPoint: true,
        data: stats.map((x) => x.val),
      },
    ],
    credits: { enabled: false },
  }), [stats]);

  if (genLoading || cutLoading || knitLoading) {
    return (
      <Card sx={{ p: 4, textAlign: "center", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
      <CardHeader
        title="General & Stores GRN"
        titleTypographyProps={{ variant: "h6", fontWeight: "600" }}
        sx={{ borderBottom: "1px solid rgba(0,0,0,0.08)", py: 2 }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>

      {modalOpen && (
        <GeneralGRNDetailsTable
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

export default GeneralGRNDetails;
