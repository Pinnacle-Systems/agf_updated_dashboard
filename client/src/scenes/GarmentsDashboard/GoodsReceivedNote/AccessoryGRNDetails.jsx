import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, CircularProgress } from "@mui/material";
import {
  useGetAccessoryGRNTableQuery,
  useGetEmbroideryAccessoryInwardTableQuery,
} from "../../../redux/AgfServices/GRNservices";
import AccessoryGRNDetailsTable from "./TableData/AccessoryGRNDetailsTable";

const AccessoryGRNDetails = ({ companyName, selectedYear }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubReport, setSelectedSubReport] = useState("Accessory");

  const { data: accResponse, isLoading: accLoading } = useGetAccessoryGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );

  const { data: embResponse, isLoading: embLoading } = useGetEmbroideryAccessoryInwardTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );

  const stats = useMemo(() => {
    const accVal = (accResponse?.data ?? []).reduce((acc, row) => acc + Number(row.amount || 0), 0);
    const embVal = (embResponse?.data ?? []).reduce((acc, row) => acc + Number(row.amount || 0), 0);

    return [
      { name: "Accessory GRN Details", y: accVal, key: "Accessory" },
      { name: "Embroidery Inward Details", y: embVal, key: "Embroidery" },
    ];
  }, [accResponse, embResponse]);

  const options = useMemo(() => ({
    chart: {
      type: "pie",
      height: 320,
    },
    colors: ["#ec4899", "#0d9488"],
    title: { text: null },
    tooltip: {
      valuePrefix: "₹",
      valueDecimals: 2,
    },
    plotOptions: {
      pie: {
        innerSize: "60%",
        borderRadius: 6,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>:<br>₹{point.y:,.2f}",
          style: { fontSize: "10px" },
        },
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
        name: "Trim Expenses",
        data: stats,
      },
    ],
    credits: { enabled: false },
  }), [stats]);

  if (accLoading || embLoading) {
    return (
      <Card sx={{ p: 4, textAlign: "center", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
      <CardHeader
        title="Accessory & Embroidery"
        titleTypographyProps={{ variant: "h6", fontWeight: "600" }}
        sx={{ borderBottom: "1px solid rgba(0,0,0,0.08)", py: 2 }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>

      {modalOpen && (
        <AccessoryGRNDetailsTable
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

export default AccessoryGRNDetails;
