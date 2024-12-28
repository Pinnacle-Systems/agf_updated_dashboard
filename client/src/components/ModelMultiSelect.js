import SelectBuyer from "../Ui Component/modelParam";
import { FaUserPlus, FaBriefcase, FaUsers } from "react-icons/fa";
import * as React from 'react';


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

    <div >
      {/* Slide-Up Model */}
      <div
        className={`model-box ${showModel ? "open" : "closed"} transition-shadow delay-500`}
        style={{
          position: "fixed",
          bottom: showModel ? "0" : "-600px", // Adjust height
          left: "0",
          width: "290px",
          height: "500px", // Height of the sliding model
          backgroundColor: "#F1F3F6",
          boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.3)", // Deeper shadow for 3D effect
          transition: "bottom 0.3s ease",
          borderRadius: "8px 8px 0 0",
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
          <div className="flex items-center gap-2 mb-2">
            {/* All Button */}
            <button
              onClick={() => handleButtonClick("All")}
              className={`group relative flex items-center justify-center px-4 py-1 border-2 transition-all duration-300 ease-in-out ${selectedState === "All"
                ? "bg-blue-600 border-blue-600 text-white shadow-xl transform scale-100"
                : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white shadow-md transform hover:scale-105"
                } rounded-full`}
            >
              <span
                className={`absolute top-[-1.2rem] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-xs ${selectedState === "All" ? "text-blue-800" : "text-[#3F83F8]"
                  }`}
              >
                All
              </span>
              <FaUserPlus
                className={`text-lg transition-all duration-300 transform ${selectedState === "All" ? "scale-110 text-white" : "text-blue-500"
                  }`}
              />
            </button>

            {/* Labour Button */}
            <button
              onClick={() => handleButtonClick("Labour")}
              className={`group relative flex items-center justify-center px-4 py-1 border-2 transition-all duration-300 ease-in-out ${selectedState === "Labour"
                ? "bg-green-600 border-green-600 text-white shadow-xl transform scale-100"
                : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white shadow-md transform hover:scale-105"
                } rounded-full`}
            >
              <span
                className={`absolute top-[-1.2rem]  group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-xs ${selectedState === "Labour" ? "text-green-800" : "text-[#0E9F6E]"
                  }`}
              >
                Labour
              </span>
              <FaBriefcase
                className={`text-lg transition-all duration-300 transform ${selectedState === "Labour" ? "scale-110 text-white" : "text-green-500"
                  }`}
              />
            </button>

            {/* Staff Button */}
            <button
              onClick={() => handleButtonClick("Staff")}
              className={`group relative flex items-center justify-center px-4 py-1 border-2 transition-all duration-300 ease-in-out ${selectedState === "Staff"
                ? "bg-purple-600 border-purple-600 text-white shadow-xl transform scale-100"
                : "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white shadow-md transform hover:scale-105"
                } rounded-full`}
            >
              <span
                className={`absolute top-[-1.2rem]  group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-xs ${selectedState === "Staff" ? "text-purple-900" : "text-[#7E3AF2]"
                  }`}
              >
                Staff
              </span>
              <FaUsers
                className={`text-lg transition-all duration-300 transform ${selectedState === "Staff" ? "scale-110 text-white" : "text-purple-500"
                  }`}
              />
            </button>
          </div>



          {/* Select Company Section */}
          <label
            htmlFor="employeeType"
            className="text-[14px] font-semibold text-gray-700 mb-2 transition-all duration-300 hover:text-gray-800"
          >
            Select Company
          </label>

          <SelectBuyer
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
