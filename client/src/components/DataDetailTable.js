import { useEffect, useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaStepBackward, FaStepForward, FaSearch, FaUserTie, FaUsers } from "react-icons/fa";

const DataDetailTable = ({ closeTable, employeeDet, search, setSearch,setSelectedState }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all"); // 'all', 'employee', 'staff'
  const recordsPerPage = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [employeeDet]);

  const handleFilterClick = (type) => {
    setFilterType(type);
  };

  const filteredData = employeeDet
    .filter((row) =>
      Object.keys(search).every((key) =>
        row[key]?.toString().toLowerCase().includes(search[key]?.toLowerCase() || "")
      )
    )
    .filter((row) => {
      if (filterType === "employee") return row.PAYCAT !== "STAFF";
      if (filterType === "staff") return row.PAYCAT === "STAFF";
      return true; // Show all if no filter applied
    });

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const totalRecords = filteredData.length;

  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-5/6 relative">

        {/* Close Button */}
        <button
          onClick={closeTable}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 uppercase">On Roll Insights</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Total Records: {totalRecords}</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-3">
          <button
            onClick={() => handleFilterClick("Labour") && setSelectedState("Labour")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all 
              ${filterType === "employee" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <FaUserTie size={16} /> Employees
          </button>

          <button
            onClick={() => handleFilterClick("Staff") && setSelectedState("Staff")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all 
              ${filterType === "staff" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <FaUsers size={16} /> Staff
          </button>

          <button
            onClick={() => handleFilterClick("all")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all 
              ${filterType === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            All
          </button>
        </div>

        {/* Search Inputs */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {["MIDCARD", "FNAME", "GENDER", "DEPARTMENT", "COMPCODE"].map((key) => (
            <div key={key} className="relative">
              <input
                type="text"
                placeholder={`Search ${key}...`}
                value={search[key] || ""}
                onChange={(e) => setSearch({ ...search, [key]: e.target.value })}
                className="w-full p-2 pl-8 text-gray-900 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-500 text-sm" />
            </div>
          ))}
        </div>

        {/* Two Tables Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Table - First 10 Records */}
          <div className="overflow-x-auto max-h-[450px]">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-blue-600 text-white sticky top-0">
                <tr>
                  <th className="border p-2 text-left">ID Card</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Gender</th>
                  <th className="border p-2 text-left">Department</th>
                  <th className="border p-2 text-left">Company</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {currentRecords.slice(0, 10).map((row, index) => (
                  <tr key={index} className="text-gray-700 bg-white even:bg-gray-100">
                    <td className="border p-2">{row.MIDCARD}</td>
                    <td className="border p-2">{row.FNAME}</td>
                    <td className="border p-2">{row.GENDER}</td>
                    <td className="border p-2">{row.DEPARTMENT}</td>
                    <td className="border p-2">{row.COMPCODE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Table - Next 10 Records */}
          <div className="overflow-x-auto max-h-[450px]">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-blue-600 text-white sticky top-0">
                <tr>
                  <th className="border p-2 text-left">ID Card</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Gender</th>
                  <th className="border p-2 text-left">Department</th>
                  <th className="border p-2 text-left">Company</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {currentRecords.slice(10, 20).map((row, index) => (
                  <tr key={index} className="text-gray-700 bg-white even:bg-gray-100">
                    <td className="border p-2">{row.MIDCARD}</td>
                    <td className="border p-2">{row.FNAME}</td>
                    <td className="border p-2">{row.GENDER}</td>
                    <td className="border p-2">{row.DEPARTMENT}</td>
                    <td className="border p-2">{row.COMPCODE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2 text-sm">
            <span className="text-sm font-semibold px-3">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDetailTable;
