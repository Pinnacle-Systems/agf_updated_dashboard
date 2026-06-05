import { useState, useMemo } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
  FaSearch,
} from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { addInsightsRowTurnOver } from "../../../../utils/hleper";
import { useGetDyedFabricProcessDetailsTableQuery, useGetYarnProcessDetailsTableQuery } from "../../../../redux/AgfServices/ProcessDetails";

const RECORDS = 34;
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
const STATUS_OPTIONS = ["ALL", "INHOUSE", "INPROGRESS"];

/* ── Pagination ── */
const Pagination = ({ page, total, setPage }) => (
  <div
    className="flex justify-end items-center mt-4 space-x-2 text-[11px]"
    style={{ position: "absolute", bottom: "5px", right: "0px" }}
  >
    <button
      onClick={() => setPage(1)}
      disabled={page === 1}
      className={`p-2 rounded-md ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
    >
      <FaStepBackward size={16} />
    </button>
    <button
      onClick={() => setPage((p) => Math.max(p - 1, 1))}
      disabled={page === 1}
      className={`p-2 rounded-md ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
    >
      <FaChevronLeft size={16} />
    </button>
    <span className="text-xs font-semibold px-3">
      Page {page} of {total || 1}
    </span>
    <button
      onClick={() => setPage((p) => Math.min(p + 1, total))}
      disabled={page === total || !total}
      className={`p-2 rounded-md ${page === total || !total ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
    >
      <FaChevronRight size={16} />
    </button>
    <button
      onClick={() => setPage(total)}
      disabled={page === total || !total}
      className={`p-2 rounded-md ${page === total || !total ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-gray-200"}`}
    >
      <FaStepForward size={16} />
    </button>
  </div>
);

/* ── SearchBar ── */
const SearchBar = ({ keys, labels, state, setState }) => (
  <div className="flex gap-x-3 mb-2 flex-wrap">
    {keys.map((key) => (
      <div key={key} className="relative">
        <input
          type="text"
          placeholder={`Search ${labels[key] || key}...`}
          value={state[key] || ""}
          onChange={(e) => setState({ ...state, [key]: e.target.value })}
          className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />
        <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
      </div>
    ))}
  </div>
);

/* ── TH ── */
const TH = ({ children, cls = "" }) => (
  <th className={`border p-1 text-center ${cls}`}>{children}</th>
);

/* ── Main ── */
const DyedFabricProcessDetailsTable = ({
  companyName,
  finYear,
  finYr,
  buyer,
  buyerName,
  buyerNames,
  initialStatus, // ← optional: "INHOUSE" | "INPROGRESS" | "ALL" passed from chart click
  onClose,
  companyList
}) => {
  const [selectedYear, setSelectedYear] = useState(finYear);
  const [selectedBuyer, setSelectedBuyer] = useState(buyerName || "ALL");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || "ALL");
  const [page, setPage] = useState(1);

  const resetPage = () => setPage(1);

  const [search, setSearch] = useState({
    ORDERNO: "",
    BUYERCODE: "",
    JOBNO: "",
    FABRIC: "",
  });

  /* ── Fetch — passes status to backend ── */
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetDyedFabricProcessDetailsTableQuery(
    {
      params: {
        finyear: selectedYear,
        buyer: selectedBuyer,
        status: selectedStatus,
      },
    },
    { skip: !selectedYear },
  );

  console.log("YarnProcessDetailsTable - API response:", response);

  const rawData = useMemo(
    () => (Array.isArray(response?.data) ? response.data : []),
    [response],
  );

  /* ── Text filter ── */
  const textMatch = (row, field, val) =>
    !val ||
    String(row[field] ?? "")
      .toLowerCase()
      .includes(val.toLowerCase());

  const filtered = useMemo(
    () =>
      rawData.filter(
        (r) =>
          textMatch(r, "ORDERNO", search.ORDERNO) &&
          textMatch(r, "BUYERCODE", search.BUYERCODE) &&
          textMatch(r, "JOBNO", search.JOBNO) &&
          textMatch(r, "FABRIC", search.FABRIC),
      ),
    [rawData, search],
  );

  /* ── Totals ── */
  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => ({
          GRNQTY: acc.GRNQTY + Number(r.GRNQTY || 0),
          TOTALVALUE: acc.TOTALVALUE + Number(r.GRNQTY || 0) * Number(r.JOBRATE || 0),
        }),
        {
          GRNQTY: 0,
          TOTALVALUE: 0,
        },
      ),
    [filtered],
  );

  /* ── Pagination ── */
  const totalPages = Math.ceil(filtered.length / RECORDS) || 1;
  const currentRows = filtered.slice((page - 1) * RECORDS, page * RECORDS);

  const LoadingRow = ({ cols }) => (
    <tr>
      <td colSpan={cols} className="text-center py-10 text-gray-400 text-xs">
        Loading...
      </td>
    </tr>
  );
  const EmptyRow = ({ cols }) => (
    <tr>
      <td colSpan={cols} className="text-center py-10 text-gray-500 text-xs">
        No data found
      </td>
    </tr>
  );

  /* ── Status label for Excel ── */
  const statusLabel = {
    ALL: "All",
    INHOUSE: "In House",
    INPROGRESS: "In Progress",
  };

  /* ── Excel Export ── */
  const handleExport = async () => {
    if (!filtered.length) {
      alert("No data to export");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Yarn Details");

    const columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Buyer Code", key: "BUYERCODE", width: 24 },
      { header: "Job No", key: "JOBNO", width: 24 },
      { header: "Job Date", key: "JOBDATE", width: 16 },
      { header: "Order No", key: "ORDERNO", width: 24 },
      { header: "Fabric", key: "FABRIC", width: 32 },
      { header: "GSM / GG / Dia", key: "FABRIC_SPECS", width: 24 },
      { header: "Color", key: "COLOR", width: 20 },
      { header: "GRN Qty", key: "GRNQTY", width: 18 },
      { header: "Job Rate", key: "JOBRATE", width: 14 },
      { header: "Total Value", key: "TOTALVALUE", width: 20 },
    ];

    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);

    /* Row 1 — Title */
    ws.insertRow(1, [`Dyed Fabric Process Details`]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 13, color: { argb: "FF000000" } };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 28;

    /* Row 2 — Insights */
    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: 4,
      selectedYear,
      localCompany: companyName,
      dynamicField: "Buyer",
      dynamicValue: selectedBuyer,
      secondDynamicField: "Status",
      seconddynamicValue: statusLabel[selectedStatus],
    });

    /* Row 3 — Header */
    const hr = ws.getRow(3);
    hr.height = 24;
    hr.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    const qtyKeys = [
      "GRNQTY",
      "JOBRATE",
      "TOTALVALUE",
    ];

    /* Data rows */
    filtered.forEach((r, i) => {
      ws.addRow({
        sno: i + 1,
        BUYERCODE: r.BUYERCODE,
        JOBNO: r.JOBNO,
        JOBDATE: r.JOBDATE,
        ORDERNO: r.ORDERNO,
        FABRIC: r.FABRIC,
        FABRIC_SPECS: r.GSM || r.GG || r.KDIA || r.FDIA ? `${r.GSM || '-'} GSM / ${r.GG || '-'} GG / ${r.KDIA || '-'}-${r.FDIA || '-'} Dia` : '',
        COLOR: r.COLOR,
        GRNQTY: Number(r.GRNQTY || 0),
        JOBRATE: Number(r.JOBRATE || 0),
        TOTALVALUE: Number(r.GRNQTY || 0) * Number(r.JOBRATE || 0),
      });
    });

    /* Style data rows */
    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      row.height = 20;
      row.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        const isQty = qtyKeys.includes(key);
        cell.alignment = {
          horizontal: key === "sno" ? "center" : isQty ? "right" : "left",
          vertical: "middle",
          indent: 1,
        };
        if (isQty) {
          if (key === "JOBRATE") {
            cell.numFmt = "#,##0.00";
          } else {
            cell.numFmt = "#,##0.000";
          }
        }
      });
    });

    /* Totals row */
    const tr = ws.addRow({
      sno: "",
      BUYERCODE: "",
      JOBNO: "",
      JOBDATE: "",
      ORDERNO: "",
      FABRIC: "TOTAL",
      FABRIC_SPECS: "",
      COLOR: "",
      GRNQTY: totals.GRNQTY,
      JOBRATE: "",
      TOTALVALUE: totals.TOTALVALUE,
    });
    tr.height = 22;
    tr.eachCell((cell, cn) => {
      const key = columns[cn - 1]?.key;
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        horizontal: qtyKeys.includes(key) ? "right" : "left",
        vertical: "middle",
        indent: 1,
      };
      if (qtyKeys.includes(key)) {
        if (key === "JOBRATE") {
          cell.numFmt = "#,##0.00";
        } else {
          cell.numFmt = "#,##0.000";
        }
      }
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `DyedFabricProcessDetails_${selectedBuyer}_${selectedStatus}_${selectedYear}.xlsx`,
    );
  };

  /* ── Render ── */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1360px] h-[630px] p-4 rounded-xl relative">
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase text-sm">
            Dyed Fabric Status —{" "}
            <span className="text-green-700">{companyName}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow-2xl flex gap-x-2 p-2 flex-wrap items-center">
              {/* Fin Year */}
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-24"
              >
                <option value="" disabled>
                  Select Year
                </option>
                {(finYr?.data || []).map((item) => (
                  <option key={item.finYear} value={item.finYear}>
                    {item.finYear}
                  </option>
                ))}
              </select>

              <select
                value={selectedBuyer || ""}
                onChange={(e) => {
                  setSelectedBuyer(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600"
              >
                <option value="">Select Company</option>
                {companyList?.data?.map((item) => (
                  <option key={item.COMPCODE} value={item.COMPCODE}>
                    {item.COMPCODE}
                  </option>
                ))}
              </select>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  resetPage();
                }}
                className="px-2 py-1 text-xs border-2 rounded-md border-blue-600 w-32"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s === "ALL"
                      ? "All Status"
                      : s === "INHOUSE"
                        ? "In House"
                        : "In Progress"}
                  </option>
                ))}
              </select>

              {/* Excel */}
              <button
                onClick={handleExport}
                className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
                title="Download Excel"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                  alt="Excel"
                  className="w-7 h-7 rounded-lg"
                />
              </button>
            </div>

            <button className="text-red-600" onClick={onClose}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* ── RECORD COUNT & TOTALS ── */}
        <div className="flex gap-6 mt-1 flex-wrap">
          <p className="text-xs font-semibold text-gray-600">
            Total Records:{" "}
            <span className="text-blue-600">{filtered.length}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Total GRN Qty:{" "}
            <span className="text-blue-600">{fmt(totals.GRNQTY)}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Total Value:{" "}
            <span className="text-green-600">{fmt(totals.TOTALVALUE)}</span>
          </p>
        </div>

        {/* ── SEARCH ── */}
        <div className="mt-2">
          <SearchBar
            keys={["ORDERNO", "BUYERCODE", "JOBNO", "FABRIC"]}
            labels={{
              ORDERNO: "Order No",
              BUYERCODE: "Buyer Code",
              JOBNO: "Job No",
              FABRIC: "Fabric Name",
            }}
            state={search}
            setState={(val) => {
              setSearch(val);
              resetPage();
            }}
          />
        </div>

        {/* ── TABLE ── */}
        <div
          className="overflow-x-auto border border-gray-300"
          style={{ height: "455px", borderRadius: "12px" }}
        >
          <table className="w-[1850px] border-collapse text-[11px] table-fixed">
            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
              <tr>
                <TH cls="w-6">S.No</TH>
                <TH cls="w-44">BUYER CODE</TH>
                <TH cls="w-36">JOBNO</TH>
                <TH cls="w-44">JOBDATE</TH>
                <TH cls="w-36">ORDERNO</TH>
                <TH cls="w-32">FABRIC</TH>
                <TH cls="w-48">GSM / GG / DIA</TH>
                <TH cls="w-32">COLOR</TH>
                <TH cls="w-24">GRNQTY</TH>
                <TH cls="w-24">JOBRATE</TH>
                <TH cls="w-24">TOTAL VALUE</TH>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <LoadingRow cols={11} />
              ) : currentRows.length === 0 ? (
                <EmptyRow cols={11} />
              ) : (
                <>
                  {currentRows.map((row, i) => (
                    <tr
                      key={i}
                      className="text-gray-800 bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                    >
                      <td className="border p-1 text-center text-gray-500">
                        {(page - 1) * RECORDS + i + 1}
                      </td>
                      <td className="border p-1 pl-2">{row.BUYERCODE}</td>
                      <td className="border text-left p-1 pl-2">
                        {row.JOBNO}
                      </td>
                      <td className="border p-1 pl-2">{row.JOBDATE}</td>
                      <td className="border text-left p-1 pl-2">{row.ORDERNO}</td>
                      <td className="border text-left p-1 pl-2">
                        {row.FABRIC}
                      </td>
                      <td className="border text-left p-1 pl-2">
                        {row.GSM || row.GG || row.KDIA || row.FDIA ? `${row.GSM || '-'} GSM / ${row.GG || '-'} GG / ${row.KDIA || '-'}-${row.FDIA || '-'} Dia` : '-'}
                      </td>
                      <td className="border p-1 pr-2 text-right">
                        {(row.COLOR)}
                      </td>
                      <td className="border p-1 pr-2 text-right">
                        {fmt(row.GRNQTY)}
                      </td>
                      <td className="border p-1 pr-2 text-right text-red-600">
                        {fmt(row.JOBRATE)}
                      </td>
                      <td className="border p-1 pr-2 text-right">
                        {fmt(Number(row.GRNQTY) * Number(row.JOBRATE))}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <Pagination page={page} total={totalPages} setPage={setPage} />
      </div>
    </div>
  );
};

export default DyedFabricProcessDetailsTable;
