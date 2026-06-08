import { useState, useMemo } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
  FaSearch,
  FaTable,
  FaList,
} from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import moment from "moment";
import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";
import { useGetWorkOrderBillTableDataQuery } from "../../../../redux/AgfServices/ProcessDetails";

const RECORDS = 34;
const fmtDate = (d) => (d ? moment(d).format("DD-MM-YYYY") : "");

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
const WorkOrderDetailTable = ({
  companyName,
  fromDate: initFromDate,
  toDate: initToDate,
  processName: initProcessName,
  storeId: initStoreId,
  onClose,
  companyList,
  selectedfinYear,
  finYr,
}) => {
  console.log(companyName, "companyName");

  const [page, setPage] = useState(1);
  const [selectedComp, setSelectedComp] = useState(companyName);
  const [selectedYear, setSelectedYear] = useState(selectedfinYear);

  const [search, setSearch] = useState({
    ORDERNO: "",
    BUYERNAME: "",
    STYLEREFNO: "",
    COLORNAME: "",
  });

  const resetPage = () => setPage(1);

  /* ── Fetch Detail ── */
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetWorkOrderBillTableDataQuery(
    {
      params: {
        companyName: selectedComp,
        selectedYear,
      },
    },
    { skip: !selectedComp || !selectedYear },
  );

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
        // ← was rawData
        (r) =>
          textMatch(r, "ORDERNO", search.ORDERNO) &&
          textMatch(r, "BUYERNAME", search.BUYERNAME) &&
          textMatch(r, "STYLEREFNO", search.STYLEREFNO) &&
          textMatch(r, "COLORNAME", search.COLORNAME),
      ),
    [rawData, search],
  );

  /* ── Totals ── */
  /* ── Totals ── */
  const totalQty = useMemo(
    () => rawData.reduce((sum, r) => sum + Number(r.WOQTY || 0), 0),
    [rawData],
  );
  const totalRate = useMemo(
    () => rawData.reduce((sum, r) => sum + Number(r.BILLRATE || 0), 0),
    [rawData],
  );
  const totalAmount = useMemo(
    () => rawData.reduce((sum, r) => sum + Number(r.NETAMOUNT || 0), 0),
    [rawData],
  );

  /* ── Pagination ── */
  const totalPages = Math.ceil(rawData.length / RECORDS) || 1;
  const currentRows = rawData.slice((page - 1) * RECORDS, page * RECORDS);

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

  /* ── Excel Export ── */
  const handleExport = async () => {
    if (!rawData.length) {
      alert("No data to export");
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Work Order Details");

    const columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Work Order No", key: "WONO", width: 22 },
      { header: "Work Order Date", key: "WODATE", width: 16 },
      { header: "Work Bill No", key: "WORKBILLNO", width: 28 },
      { header: "Work Description", key: "WODESC", width: 40 },
      { header: "Item Name", key: "ITEMNAME", width: 40 },
      { header: "Supplier", key: "SUPPLIER1", width: 40 },
      { header: "Qty", key: "WOQTY", width: 14 },
      { header: "Rate", key: "BILLRATE", width: 14 },
      { header: "Net Amount", key: "AMOUNT", width: 16 },
    ];

    ws.columns = columns;
    const mergeEnd = String.fromCharCode(64 + columns.length);

    // Row 1 — Title
    ws.insertRow(1, ["Work Order Details"]);
    ws.mergeCells(`A1:${mergeEnd}1`);
    const tc = ws.getCell("A1");
    tc.font = { bold: true, size: 13, color: { argb: "FF000000" } };
    tc.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(1).height = 28;

    // Row 2 — Insights / company info
    addInsightsRowTurnOver({
      worksheet: ws,
      startRow: 2,
      totalColumns: columns.length,
      localCompany: selectedComp,
      disableFinYear: true,
    });

    // Row 3 — Header styling
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

    // Data rows
    rawData.forEach((r, i) => {
      ws.addRow({
        sno: i + 1,
        WONO: r.WONO,
        WODATE: fmtDate(r.WODATE),
        WORKBILLNO: r.WORKBILLNO,
        WODESC: r.WODESC,
        ITEMNAME: r.ITEMNAME,
        SUPPLIER1: r.SUPPLIER1,
        WOQTY: Number(r.WOQTY || 0),
        BILLRATE: Number(r.BILLRATE || 0),
        AMOUNT: Number(r.NETAMOUNT || 0),
      });
    });

    // Data row styling
    ws.eachRow((row, rn) => {
      if (rn <= 3) return;
      row.height = 20;
      row.eachCell((cell, cn) => {
        const key = columns[cn - 1]?.key;
        const isNum = ["WOQTY", "BILLRATE", "AMOUNT"].includes(key);
        cell.alignment = {
          horizontal: key === "sno" ? "center" : isNum ? "right" : "left",
          vertical: "middle",
          indent: 1,
        };
        if (isNum) cell.numFmt = "#,##0.00";
      });
    });

    // Totals row
    const tr = ws.addRow({
      sno: "",
      WONO: "",
      WODATE: "",
      WORKBILLNO: "",
      WODESC: "",
      ITEMNAME: "",
      SUPPLIER1: "TOTAL",
      WOQTY: totalQty,
      BILLRATE: totalRate,
      AMOUNT: totalAmount,
    });
    tr.height = 22;
    tr.eachCell((cell, cn) => {
      const key = columns[cn - 1]?.key;
      const isNum = ["WOQTY", "BILLRATE", "AMOUNT"].includes(key);
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        horizontal: isNum ? "right" : "left",
        vertical: "middle",
        indent: 1,
      };
      if (isNum) cell.numFmt = "#,##0.00";
    });

    ws.views = [{ state: "frozen", ySplit: 3 }];

    const buf = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `Work_Order_Details__${selectedComp}.xlsx`,
    );
  };

  /* ── Render ── */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1360px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase text-sm">
            Work Order Details - {""}
            <span className="text-green-700">{companyName}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300 rounded-lg shadow flex gap-x-2 p-2 flex-wrap items-center">
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
                value={selectedComp || ""}
                onChange={(e) => {
                  setSelectedComp(e.target.value);
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

        {/* RECORD COUNT & TOTALS */}
        {/* RECORD COUNT & TOTALS */}
        <div className="flex gap-6 mt-1">
          <p className="text-xs font-semibold text-gray-600">
            Total Records:{" "}
            <span className="text-blue-600">{rawData?.length}</span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Total Qty:{" "}
            <span className="text-green-600">
              {Number(totalQty).toLocaleString("en-IN")}
            </span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Total Rate:{" "}
            <span className="text-green-600">
              {Number(totalRate).toLocaleString("en-IN")}
            </span>
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Total Amount:{" "}
            <span className="text-green-600">
              {Number(totalAmount).toLocaleString("en-IN")}
            </span>
          </p>
        </div>

        <div className="mt-2">
          <SearchBar
            keys={["ORDERNO", "BUYERNAME", "STYLEREFNO", "COLORNAME"]}
            labels={{
              ORDERNO: "Order No",
              BUYERNAME: "Buyer Name",
              STYLEREFNO: "Style Ref",
              COLORNAME: "Color",
            }}
            state={search}
            setState={(val) => {
              setSearch(val);
              resetPage();
            }}
          />
        </div>

        <>
          <div
            className="overflow-x-auto border border-gray-300"
            style={{ height: "455px", borderRadius: "12px" }}
          >
            <table className="w-[1600px] overflow-y-auto border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <TH cls="w-6">S.No</TH>
                  <TH cls="w-24">Work Order No</TH>
                  <TH cls="w-20">Work Order Date</TH>
                  <TH cls="w-32">Work Bill No</TH>
                  <TH cls="w-44">Work Description</TH>
                  <TH cls="w-44">Item Name</TH>
                  <TH cls="w-44">Supplier</TH>
                  <TH cls="w-16">Qty</TH>
                  <TH cls="w-16">Rate</TH>
                  <TH cls="w-16">Net Amount</TH>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <LoadingRow cols={9} />
                ) : currentRows.length === 0 ? (
                  <EmptyRow cols={9} />
                ) : (
                  currentRows.map((row, i) => (
                    <tr
                      key={i}
                      className="text-gray-800 bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                    >
                      <td className="border p-1 text-center text-gray-500">
                        {(page - 1) * RECORDS + i + 1}
                      </td>
                      <td className="border p-1 pl-2 ">{row.WONO}</td>
                      <td className="border p-1 pl-1">{fmtDate(row.WODATE)}</td>
                      <td className="border p-1 pl-2">{row.WORKBILLNO}</td>
                      <td className="border p-1 pl-2">{row.WODESC}</td>
                      <td className="border p-1 pl-2">{row.ITEMNAME}</td>
                      <td className="border p-1 pl-2">{row.SUPPLIER1}</td>
                      <td className="border p-1 pr-2 text-right ">
                        {row.WOQTY?.toFixed(2) || 0}
                      </td>
                      {/* <td className="border p-1 pr-2 text-right ">
                        {Number(row.BILLRATE || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="border p-1 pr-2 text-right ">
                        {Number(row.AMOUNT || 0).toLocaleString("en-IN")}
                      </td> */}

                      <td className="border p-1 pr-2 text-right text-sky-700 ">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(row.BILLRATE)}
                      </td>
                      <td className="border p-1 pr-2 text-right text-sky-700 ">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(row.NETAMOUNT)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={totalPages} setPage={setPage} />
        </>
      </div>
    </div>
  );
};

export default WorkOrderDetailTable;
