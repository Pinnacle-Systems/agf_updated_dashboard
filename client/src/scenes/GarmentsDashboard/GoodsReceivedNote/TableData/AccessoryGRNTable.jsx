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
import { useGetAccessoryGRNTableQuery } from "../../../../redux/AgfServices/GRNservices";
import ExcelJS from "exceljs";

const AccessoryGRNTable = ({ open, onClose, companyName, selectedYear }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading } = useGetAccessoryGRNTableQuery(
    { params: { selectedYear, companyName } },
    { skip: !open }
  );
  const rawData = response?.data ?? [];

  const filteredData = useMemo(() => {
    if (!searchTerm) return rawData;
    const lower = searchTerm.toLowerCase();
    return rawData.filter(
      (row) =>
        String(row.docId || "").toLowerCase().includes(lower) ||
        String(row.supplier || "").toLowerCase().includes(lower) ||
        String(row.item || row.accessItemName || "").toLowerCase().includes(lower) ||
        String(row.accessGroupName || "").toLowerCase().includes(lower)
    );
  }, [rawData, searchTerm]);

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
    const worksheet = workbook.addWorksheet("Accessory GRN");

    worksheet.addRow(["Accessory GRN Register"]);
    worksheet.mergeCells("A1:L1");
    const title = worksheet.getCell("A1");
    title.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFFFF" } };
    title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1E3A8A" } };
    title.alignment = { horizontal: "center" };
    worksheet.getRow(1).height = 40;

    worksheet.addRow([`Company: ${companyName}   |   Financial Year: ${selectedYear}`]);
    worksheet.mergeCells("A2:L2");
    const sub = worksheet.getCell("A2");
    sub.font = { name: "Calibri", size: 11, italic: true };
    sub.alignment = { horizontal: "center" };

    worksheet.addRow([]);

    const headers = ["S.No", "Date", "GRN No", "PO No", "Supplier", "Accessory Group", "Item Name", "Size", "Qty", "UOM", "Rate", "Amount"];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "3B82F6" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    filteredData.forEach((row, i) => {
      const dataRow = worksheet.addRow([
        i + 1,
        row.docDate ? new Date(row.docDate).toLocaleDateString("en-IN") : "",
        row.docId || "",
        row.orderNo || "",
        row.supplier || "",
        row.accessGroupName || "",
        row.item || row.accessItemName || "",
        row.accessSize || "",
        Number(row.qty || 0),
        row.uom || "",
        Number(row.price || row.rate || 0),
        Number(row.amount || 0),
      ]);
      dataRow.getCell(9).numFmt = "#,##0.000";
      dataRow.getCell(11).numFmt = "₹#,##0.00";
      dataRow.getCell(12).numFmt = "₹#,##0.00";
    });

    const lastRowIndex = worksheet.lastRow.number;
    const totalsRow = worksheet.addRow([
      "Total", "", "", "", "", "", "", "",
      { formula: `SUM(I5:I${lastRowIndex})` },
      "", "",
      { formula: `SUM(L5:L${lastRowIndex})` }
    ]);
    totalsRow.getCell(9).numFmt = "#,##0.000";
    totalsRow.getCell(12).numFmt = "₹#,##0.00";

    worksheet.columns.forEach((col) => { col.width = 18; });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${companyName}_Accessory_GRN_${selectedYear}.xlsx`;
    link.click();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#1e3a8a", color: "#fff" }}>
        <Typography variant="h6">Accessory GRN Log ({companyName} — {selectedYear})</Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" mb={2} gap={2}>
              <TextField
                variant="outlined"
                size="small"
                label="Search Accessory GRN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 320 }}
              />
              <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={exportToExcel} sx={{ bgcolor: "#10b981" }}>Export Excel</Button>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["S.No", "Date", "GRN No", "PO No", "Supplier", "Accessory Group", "Item Name", "Size", "Qty", "UOM", "Rate", "Amount"].map((header) => (
                      <TableCell key={header} sx={{ bgcolor: "#f1f5f9", fontWeight: "600" }}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                      <TableCell>{row.docDate ? new Date(row.docDate).toLocaleDateString("en-IN") : "-"}</TableCell>
                      <TableCell>{row.docId || "-"}</TableCell>
                      <TableCell>{row.orderNo || "-"}</TableCell>
                      <TableCell>{row.supplier || "-"}</TableCell>
                      <TableCell>{row.accessGroupName || "-"}</TableCell>
                      <TableCell>{row.item || row.accessItemName || "-"}</TableCell>
                      <TableCell>{row.accessSize || "-"}</TableCell>
                      <TableCell>{Number(row.qty || 0).toLocaleString("en-IN", { minimumFractionDigits: 3 })}</TableCell>
                      <TableCell>{row.uom || "-"}</TableCell>
                      <TableCell>₹{Number(row.price || row.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>₹{Number(row.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: "#f8fafc", fontWeight: "700" }}>
                    <TableCell colSpan={8}>Total</TableCell>
                    <TableCell>{totals.qty.toLocaleString("en-IN", { minimumFractionDigits: 3 })}</TableCell>
                    <TableCell colSpan={2} />
                    <TableCell>₹{totals.val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
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
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AccessoryGRNTable;
