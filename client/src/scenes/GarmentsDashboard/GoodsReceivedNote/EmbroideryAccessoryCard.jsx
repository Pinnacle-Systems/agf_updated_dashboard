import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, CircularProgress, Box, Typography } from "@mui/material";
import { useGetEmbroideryAccessoryInwardTableQuery } from "../../../redux/AgfServices/GRNservices";
import EmbroideryAccessoryTable from "./TableData/EmbroideryAccessoryTable";

const EmbroideryAccessoryCard = ({ companyName, selectedYear }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: response, isLoading } = useGetEmbroideryAccessoryInwardTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !selectedYear || !companyName }
  );
  const rawData = response?.data ?? [];

  const chartOptions = useMemo(() => {
    // Group values by Embroidery Item Name
    const itemMap = {};
    rawData.forEach((row) => {
      const iName = row.item || "Other Thread";
      itemMap[iName] = (itemMap[iName] || 0) + Number(row.amount || 0);
    });

    const seriesData = Object.keys(itemMap).map((key) => ({
      name: key,
      y: itemMap[key]
    }));

    return {
      chart: { type: "pie", height: 280 },
      colors: ["#0d9488", "#14b8a6", "#0f766e", "#2dd4bf", "#3b82f6"],
      title: { text: null },
      tooltip: { pointFormat: "<b>₹{point.y:,.2f}</b> ({point.percentage:.1f}%)" },
      plotOptions: {
        pie: {
          innerSize: "50%", // Donut
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: { enabled: false },
          showInLegend: true,
          point: { events: { click() { setModalOpen(true); } } }
        }
      },
      series: [{ name: "Inward Share", colorByPoint: true, data: seriesData }],
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
        title="Embroidery Accessory Purchase Inward Register"
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
        <EmbroideryAccessoryTable
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          companyName={companyName}
          selectedYear={selectedYear}
        />
      )}
    </Card>
  );
};

export default EmbroideryAccessoryCard;
