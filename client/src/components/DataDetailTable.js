import { useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaStepBackward, FaStepForward } from "react-icons/fa";

const DataDetailTable = ({ closeTable, employeeDet,search,setSearch }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  

  // Filtered Employee Data
  const filteredData = employeeDet.filter((row) =>
    Object.keys(search).every((key) =>
      row[key].toString().toLowerCase().includes(search[key].toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white p-5 rounded-lg shadow-2xl w-3/4 relative">
        
        {/* Close Button */}
        <button
          onClick={closeTable}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          On Roll Insights
        </h2>

        {/* Table */}
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-600 text-white sticky top-0">
              <tr>
                <th className="border p-2 text-left tracking-wider">Name</th>
                <th className="border p-2 text-left tracking-wider">Gender</th>
                <th className="border p-2 text-left tracking-wider">Joining Date</th>
                <th className="border p-2 text-left tracking-wider">Department</th>
                <th className="border p-2 text-left tracking-wider">Company Name</th>
              </tr>
              <tr className="bg-gray-700">
                {["FNAME", "GENDER", "DOJ", "DEPARTMENT", "COMPCODE"].map((key) => (
                  <th key={key} className="border p-1">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={search[key]}
                      onChange={(e) => setSearch({ ...search, [key]: e.target.value })}
                      className="w-full p-1 text-gray-900 text-xs border border-gray-400 rounded focus:outline-none"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs">
              {currentRecords.length > 0 ? (
                currentRecords.map((row, index) => (
                  <tr key={index} className={`text-gray-700 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                    <td className="border p-2">{row.FNAME}</td>
                    <td className="border p-2">{row.GENDER}</td>
                    <td className="border p-2">
                      {new Date(row.DOJ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border p-2">{row.DEPARTMENT}</td>
                    <td className="border p-2">{row.COMPCODE}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border p-2 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2 text-sm">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md text-white transition-all ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              <FaStepBackward size={14} />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md text-white transition-all ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              <FaChevronLeft size={14} />
            </button>

            <span className="text-sm font-semibold px-3">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md text-white transition-all ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              <FaChevronRight size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md text-white transition-all ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              <FaStepForward size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDetailTable;
