import { useEffect, useState } from "react";
import {
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaStepBackward,
    FaStepForward,
    FaSearch,
    FaUsers,
    FaMars,
    FaVenus,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { useGetFabricInwardByCusNameQuery, useGetFabricInwardCustQuery } from "../../../redux/service/freeLookFabric";
import { getDateFromDateTimeToDisplay } from "../../../utils/hleper";
import HouseIcon from '@mui/icons-material/House';
import FactoryIcon from '@mui/icons-material/Factory';
import { DropdownWithSearch } from "../../../input/inputcomponent";
import FinYear from "../../../components/FinYear";
const CustomerTrans = ({
    closeTable,
    finYear,
    selectedYear,
    setSelectedYear,
    category,
    setCategory,
    custName,
    setCustName,
    setFYear,
}) => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [selectmonths, setSelectmonths] = useState("");

    const recordsPerPage = 40;

    const { data: cusTransData } = useGetFabricInwardByCusNameQuery({
        params: {
            finyear: selectedYear,
            category: category,
            customer: custName
        },
    }, {
        skip: !selectedYear || !category
    });

    const { data: custNames } = useGetFabricInwardCustQuery({
        params: {
        },
    });

    const cusData = custNames?.data.map((custName) => ({
        custName: custName,
        id: custName,
    }));

    useEffect(() => {
        setCurrentPage(1);
    }, [cusTransData]);

    const downloadExcel = () => {
        if (filteredData.length === 0) {
            alert("No data to export!");
            return;
        }

        const headers = [
            ["Inv No", "Inv Date", "Order No", "Fabric Name", "Dia", "Uom", "Qty"],
        ];

        const data = filteredData.map((row) => [
            row.grnNo,
            row.invDate,
            row.orderNo,
            row.fabName,
            row.dia,
            row.uom,
            row.qty
        ]);

        const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);

        // Apply style to header row
        const headerRange = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
            const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[cell_address]) continue;

            ws[cell_address].s = {
                fill: { fgColor: { rgb: "FFFF00" } },
                font: { bold: true, color: { rgb: "000000" } },
                alignment: { horizontal: "center", vertical: "center" },
            };
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Employees Data");

        XLSX.writeFile(wb, "FabricInward_Details.xlsx");
    };

    const filteredData = Array.isArray(cusTransData?.data)
        ? cusTransData.data.filter((row) => {

            // 🔹 Existing search filter
            const searchMatch = Object.entries(search).every(([key, value]) => {
                if (!value) return true;
                return row[key]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase());
            });

            if (!searchMatch) return false;

            // 🔹 Month filter
            if (!selectmonths) return true;

            const invDate = new Date(row.invDate);
            if (isNaN(invDate)) return false;

            const monthYear = invDate.toLocaleString("en-IN", {
                month: "long",
                year: "numeric",
            });

            return monthYear === selectmonths;
        })
        : [];

    const totalNetPay = filteredData.reduce(
        (sum, row) => sum + (Number(row.PF) || 0),
        0
    );
    const totalQty = filteredData.reduce(
        (sum, row) => sum + (Number(Math.round(row.qty)) || 0),
        0
    );
    console.log(totalNetPay, "Total Net Pay");

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    const totalRecords = filteredData.length;

    const currentRecords = filteredData.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const { minNetPay, maxNetPay } = currentRecords.reduce(
        (acc, item) => ({
            minNetPay: Math.min(acc.minNetPay, item.PF),
            maxNetPay: Math.max(acc.maxNetPay, item.PF),
        }),
        { minNetPay: Infinity, maxNetPay: -Infinity }
    );

    const handleFilterClick = (type) => {
        setCategory(type);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <div className="bg-white p-4 rounded-lg shadow-2xl w-[1250px] max-w-[1250px]  h-[590px] max-h-[590px] relative">
                <button
                    onClick={closeTable}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
                >
                    <FaTimes size={20} />
                </button>

                <div className="grid grid-cols-2">
                    <div className="text-start">
                        <h2 className="text-m font-bold text-gray-800 uppercase ">
                            Customer Insights -{" "}
                            <span className="text-blue-600">{custName}</span>
                        </h2>
                        <div className="flex items-start justify-start mb-1">
                            {/* Left: Total Records */}
                            <p className="text-[12px] text-gray-500 font-medium">
                                Total Records: {totalRecords}
                            </p>

                            {/* Right: Total Netpay */}

                            <div className="text-right ml-5 text-[12px]">
                                <p className=" text-gray-500 font-medium">
                                    Total Qty:{" "}
                                    <span className="text-sky-700 pl-2">

                                        ₹{totalQty}
                                    </span>
                                </p>
                            </div>
                            {/* <div className="text-right ml-5 text-[12px]">
                                <p className=" text-gray-500 font-medium">
                                    Total Employer share:{" "}
                                    <span className="text-sky-700 pl-2">
                                        {" "}
                                        ₹{totalNetPay1.toLocaleString("en-IN")}
                                    </span>
                                </p>
                            </div> */}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 items-center mb-4  mr-5">
                        <div className="w-48">
                            <DropdownWithSearch
                                options={cusData || []}
                                labelField={"custName"}
                                label={""}
                                value={custName}
                                setValue={setCustName}
                                className="mt-1"
                            />
                        </div>
                        <div className="bg-gray-300  rounded-lg shadow-2xl grid grid-cols-2 gap-2 p-2">
                            <button
                                onClick={() => handleFilterClick("INHOUSE")}
                                className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full shadow-md transition-all 
        ${category === "INHOUSE"
                                        ? "bg-blue-600 text-white scale-105"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            >
                                <HouseIcon fontSize="small" /> INHOUSE
                            </button>
                            <button
                                onClick={() => handleFilterClick("OUTSIDE")}
                                className={`flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full shadow-md transition-all 
        ${category === "OUTSIDE"
                                        ? "bg-blue-600 text-white scale-105"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            >
                                <FactoryIcon fontSize="small" /> OUTSIDE
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-start">
                    <div className="grid grid-cols-6 gap-2 mb-3">
                        {[
                            { label: "INV NO", key: "grnNo" },
                            { label: "INV DATE", key: "invDate" },
                            { label: "ORDER NO", key: "orderNo" },
                            { label: "FABRIC NAME", key: "fabName" },
                        ].map(({ label, key }) => (
                            <div key={key} className="relative">
                                <input
                                    type="text"
                                    placeholder={`Search ${label}...`}
                                    value={search[key] || ""}
                                    onChange={(e) =>
                                        setSearch({ ...search, [key]: e.target.value })
                                    }
                                    className="w-full h-6 p-1 pl-8 text-gray-900 text-[11px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                                />
                                <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-sm" />
                            </div>
                        ))}

                        {/* <div className="flex items-center gap-4 text-[12px] "> */}
                        {/* <div className="flex items-center text-[12px]">
                            <span className="text-gray-500">Min Netpay:</span>
                            <input
                                type="number"
                                value={netpayRange.min}
                                onChange={(e) =>
                                    setNetpayRange({
                                        ...netpayRange,
                                        min: Number(e.target.value),
                                    })
                                }
                                className="w-24 h-6 p-1 border border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>


                        <div className="flex items-center  text-[12px]">
                            <span className="text-gray-500">Max Netpay:</span>
                            <input
                                type="number"
                                value={netpayRange.max === Infinity ? "" : netpayRange.max}
                                onChange={(e) =>
                                    setNetpayRange({
                                        ...netpayRange,
                                        max: Number(e.target.value),
                                    })
                                }
                                className="w-24 h-6 p-1 border border-gray-300 rounded-md text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div> */}
                    </div>
                    <div className="right-0 flex gap-2">
                        <div className="flex items-center w-28">
                            <select
                                value={selectedYear}
                                autoFocus={true}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className={`w-full px-2 py-1 text-xs border border-slate-300 rounded-md 
    focus:border-indigo-300 focus:outline-none transition-all duration-200
    hover:border-slate-400 `}                            >
                                {finYear?.data?.map((option) => (
                                    <option key={option.finYear} value={option.finYear}>
                                        {option.finYear}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <FinYear
                            selectedYear={selectedYear}
                            selectmonths={selectmonths}
                            setSelectmonths={setSelectmonths}
                        />
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

                <div className="grid grid-cols-1 gap-6">
                    <div
                        className="overflow-x-auto max-h-[450px] "
                        style={{ border: "1px solid gray", borderRadius: "16px" }}
                    >
                        <table className="w-full border-collapse border border-gray-300 text-[11px]">
                            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                                <tr>
                                    <th className="border p-1 text-center w-8">S.No</th>
                                    <th className="border p-1 text-center w-24">INV No</th>
                                    <th className="border p-1 text-center w-16">INV Date</th>
                                    <th className="border p-1 text-center w-24">Order No</th>
                                    <th className="border p-1 text-center w-56">Fabric name</th>
                                    <th className="border p-1 text-center w-12">Dia</th>
                                    <th className="border p-1 text-center w-12">Uom</th>
                                    <th className="border p-1 text-center w-12">Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.slice(0, 40).map((row, index) => {
                                    const globalIndex = index; // 0–16
                                    const serialNo =
                                        (currentPage - 1) * recordsPerPage + globalIndex + 1;
                                    return (
                                        <tr
                                            key={index}
                                            className="text-gray-800 bg-white even:bg-gray-100 "
                                        >

                                            <td className="border p-1 text-[10px] text-center">
                                                {serialNo}
                                            </td>
                                            <td className="border p-1 text-[10px] ">
                                                {row.grnNo}
                                            </td>
                                            <td className="border p-1 text-[10px]  text-center">
                                                {getDateFromDateTimeToDisplay(row.invDate)}
                                            </td>
                                            <td
                                                className="border p-1 text-[10px] "
                                            >
                                                {row.orderNo}
                                            </td>
                                            <td
                                                className="border p-1 text-[10px]  overflow-hidden text-ellipsis "
                                                style={{ maxWidth: "100px" }}
                                            >
                                                {row.fabName}
                                            </td>
                                            <td className="border p-1 text-[10px]  ">
                                                {row.dia}
                                            </td>
                                            <td className="border p-1 text-[10px] ">
                                                {row.uom}
                                            </td>
                                            <td className="border p-1 text-sky-700 text-[10px] text-right ">
                                                {row.qty}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* <div
                        className="overflow-x-auto max-h-[455px]"
                        style={{ border: "1px solid gray", borderRadius: "16px" }}
                    >
                        <table className="w-full border-collapse border border-gray-300 text-[11px]">
                            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                                <tr>
                                    <th className="border p-1 text-left">S.No</th>
                                    <th className="border p-1 text-left">INV No</th>
                                    <th className="border p-1 text-left">INV Date</th>
                                    <th className="border p-1 text-left">Order No</th>
                                    <th className="border p-1 text-left">Fabric name</th>
                                    <th className="border p-1 text-left">Dia</th>
                                    <th className="border p-1 text-left">Uom</th>
                                    <th className="border p-1 text-left">Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.slice(17, 34).map((row, index) => {
                                    const globalIndex = 17 + index; // 17–33
                                    const serialNo =
                                        (currentPage - 1) * recordsPerPage + globalIndex + 1;
                                    return (
                                        <tr
                                            key={index}
                                            className="text-gray-800 bg-white even:bg-gray-100 "
                                        >

                                            <td className="border p-1 text-[10px] w-[20px]">
                                                {serialNo}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[70px]">
                                                {row.grnNo}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[40px] whitespace-nowrap">
                                                {getDateFromDateTimeToDisplay(row.invDate)}
                                            </td>
                                            <td
                                                className="border p-1 text-[10px] w-[60px]"
                                            >
                                                {row.orderNo}
                                            </td>
                                            <td
                                                className="border p-1 text-[10px] w-[100px] whitespace-nowrap overflow-hidden text-ellipsis "
                                                style={{ maxWidth: "100px" }}
                                            >
                                                {row.fabName}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[30px] whitespace-nowrap">
                                                {row.dia}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[20px]">
                                                {row.uom}
                                            </td>
                                            <td className="border p-1 text-sky-700 text-[10px] text-right w-[30px]">
                                                {row.qty}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div> */}
                </div>

                {/* Pagination */}

                <div>
                    {totalPages > 1 && (
                        <div
                            className="flex justify-end items-center mt-4 space-x-2 text-[11px] "
                            style={{ position: "absolute", bottom: "5px", right: "0px" }}
                        >
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaStepBackward size={16} />
                            </button>

                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1
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
                                className={`p-2 rounded-md ${currentPage === totalPages
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaChevronRight size={16} />
                            </button>

                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${currentPage === totalPages
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-600 hover:bg-gray-200"
                                    }`}
                            >
                                <FaStepForward size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerTrans;

// export default ESIDetailed;
