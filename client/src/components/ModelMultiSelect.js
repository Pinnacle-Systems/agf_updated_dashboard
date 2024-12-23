import React from "react";
import DropdownCom from "../Ui Component/modelParam";
import { FaUserPlus, FaBriefcase, FaUsers } from "react-icons/fa";

const ModelMultiSelect = ({
  selectedBuyer,
  setSelectedBuyer,
  color,
  selectedState,
  setSelectedState,
  showModel,
  setShowModel,
}) => {
  const handleButtonClick = (state) => {
    setSelectedState(state);
  };

  return (
    <div>
      {/* Slide-Up Model */}
      <div
        className={`model-box ${showModel ? "open" : "closed"}`}
        style={{
          position: "absolute",
          bottom: showModel ? "0" : "-600px", // Adjust height
          left: "0",
          width: "290px",
          height: "440px", // Height of the sliding model
          backgroundColor: "#F1F3F6",
          boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.3)", // Deeper shadow for 3D effect
          transition: "bottom 0.3s ease",
          borderRadius: "8px 8px 0 0",
          border:"1px solid gray",
          zIndex: "20",
          border: "1px solid rgba(0, 0, 0, 0.1)", // Light border
        }}
      >
        <div
          className="model-content"
          style={{
            padding: "20px",
            overflowY: "auto",
            height: "100%",
          }}
        >
          {/* Select Employee Type Section */}
          <div className="mb-7">
            <label
              htmlFor="employeeType"
              className="text-[14px] font-semibold text-gray-700 mb-2 transition-all duration-300 hover:text-gray-800"
            >
              Select Employee Type
            </label>
          </div>

          <div className="flex items-center gap-4 mb-2">
            {/* All Button */}
            <button
              onClick={() => handleButtonClick("All")}
              className={`group relative flex items-center justify-center px-3 py-3 text-white rounded-md ${
                selectedState === "All" ? "bg-blue-600" : "bg-blue-500"
              } hover:bg-blue-700 shadow-xl transition-all duration-150 transform hover:scale-105`}
            >
              <span className="absolute top-[-1.5rem] text-[#3F83F8] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm">
                All
              </span>
              <FaUserPlus className="text-xl" />
            </button>

            {/* Labour Button */}
            <button
              onClick={() => handleButtonClick("Labour")}
              className={`group relative flex items-center justify-center px-3 py-3 text-white rounded-md ${
                selectedState === "Labour" ? "bg-green-600" : "bg-green-500"
              } hover:bg-green-700 shadow-xl transition-all duration-150 transform hover:scale-105`}
            >
              <span className="absolute top-[-1.5rem] text-[#0E9F6E] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm">
                Labour
              </span>
              <FaBriefcase className="text-xl" />
            </button>

            {/* Staff Button */}
            <button
              onClick={() => handleButtonClick("Staff")}
              className={`group relative flex items-center justify-center px-3 py-3 text-white rounded-md ${
                selectedState === "Staff" ? "bg-purple-600" : "bg-purple-500"
              } hover:bg-purple-700 shadow-xl transition-all duration-150 transform hover:scale-105`}
            >
              <span className="absolute top-[-1.5rem] text-[#7E3AF2] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm">
                Staff
              </span>
              <FaUsers className="text-xl" />
            </button>
          </div>

          {/* Select Company Section */}
          <label
            htmlFor="employeeType"
            className="text-[14px] font-semibold text-gray-700 mb-2 transition-all duration-300 hover:text-gray-800"
          >
            Select Company
          </label>

          <DropdownCom
            selectedBuyer={selectedBuyer}
            setSelectedBuyer={setSelectedBuyer}
            columnHeaderHeight="20"
          />

          {/* OK Button */}
          <button
            className={`absolute right-3 bottom-5 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
            style={{
              backgroundColor: color ? color : "#1D4ED8",
            }}
            onClick={() => setShowModel(false)}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelMultiSelect;
