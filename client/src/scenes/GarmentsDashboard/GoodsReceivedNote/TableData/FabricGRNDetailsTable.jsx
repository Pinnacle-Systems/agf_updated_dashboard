import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  useGetGreyFabricGRNTableQuery,
  useGetDyedFabricGRNTableQuery,
} from "../../../../redux/AgfServices/GRNservices";
import ExcelJS from "exceljs";

const FabricGRNDetailsTable = ({ open, onClose, companyName, selectedYear, subReportType }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");

  const greyQuery = useGetGreyFabricGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: subReportType !== "Grey" || !open }
  );

  const dyedQuery = useGetDyedFabricGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: subReportType !== "Dyed" || !open }
  );

  const activeQuery = subReportType === "Grey" ? greyQuery : dyedQuery;
  const rawData = activeQuery.data?.data ?? [];

  const filteredData = useMemo(() => {
    if (!searchTerm) return rawData;
    const lower = searchTerm.toLowerCase();
    return rawData.filter(
      (row) =>
        String(row.docId || "").toLowerCase().includes(lower) ||
        String(row.supplier || "").toLowerCase().includes(lower) ||
        String(row.fabricName || "").toLowerCase().includes(lower) ||
        String(row.color || "").toLowerCase().includes(lower)
    );
  }, [rawData, searchTerm]);

  useMemo(() => {
    setPage(0);
  }, [subReportType]);

  const totals = useMemo(() => {
    let qty = 0;
    let val = 0;
    filteredData.forEach((row) => {
      qty += Number(row.qty || 0);
      val += Number(row.amount || 0);
    });
    return { qty, val };
  }, [filteredData]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${subReportType} Fabric GRN`);

    worksheet.addRow([`${subReportType} Fabric Goods Received Note Register`]);
    worksheet.mergeCells("A1:K1");
    const title = worksheet.getCell("A1");
    title.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFFFF" } };
    title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1E3A8A" } };
    title.alignment = { horizontal: "center" };
    worksheet.getRow(1).height = 40;

    worksheet.addRow([`Company: ${companyName}   |   Financial Year: ${selectedYear}`]);
    worksheet.mergeCells("A2:K2");
    const sub = worksheet.getCell("A2");
    sub.font = { name: "Calibri", size: 11, italic: true };
    sub.alignment = { horizontal: "center" };

    worksheet.addRow([]);

    const headers = ["S.No", "Date", "GRN No", "PO No", "Supplier", "Fabric Name", "GSM", "Color", "Qty (Kg)", "Rate", "Amount"];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "3B82F6" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
    worksheet.getRow(4).height = 28;

    filteredData.forEach((row, i) => {
      const dataRow = worksheet.addRow([
        i + 1,
        row.docDate ? new Date(row.docDate).toLocaleDateString("en-IN") : "",
        row.docId || "",
        row.orderNo || "",
        row.supplier || "",
        row.fabricName || "",
        row.gsm || "",
        row.color || "",
        Number(row.qty || 0),
        Number(row.price || 0),
        Number(row.amount || 0),
      ]);

      dataRow.getCell(9).numFmt = "#,##0.000";
      dataRow.getCell(10).numFmt = "₹#,##0.00";
      dataRow.getCell(11).numFmt = "₹#,##0.00";

      const fgColor = i % 2 === 0 ? "FFFFFF" : "F3F4F6";
      dataRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fgColor } };
        cell.border = {
          top: { style: "thin", color: { argb: "E5E7EB" } },
          bottom: { style: "thin", color: { argb: "E5E7EB" } },
          left: { style: "thin", color: { argb: "E5E7EB" } },
          right: { style: "thin", color: { argb: "E5E7EB" } },
        };
      });
    });

    const lastRowIndex = worksheet.lastRow.number;
    const totalsRow = worksheet.addRow([
      "Total", "", "", "", "", "", "", "",
      { formula: `SUM(I5:I${lastRowIndex})` },
      "",
      { formula: `SUM(K5:K${lastRowIndex})` }
    ]);

    totalsRow.getCell(9).numFmt = "#,##0.000";
    totalsRow.getCell(11).numFmt = "₹#,##0.00";

    totalsRow.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 11, bold: true };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "double", color: { argb: "000000" } },
      };
    });

    worksheet.columns.forEach((column) => {
      column.width = 18;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${companyName}_${subReportType}_Fabric_GRN_${selectedYear}.xlsx`;
    link.click();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#1e3a8a", color: "#fff", py: 2 }}>
        <Typography variant="h6" fontWeight="600">
          {subReportType} Fabric GRN Log ({companyName} — {selectedYear})
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {activeQuery.isLoading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" mb={2} gap={2} flexWrap="wrap">
              <TextField
                variant="outlined"
                size="small"
                label="Search GRN, Supplier or Fabric..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 320 }}
              />
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={exportToExcel}
                sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}
              >
                Export Excel
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 520, borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["S.No", "Date", "GRN No", "PO No", "Supplier", "Fabric Name", "GSM", "Color", "Qty (Kg)", "Rate", "Amount"].map((header) => (
                      <TableCell key={header} sx={{ bgcolor: "#f1f5f9", fontWeight: "600", color: "#334155" }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                        <TableCell>
                          {row.docDate ? new Date(row.docDate).toLocaleDateString("en-IN") : "-"}
                        </TableCell>
                        <TableCell>{row.docId || "-"}</TableCell>
                        <TableCell>{row.orderNo || "-"}</TableCell>
                        <TableCell>{row.supplier || "-"}</TableCell>
                        <TableCell>{row.fabricName || "-"}</TableCell>
                        <TableCell>{row.gsm || "-"}</TableCell>
                        <TableCell>{row.color || "-"}</TableCell>
                        <TableCell>{Number(row.qty || 0).toLocaleString("en-IN", { minimumFractionDigits: 3 })}</TableCell>
                        <TableCell>₹{Number(row.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>₹{Number(row.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    ))}
                  
                  <TableRow sx={{ bgcolor: "#f8fafc", fontWeight: "700" }}>
                    <TableCell colSpan={8} sx={{ fontWeight: "700" }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: "700" }}>
                      {totals.qty.toLocaleString("en-IN", { minimumFractionDigits: 3 })}
                    </TableCell>
                    <TableCell />
                    <TableCell sx={{ fontWeight: "700" }}>
                      ₹{totals.val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FabricGRNDetailsTable;
