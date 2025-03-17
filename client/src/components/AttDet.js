import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
  FaSearch,
} from "react-icons/fa";
import { useGetMisDashboardAttDetQuery } from "../redux/service/misDashboardService";

const AttritionDet = ({ closeTable, search, setSearch, selectedBuyer, color }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: salaryDetData } = useGetMisDashboardAttDetQuery({
    params: {
      filterBuyer: selectedBuyer || [],
      search: search || {},
    },
  });
     console.log(salaryDetData,"salareyData")
  const salaryDet = salaryDetData?.data || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [salaryDet]);

  const totalPages = Math.ceil(salaryDet.length / 20);
  const totalRecords = salaryDet.length;

  const currentRecords = salaryDet.slice(
    (currentPage - 1) * 20,
    currentPage * 20
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-[1280px] max-w-[1280px] relative">
        {/* Close Button */}
        <button
          onClick={closeTable}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">Attrition Insights</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Total Records: {totalRecords}
          </p>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {["EMPID", "FNAME", "DEPARTMENT", "REASON"].map((key) => (
            <div key={key} className="relative">
              <input
                type="text"
                placeholder={`Search ${key}...`}
                value={search[key] || ""}
                onChange={(e) =>
                  setSearch({ ...search, [key]: e.target.value })
                }
                className="w-full p-2 pl-8 text-gray-900 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-500 text-sm" />
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto max-h-[450px]">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-800 sticky top-0 tracking-wider">
              <tr>
                <th className="border p-2 text-left">ID Card</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Gender</th>
                <th className="border p-2 text-left">Department</th>
                <th className="border p-2 text-left">Company</th>
                <th className="border p-2 text-left">Reason for Resign</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {currentRecords.map((row, index) => (
                <tr
                  key={index}
                  className="text-gray-700 bg-white even:bg-gray-100"
                >
                  <td className="border p-2">{row.EMPID}</td>
                  <td className="border p-2">{row.FNAME}</td>
                  <td className="border p-2">{row.GENDER}</td>
                  <td className="border p-2">{row.DEPARTMENT}</td>
                  <td className="border p-2">{row.COMPCODE}</td>
                  <td className="border p-2 text-red-500 font-semibold">
                    {row.REASON || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2 text-sm">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md text-blue-600 hover:bg-gray-200"
            >
              <FaStepBackward size={16} />
            </button>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="p-2 rounded-md text-blue-600 hover:bg-gray-200"
            >
              <FaChevronLeft size={16} />
            </button>

            <span className="text-sm font-semibold px-3">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-md text-blue-600 hover:bg-gray-200"
            >
              <FaChevronRight size={16} />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md text-blue-600 hover:bg-gray-200"
            >
              <FaStepForward size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttritionDet;
