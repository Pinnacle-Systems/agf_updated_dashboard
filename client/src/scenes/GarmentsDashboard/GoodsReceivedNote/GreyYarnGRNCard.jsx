import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, CircularProgress, Box, Typography } from "@mui/material";
import { useGetGreyYarnGRNTableQuery } from "../../../redux/AgfServices/GRNservices";
import GreyYarnGRNTable from "./TableData/GreyYarnGRNTable";

const GreyYarnGRNCard = ({ companyName, selectedYear }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: response, isLoading } = useGetGreyYarnGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );
  const rawData = response?.data ?? [];

  const chartOptions = useMemo(() => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const monthlyValues = new Array(12).fill(0);

    rawData.forEach((row) => {
      if (row.docDate) {
        const m = new Date(row.docDate).getMonth();
        const adjusted = (m + 9) % 12;
        if (adjusted >= 0 && adjusted < 12) {
          monthlyValues[adjusted] += Number(row.amount || 0);
        }
      }
    });

    return {
      chart: { type: "bar", height: 280 },
      colors: ["#f59e0b"],
      title: { text: null },
      xAxis: { categories: months },
      yAxis: { title: { text: "Value (₹)" }, min: 0 },
      tooltip: { shared: true, valuePrefix: "₹", valueDecimals: 2 },
      plotOptions: {
        series: {
          cursor: "pointer",
          borderRadius: 4,
          point: { events: { click() { setModalOpen(true); } } }
        }
      },
      series: [{ name: "Value (₹)", data: monthlyValues }],
      credits: { enabled: false }
    };
  }, [rawData]);

  const totalValue = useMemo(() => {
    return rawData.reduce((acc, row) => acc + Number(row.amount || 0), 0);
  }, [rawData]);

  if (isLoading) {
    return (
      <Card sx={{ p: 4, textAlign: "center", minHeight: 340, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.06)", height: "100%" }}>
      <CardHeader
        title="Grey Yarn GRN Details"
        titleTypographyProps={{ variant: "subtitle1", fontWeight: "600", color: "text.primary" }}
        subheader={
          <Typography variant="body2" color="primary" fontWeight="700">
            Total Value: ₹{totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </Typography>
        }
        sx={{ borderBottom: "1px solid rgba(0,0,0,0.08)", py: 1.5 }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </CardContent>
      {modalOpen && (
        <GreyYarnGRNTable
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          companyName={companyName}
          selectedYear={selectedYear}
        />
      )}
    </Card>
  );
};

export default GreyYarnGRNCard;
