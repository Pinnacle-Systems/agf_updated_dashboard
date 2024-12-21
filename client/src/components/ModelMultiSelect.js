import React, { useState } from "react";
import DropdownCom from "../Ui Component/modelParam";
import { FaUserPlus, FaBriefcase, FaUsers } from "react-icons/fa";

const ModelMultiSelect = ({ selectedBuyer, setSelectedBuyer, color,selectedState,setSelectedState }) => {
  const [showModel, setShowModel] = useState(false);

  const handleButtonClick = (state) => {
    setSelectedState(state);
  };

  const handleArrowClick = () => {
    setShowModel((prevState) => !prevState);
  };

  return (
    <div>
      <div>
        {/* Arrow Toggle Button */}
        <div
          className={`arrow-button bg-white hover:bg-gray-100 shadow-lg rounded-lg px-3 py-1 flex items-center justify-center ${
            showModel ? "translate-x-[-220px]" : ""
          }`}
          onClick={handleArrowClick}
          style={{
            position: "absolute",
            top: "5px",
            right: "15px",
            transition: "transform 0.3s ease, background-color 0.3s ease",
            cursor: "pointer",
          }}
        >
          <span
            className="text-gray-600 text-2xl transition-transform duration-300"
            style={{ color: color ? `${color}` : "#4B5563" }}
          >
            {showModel ? "❮" : "❯"}
          </span>
        </div>

        {/* Slide-In Model */}
        <div
          className={`model-box ${showModel ? "open" : "closed"}`}
          style={{
            position: "absolute",
            top: "0",
            right: showModel ? "0" : "-220px",
            width: "240px",
            height: "48vh",
            backgroundColor: "#f9f9f9",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
            transition: "right 0.3s ease",
            borderRadius: "8px 0 0 8px",
            zIndex: "20",
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
            {/* Buttons in Row Style */}
            <div className="flex items-center gap-4">
              {/* All Button */}
              <button
              title="All"
                onClick={() => handleButtonClick("All")}
                className={`group relative flex items-center justify-center px-3 py-3 text-white rounded-md ${
                  selectedState === "All" ? "bg-blue-600" : "bg-blue-500"
                } hover:bg-blue-700 shadow-lg transition-all duration-150`}
              >
                <FaUserPlus className="text-xl" />
                <span className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm">
                  All
                </span>
              </button>

              {/* Labour Button */}
              <button title="Labour"
                onClick={() => handleButtonClick("Labour")}
                className={`group relative flex items-center justify-center px-3 py-3 text-white rounded-md ${
                  selectedState === "Labour" ? "bg-green-600" : "bg-green-500"
                } hover:bg-green-700 shadow-lg transition-all duration-150`}
              >
                <FaBriefcase className="text-xl" />
                <span className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm">
                  Labour
                </span>
              </button>

              {/* Staff Button */}
              <button title="Staff"
                onClick={() => handleButtonClick("Staff")}
                className={`group relative flex items-center justify-center px-3 py-3 text-white rounded-md ${
                  selectedState === "Staff" ? "bg-purple-600" : "bg-purple-500"
                } hover:bg-purple-700 shadow-lg transition-all duration-150`}
              >
                <FaUsers className="text-xl" />
                <span className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm">
                  Staff
                </span>
              </button>
            </div>

            {/* Display Selected State */}
            <div className="mt-4 text-lg font-semibold text-gray-700">
              Selected: {selectedState || "None"}
            </div>

            {/* Dropdown Component */}
            <DropdownCom
              selectedBuyer={selectedBuyer}
              setSelectedBuyer={setSelectedBuyer}
              columnHeaderHeight="20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelMultiSelect;
