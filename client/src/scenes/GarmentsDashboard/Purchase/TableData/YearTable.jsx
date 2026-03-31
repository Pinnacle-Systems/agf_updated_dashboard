import { useState, useMemo, useEffect } from "react";
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

import {
  useGetGeneralYearQuery,
  useGetGreyYarnTableQuery,
} from "../../../../redux/service/purchaseServiceTable";

import {
  addInsightsRowTurnOver,
  formatQtyByUOM,
  getExcelQtyFormatByUOM,
} from "../../../../utils/hleper";
import SpinLoader from "../../../../utils/spinLoader";
import moment from "moment";
import { useSelector } from "react-redux";
// import FinYear from "../../../../components/FinYear";
const YearWiseTable = ({
  year,
  poType = "General",
  companyList,
  finYr,
  closeTable,
  filterBuyerList,
  valOptions,
}) => {
  const { filterBuyer: companyName } = useSelector(
    (state) => state.dashboardFilters,
  );

  const [selectedYear, setSelectedYear] = useState(year || "");
  const [localCompany, setLocalCompany] = useState(companyName || "ALL");
  const [localPoType, setLocalPoType] = useState(poType || "General");
  const [selectedOrderType, setSelectedOrdertype] = useState("");
  const [search, setSearch] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 34;

  const [netpayRange, setNetpayRange] = useState({
    min: 0,
    max: Infinity,
  });

  // ✅ API CALL INSIDE TABLE
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetGeneralYearQuery(
    {
      params: { selectedYear, companyName: localCompany },
    },
    { skip: !selectedYear || !companyName },
  );

  const rawData = useMemo(() => {
    return Array.isArray(response?.data) ? response.data : [];
  }, [response?.data]);

  console.log(rawData, "rawData");

  // ✅ FILTERING
  const filteredData = useMemo(() => {
    return rawData.filter((row) => {
      // 🔹 Customer dropdown filter

      // 🔹 Search filter (month search)
      if (search.docId) {
        const rowdocId = row.docId?.toLowerCase() || "";
        if (!rowdocId.includes(search.docId.toLowerCase())) {
          return false;
        }
      }

      if (search.itemGroup) {
        const rowItemGroup = row.itemGroup?.toLowerCase() || "";
        if (!rowItemGroup.includes(search.itemGroup.toLowerCase())) {
          return false;
        }
      }

      if (search.itemName) {
        const rowitemName = row.item?.toLowerCase() || "";
        if (!rowitemName.includes(search.itemName.toLowerCase())) {
          return false;
        }
      }
      if (search.supplier) {
        const rowsupplier = row.supplier?.toLowerCase() || "";
        if (!rowsupplier.includes(search.supplier.toLowerCase())) {
          return false;
        }
      }

      // 🔹 Min / Max Turnover filter
      const value = Number(row.amount || 0);

      if (value < netpayRange.min) return false;
      if (netpayRange.max !== Infinity && value > netpayRange.max) return false;

      return true;
    });
  }, [rawData, search, netpayRange]);

  useEffect(() => {
    setSelectedYear(year || "");
    setCurrentPage(1);
  }, [year]);

  useEffect(() => {
    setLocalCompany(companyName || "ALL");
  }, [companyName]);

  useEffect(() => {
    setCurrentPage(1);
  }, [localPoType]);

  // ✅ TOTAL
  const totalAmount = useMemo(
    () => filteredData.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [filteredData],
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  const formateDate = (date) => {
    if (!date) return;

    return moment(date).format("DD-MM-YYYY");
  };

  // ✅ EXCEL EXPORT
  const downloadExcel = async () => {
    if (!filteredData.length) {
      alert("No data");
      return;
    }

    const totalRate = filteredData.reduce(
      (sum, r) => sum + Number(r.rate || 0),
      0,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Year Wise Purchase Report");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Doc No", key: "docNo", width: 24 },
      { header: "Doc Date", key: "docDate", width: 16 },
      { header: "Item Group", key: "itemGroup", width: 20 },
      { header: "Item Name", key: "item", width: 70 },
      { header: "Supplier", key: "supplier", width: 50 },
      { header: "Qty", key: "qty", width: 12 },
      { header: "UOM", key: "uom", width: 14 },
      { header: "Rate", key: "rate", width: 18 },
      { header: "Amount", key: "amount", width: 20 },
    ];

    // Title
    worksheet.insertRow(1, ["Year Wise Purchase Report"]);
    worksheet.mergeCells("A1:J1");
    const titleCell = worksheet.getCell("A1");
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(1).height = 30;

    // Insights row
    addInsightsRowTurnOver({
      worksheet,
      startRow: 2,
      totalColumns: 3,
      selectedYear,
      localCompany,
      dynamicField: "PO Type",
      dynamicValue: localPoType,
    });

    // Header formatting
    const headerRow = worksheet.getRow(3);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
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

    // Add data rows
    filteredData.forEach((r, index) => {
      const row = worksheet.addRow({
        sno: index + 1,
        docNo: r.docId,
        docDate: formateDate(r.docDate),
        itemGroup: r.itemGroup,
        item: r.item,
        supplier: r.supplier,
        qty: Number(r.qty || 0),
        uom: r.uom,
        rate: Number(r.rate || 0),
        amount: Number(r.amount || 0),
      });
      row.getCell("qty").numFmt = getExcelQtyFormatByUOM(r.uom);
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return;
      row.height = 22;
      [
        "sno",
        "docNo",
        "docDate",
        "itemGroup",
        "item",
        "supplier",
        "qty",
        "uom",
        "rate",
        "amount",
      ].forEach((key, i) => {
        const cell = row.getCell(i + 1);
        if (["qty", "rate", "amount"].includes(key)) {
          cell.alignment = {
            horizontal: "right",
            vertical: "middle",
            indent: 1,
          };
        } else {
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            indent: 1,
          };
        }
      });
    });

    // Total row
    const totalRow = worksheet.addRow({
      sno: "",
      docNo: "",
      docDate: "",
      itemGroup: "",
      item: "",
      supplier: "",
      qty: "",
      uom: "Total",
      rate: totalRate,
      amount: totalAmount,
    });

    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = { top: { style: "thin" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 9 || colNumber === 10 ? "right" : "center",
      };
    });

    worksheet.getColumn("docDate").numFmt = "dd-mm-yyyy";
    worksheet.getColumn("rate").numFmt = "₹ #,##,##0.00";
    worksheet.getColumn("amount").numFmt = "₹ #,##,##0.00";

    // Freeze headers
    worksheet.views = [{ state: "frozen", ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Year Wise Purchase Report.xlsx",
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="bg-white w-[1470px] h-[630px] p-4 rounded-xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold uppercase">
            Year Wise Purchase Report -{" "}
            <span className="text-blue-600 ">{localCompany || ""}</span>
          </h2>

          <div className="flex gap-2 items-center">
            <div className="bg-gray-300  rounded-lg shadow-2xl flex gap-x-4 gap-1 p-2">
              <button
                onClick={() => setLocalPoType("General")}
                className={`w-20 text-center flex items-center justify-center gap-2 px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
                  ${
                    localPoType === "General"
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                General
              </button>

              <button
                onClick={() => setLocalPoType("Order")}
                className={`w-16 text-center flex items-center justify-center gap-2 px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
                  ${
                    localPoType === "Order"
                      ? "bg-blue-600 text-white scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                Order
              </button>

              <div className="w-24">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2 rounded-md border-blue-600 transition-all duration-200"
                >
                  <option value="">Select Year</option>
                  {(finYr?.data || []).map((item) => (
                    <option key={item.finYear} value={item.finYear}>
                      {item.finYear}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-28">
                <select
                  value={localCompany || ""}
                  onChange={(e) => {
                    setLocalCompany(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2 py-1 text-xs border-2 rounded-md border-blue-600 transition-all duration-200"
                >
                  <option value="">Select Company</option>
                  {companyList?.data?.map((item) => (
                    <option key={item.COMPCODE} value={item.COMPCODE}>
                      {item.COMPCODE}
                    </option>
                  ))}
                </select>
              </div>
              {poType === "Order" ? (
                <>
                  <div className="w-28">
                    <select
                      value={localCompany || ""}
                      onChange={(e) => {
                        setLocalCompany(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-2 py-1 text-xs border-2 rounded-md border-blue-600 transition-all duration-200"
                    >
                      <option value="">Select Company</option>
                      {companyList?.data?.map((item) => (
                        <option key={item.COMPCODE} value={item.COMPCODE}>
                          {item.COMPCODE}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            <button className="text-red-600" onClick={closeTable}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* TOTAL */}
        <p className="text-xs font-semibold  text-gray-600">
          Total Amount :{" "}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(totalAmount)}
        </p>

        {/* SEARCH */}

        <div className="flex justify-between items-start mt-2">
          <div className="flex gap-x-4 mb-3">
            {["docId", "itemGroup", "itemName", "supplier"].map((key) => (
              <div key={key} className="relative">
                <input
                  type="text"
                  placeholder={`Search ${key}...`}
                  value={search[key] || ""}
                  onChange={(e) =>
                    setSearch({ ...search, [key]: e.target.value })
                  }
                  className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                />
                <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
              </div>
            ))}
          </div>
          <div className=" flex gap-x-2">
            <div className="flex items-center text-[12px]">
              <span className="text-gray-500">Min amount : </span>
              <input
                type="text"
                value={netpayRange.min}
                onChange={(e) =>
                  setNetpayRange({
                    ...netpayRange,
                    min: Number(e.target.value),
                  })
                }
                className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center  text-[12px]">
              <span className="text-gray-500">Max amount : </span>
              <input
                type="text"
                value={netpayRange.max === Infinity ? "" : netpayRange.max}
                onChange={(e) => {
                  const val = e.target.value;

                  setNetpayRange({
                    ...netpayRange,
                    max: val === "" ? Infinity : Number(val),
                  });
                }}
                className="w-24 h-6 p-1 border ml-1 border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={downloadExcel}
              className="p-0 rounded-full shadow-md hover:brightness-110 transition-all duration-300"
              title="Download Excel"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                alt="Download Excel"
                className="w-7 h-7 rounded-lg"
              />
            </button>
          </div>
        </div>
        {/* TABLE */}
        <div className="grid  gap-4">
          <div
            className="overflow-x-auto h-[470px]  border border-gray-300"
            style={{ border: "1px solid gray", borderRadius: "16px" }}
          >
            <table className="w-full border-collapse text-[11px] table-fixed">
              <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                <tr>
                  <th className="border p-1 text-center w-4">S.No</th>
                  {/* <th className="border p-1 text-center w-8">Year</th> */}
                  <th className="border p-1 text-center w-16">Doc No</th>
                  <th className="border p-1 text-center w-[38px]">Doc Date</th>
                  <th className="border p-1 text-center w-12">Item Group</th>
                  <th className="border p-1 text-center w-52">Item Name</th>
                  <th className="border p-1 text-center w-36">Supplier</th>
                  <th className="border p-1 text-center w-8">Qty</th>
                  <th className="border p-1 text-center w-8">UOM</th>
                  <th className="border p-1 text-center w-8">Rate</th>
                  <th className="border p-1 text-center w-12">Amount</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={10} className=" text-center">
                      <div className="flex justify-center items-center pointer-events-none">
                        <SpinLoader />
                      </div>
                    </td>
                  </tr>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-6 text-gray-500 border-b-0"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  currentRecords?.map((row, index) => {
                    const globalIndex = index; // 0–16
                    const serialNo =
                      (currentPage - 1) * recordsPerPage + globalIndex + 1;

                    return (
                      <tr
                        key={index}
                        className="text-gray-800 bg-white even:bg-gray-100"
                      >
                        <td className="border p-1 text-center">{serialNo}</td>
                        {/* <td className="border p-1 pl-2 text-left">
                          {row.finYear}
                        </td> */}
                        <td className="border p-1 pl-2 text-left">
                          {row.docId}
                        </td>

                        <td className="border p-1 pl-2 text-left ">
                          {formateDate(row.docDate)}
                        </td>
                        <td className="border p-1 pl-2 text-left ">
                          {row.itemGroup}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.item}
                        </td>
                        <td className="border p-1 pr-2 text-left">
                          {row.supplier}
                        </td>
                        <td className="border p-1 pr-2 text-right">
                          {" "}
                          {formatQtyByUOM(row.qty, row.uom)}
                        </td>
                        <td className="border p-1 pl-2 text-left">{row.uom}</td>

                        {/* <td className="border p-1 pr-2 text-right">{row.rate}</td> */}

                        <td className="border p-1 pr-2 text-right  ">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(row.rate)}
                        </td>
                        <td className="border p-1 pr-2 text-right text-sky-700 ">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(row.amount)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div>
          <div
            className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
            style={{ position: "absolute", bottom: "5px", right: "0px" }}
          >
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-gray-200"
              }`}
            >
              <FaStepBackward size={16} />
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-gray-200"
              }`}
            >
              <FaChevronLeft size={16} />
            </button>

            <span className="text-xs font-semibold px-3">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-gray-200"
              }`}
            >
              <FaChevronRight size={16} />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-gray-200"
              }`}
            >
              <FaStepForward size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearWiseTable;
