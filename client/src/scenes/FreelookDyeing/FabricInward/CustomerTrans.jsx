import { useEffect, useState } from "react";
import {
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaStepBackward,
    FaStepForward,
    FaSearch,
    FaUserTie,
    FaUsers,
    FaMars,
    FaVenus,
} from "react-icons/fa";
import { IoMaleFemale } from "react-icons/io5";
import * as XLSX from "xlsx";
import { useGetFabricInwardByCusNameQuery } from "../../../redux/service/freeLookFabric";


const CustomerTrans = ({
    closeTable,
    finYear,
    selectedYear,
    category,
    custName,
    setCustName,
    selectmonths,
    setFYear,
    setCategory,
}) => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 34;

    const { data: cusTransData } = useGetFabricInwardByCusNameQuery({
        params: {
            finyear: selectedYear,
            category: category,
            customer: custName
        },
    }, {
        skip: !selectedYear || !category
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [cusTransData]);


    const downloadExcel = () => {
        if (filteredData.length === 0) {
            alert("No data to export!");
            return;
        }

        const headers = [
            ["GRN No", "Order No", "Delivery To", "Fabric Name", "Dia", "Uom", "Qty"],
        ];

        const data = filteredData.map((row) => [
            row.grnNo,
            row.orderNo,
            row.deliveryTo,
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
        ? cusTransData.data.filter((row) =>
            Object.entries(search).every(([key, value]) => {
                if (!value) return true; // ignore empty search
                return row[key]
                    ?.toString()
                    .toLowerCase()
                    .includes(value.toLowerCase());
            })
        )
        : [];

    const totalNetPay = filteredData.reduce(
        (sum, row) => sum + (Number(row.PF) || 0),
        0
    );
    const totalNetPay1 = filteredData.reduce(
        (sum, row) => sum + (Number(Math.round(row.EMPLOYER_CON)) || 0),
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <div className="bg-white p-4 rounded-lg shadow-2xl w-[1300px] max-w-[1300px]  h-[590px] max-h-[590px] relative">
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
                            {/* <div className="text-right ml-5 text-[12px]">
                                <p className=" text-gray-500 font-medium">
                                    Total Netpay:{" "}
                                    <span className="text-sky-700 pl-2">
                                        {" "}
                                        ₹{totalNetPay.toLocaleString("en-IN")}
                                    </span>
                                </p>
                            </div>
                            <div className="text-right ml-5 text-[12px]">
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
                </div>

                <div className="flex justify-between items-start">
                    <div className="grid grid-cols-6 gap-2 mb-3">
                        {[
                            { label: "GRN NO", key: "grnNo" },
                            { label: "ORDER NO", key: "orderNo" },
                            { label: "DELIVERY TO", key: "deliveryTo" },
                            { label: "FABRIC NAME", key: "fabName" },
                            { label: "Dia", key: "dia" },
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

                        <div className="flex items-center text-[12px]">

                            {/* <FinYear
                                selectedYear={selectedYear}
                                selectmonths={selectmonths}
                                setSelectmonths={setSelectmonths}
                                autoFocusBuyer={autoFocusBuyer}
                            /> */}
                        </div>

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
                    <div className="right-0">
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

                <div className="grid grid-cols-2 gap-6">
                    <div
                        className="overflow-x-auto max-h-[455px] "
                        style={{ border: "1px solid gray", borderRadius: "16px" }}
                    >
                        <table className="w-full border-collapse border border-gray-300 text-[11px]">
                            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                                <tr>
                                    <th className="border p-1 text-left">S.No</th>
                                    <th className="border p-1 text-left">GRN No</th>
                                    <th className="border p-1 text-left">Order No</th>
                                    <th className="border p-1 text-left">Delivery To</th>
                                    <th className="border p-1 text-left">Fabric name</th>
                                    <th className="border p-1 text-left">Dia</th>
                                    <th className="border p-1 text-left">Uom</th>
                                    <th className="border p-1 text-left">Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.slice(0, 17).map((row, index) => {
                                    const globalIndex = index; // 0–16
                                    const serialNo =
                                        (currentPage - 1) * recordsPerPage + globalIndex + 1;
                                    return (
                                        <tr
                                            key={index}
                                            className="text-gray-800 bg-white even:bg-gray-100 "
                                        >

                                            <td className="border p-1 text-[10px] w-[25px]">
                                                {serialNo}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[60px]">
                                                {row.grnNo}
                                            </td>
                                            <td
                                                className="border p-1 text-[10px] w-[60px]"
                                            >
                                                {row.orderNo}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[25px]">
                                                {row.deliveryTo}
                                            </td>
                                            <td
                                                className="border p-1 text-[10px] w-[100px] whitespace-nowrap overflow-hidden text-ellipsis "
                                                style={{ maxWidth: "100px" }}
                                            >
                                                {row.fabName}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[30px]">
                                                {row.dia}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[25px]">
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
                    </div>

                    <div
                        className="overflow-x-auto max-h-[455px]"
                        style={{ border: "1px solid gray", borderRadius: "16px" }}
                    >
                        <table className="w-full border-collapse border border-gray-300 text-[11px]">
                            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
                                <tr>
                                    <th className="border p-1 text-left">S.No</th>
                                    <th className="border p-1 text-left">GRN No</th>
                                    <th className="border p-1 text-left">Order No</th>
                                    <th className="border p-1 text-left">Delivery To</th>
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

                                            <td className="border p-1 text-[10px] w-[25px]">
                                                {serialNo}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[60px]">
                                                {row.grnNo}
                                            </td>
                                            <td
                                                className="border p-1 text-[10px] w-[60px]"
                                            >
                                                {row.orderNo}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[30px]">
                                                {row.deliveryTo}
                                            </td>
                                            <td
                                                className="border p-1 text-[10px] w-[100px] whitespace-nowrap overflow-hidden text-ellipsis "
                                                style={{ maxWidth: "100px" }}
                                            >
                                                {row.fabName}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[30px]">
                                                {row.dia}
                                            </td>
                                            <td className="border p-1 text-[10px] w-[30px]">
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
                    </div>
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
